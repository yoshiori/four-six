export type Language = 'ja' | 'en';

export type TranslationKeys = {
  common: {
    app_title: string;
    app_description: string;
    start_brewing: string;
    stop: string;
    brew_again: string;
    units: {
      grams: string;
      ml: string;
      times: string;
      minutes: string;
      seconds: string;
      min_short: string;
      sec_short: string;
    };
  };
  setup: {
    title: string;
    bean_weight: string;
    taste_preference: string;
    strength_preference: string;
    recipe_preview: string;
    total_water: string;
    pour_count: string;
    brew_time: string;
    ratio: string;
    taste: {
      sweet: string;
      balanced: string;
      bright: string;
    };
    strength: {
      light: string;
      medium: string;
      strong: string;
    };
    taste_sweet: string;
    taste_balanced: string;
    taste_bright: string;
    strength_light: string;
    strength_standard: string;
    strength_strong: string;
  };
  timer: {
    preparing: string;
    pour_action: string;
    completed: string;
    enjoy_coffee: string;
    brewing_summary: string;
    beans_used: string;
    pour_label: string;
  };
  complete: {
    title: string;
    message: string;
    summary_title: string;
    beans_used: string;
    total_water: string;
    pour_count: string;
    brew_time: string;
  };
};

class I18n {
  private currentLanguage: Language = 'ja';
  private translations: Record<Language, TranslationKeys> = {} as Record<
    Language,
    TranslationKeys
  >;
  private listeners: Set<() => void> = new Set();

  constructor() {
    // Load saved language from localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem('language') as Language;
      if (saved && (saved === 'ja' || saved === 'en')) {
        this.currentLanguage = saved;
      }
    }
  }

  async loadTranslations(): Promise<void> {
    const [ja, en] = await Promise.all([
      import('./locales/ja'),
      import('./locales/en'),
    ]);

    this.translations.ja = ja.default;
    this.translations.en = en.default;
  }

  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  async setLanguage(lang: Language): Promise<void> {
    if (this.currentLanguage === lang) return;

    this.currentLanguage = lang;
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('language', lang);
    }

    // Notify all listeners
    this.listeners.forEach((callback) => callback());
  }

  onLanguageChange(callback: () => void): void {
    this.listeners.add(callback);
  }

  offLanguageChange(callback: () => void): void {
    this.listeners.delete(callback);
  }

  // Get nested translation using dot notation
  t(key: string, replacements?: Record<string, string | number>): string {
    const keys = key.split('.');
    let value: unknown = this.translations[this.currentLanguage];

    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
      if (value === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    if (typeof value !== 'string') {
      console.warn(`Translation value is not a string: ${key}`);
      return key;
    }

    // Replace placeholders like {{count}}
    if (replacements) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, placeholder) => {
        const replacement = replacements[placeholder];
        return replacement !== undefined ? String(replacement) : match;
      });
    }

    return value;
  }

  // Helper method for formatted strings
  formatTime(minutes: number, seconds: number): string {
    if (seconds > 0) {
      return this.t('common.units.minutes') === '分'
        ? `${minutes}分${seconds}秒`
        : `${minutes}min ${seconds}s`;
    } else {
      return this.t('common.units.minutes') === '分'
        ? `${minutes}分`
        : `${minutes}min`;
    }
  }

  formatPourAction(pourIndex: number): string {
    return this.t('timer.pour_action', { count: pourIndex + 1 });
  }
}

// Global instance
export const i18n = new I18n();
