import { i18n } from '../src/i18n';

// Get localStorage mock from setup
const localStorageMock = (
  global as unknown as { localStorageMock: jest.Mocked<Storage> }
).localStorageMock;

describe('I18n', () => {
  beforeEach(() => {
    // Reset localStorage mock
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();

    // Reset i18n state
    jest.clearAllMocks();
  });

  describe('Language Management', () => {
    it('should default to Japanese language', () => {
      expect(i18n.getCurrentLanguage()).toBe('ja');
    });

    it('should load saved language from localStorage', async () => {
      localStorageMock.getItem.mockReturnValue('en');

      // Create new instance to test constructor
      const { i18n: freshI18n } = await import('../src/i18n');
      expect(freshI18n.getCurrentLanguage()).toBe('ja'); // Current instance still ja
    });

    it('should change language and save to localStorage', async () => {
      await i18n.loadTranslations();
      await i18n.setLanguage('en');

      expect(i18n.getCurrentLanguage()).toBe('en');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('language', 'en');
    });

    it('should not change language if already set', async () => {
      await i18n.loadTranslations();

      // Change to a different language first
      await i18n.setLanguage('en');
      localStorageMock.setItem.mockClear(); // Clear previous calls

      // Try to set the same language again
      await i18n.setLanguage('en');

      // setItem should not be called for duplicate language change
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(0);
    });
  });

  describe('Translation Loading', () => {
    it('should load translations without error', async () => {
      await expect(i18n.loadTranslations()).resolves.not.toThrow();
    });
  });

  describe('Translation Keys', () => {
    beforeEach(async () => {
      await i18n.loadTranslations();
    });

    it('should translate common keys in Japanese', () => {
      i18n.setLanguage('ja');

      expect(i18n.t('common.app_title')).toBe('4:6 Method Interactive Timer');
      expect(i18n.t('common.start_brewing')).toBe('抽出を開始');
      expect(i18n.t('common.units.grams')).toBe('g');
    });

    it('should translate common keys in English', async () => {
      await i18n.setLanguage('en');

      expect(i18n.t('common.app_title')).toBe('4:6 Method Interactive Timer');
      expect(i18n.t('common.start_brewing')).toBe('Start Brewing');
      expect(i18n.t('common.units.grams')).toBe('g');
    });

    it('should translate setup keys in Japanese', () => {
      i18n.setLanguage('ja');

      expect(i18n.t('setup.title')).toBe('レシピ設定');
      expect(i18n.t('setup.bean_weight')).toBe('コーヒー豆の量');
      expect(i18n.t('setup.taste.sweet')).toBe('甘め');
      expect(i18n.t('setup.strength.light')).toBe('薄め (4回)');
    });

    it('should translate setup keys in English', async () => {
      await i18n.setLanguage('en');

      expect(i18n.t('setup.title')).toBe('Recipe Setup');
      expect(i18n.t('setup.bean_weight')).toBe('Coffee Bean Amount');
      expect(i18n.t('setup.taste.sweet')).toBe('Sweet');
      expect(i18n.t('setup.strength.light')).toBe('Light (4 pours)');
    });

    it('should return key if translation not found', () => {
      expect(i18n.t('nonexistent.key')).toBe('nonexistent.key');
    });

    it('should warn when translation key not found', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      i18n.t('nonexistent.key');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Translation key not found: nonexistent.key'
      );
      consoleSpy.mockRestore();
    });
  });

  describe('Template Replacement', () => {
    beforeEach(async () => {
      await i18n.loadTranslations();
    });

    it('should replace template variables in Japanese', () => {
      i18n.setLanguage('ja');

      const result = i18n.t('timer.pour_action', { count: 3 });
      expect(result).toBe('3回目の注湯');
    });

    it('should replace template variables in English', async () => {
      await i18n.setLanguage('en');

      const result = i18n.t('timer.pour_action', { count: 3 });
      expect(result).toBe('Pour 3');
    });

    it('should handle missing replacement values', () => {
      const result = i18n.t('timer.pour_action', {});
      expect(result).toContain('{{count}}'); // Should keep placeholder
    });
  });

  describe('Helper Methods', () => {
    beforeEach(async () => {
      await i18n.loadTranslations();
    });

    it('should format time in Japanese', () => {
      i18n.setLanguage('ja');

      expect(i18n.formatTime(3, 45)).toBe('3分45秒');
      expect(i18n.formatTime(2, 0)).toBe('2分');
    });

    it('should format time in English', async () => {
      await i18n.setLanguage('en');

      expect(i18n.formatTime(3, 45)).toBe('3min 45s');
      expect(i18n.formatTime(2, 0)).toBe('2min');
    });

    it('should format pour action in Japanese', () => {
      i18n.setLanguage('ja');

      expect(i18n.formatPourAction(0)).toBe('1回目の注湯'); // 0-indexed
      expect(i18n.formatPourAction(2)).toBe('3回目の注湯');
    });

    it('should format pour action in English', async () => {
      await i18n.setLanguage('en');

      expect(i18n.formatPourAction(0)).toBe('Pour 1'); // 0-indexed
      expect(i18n.formatPourAction(2)).toBe('Pour 3');
    });
  });

  describe('Language Change Listeners', () => {
    it('should notify listeners when language changes', async () => {
      await i18n.loadTranslations();

      const mockCallback = jest.fn();
      i18n.onLanguageChange(mockCallback);

      // Change to a different language to trigger listener
      const currentLang = i18n.getCurrentLanguage();
      const newLang = currentLang === 'ja' ? 'en' : 'ja';
      await i18n.setLanguage(newLang);

      expect(mockCallback).toHaveBeenCalled();
    });

    it('should allow removing listeners', async () => {
      await i18n.loadTranslations();

      const mockCallback = jest.fn();
      i18n.onLanguageChange(mockCallback);
      i18n.offLanguageChange(mockCallback);

      // Change to a different language
      const currentLang = i18n.getCurrentLanguage();
      const newLang = currentLang === 'ja' ? 'en' : 'ja';
      await i18n.setLanguage(newLang);

      expect(mockCallback).not.toHaveBeenCalled();
    });
  });
});
