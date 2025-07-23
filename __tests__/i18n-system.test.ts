// Test for i18n-system integration
// Note: Full integration testing is complex due to singleton pattern and DOM dependencies
// These tests verify the public API and basic functionality

describe('I18nSystem Integration', () => {
  // Mock DOM environment
  beforeEach(() => {
    // Reset document mock for each test
    (global as { document: object }).document = {
      getElementById: jest.fn().mockReturnValue(null),
      querySelector: jest.fn().mockReturnValue(null),
      querySelectorAll: jest.fn().mockReturnValue([]),
      createTextNode: jest
        .fn()
        .mockReturnValue({ textContent: '', nodeType: 3 }),
    };

    // Mock window
    (global as { window: object }).window = {};

    // Mock Node constants
    Object.defineProperty(global, 'Node', {
      value: { TEXT_NODE: 3 },
      writable: true,
    });
  });

  it('should export i18nSystem instance', async () => {
    const { i18nSystem } = await import('../src/i18n-system');
    expect(i18nSystem).toBeDefined();
    expect(typeof i18nSystem.initialize).toBe('function');
    expect(typeof i18nSystem.t).toBe('function');
    expect(typeof i18nSystem.setLanguage).toBe('function');
    expect(typeof i18nSystem.getCurrentLanguage).toBe('function');
  });

  it('should be a singleton', async () => {
    const { i18nSystem: instance1 } = await import('../src/i18n-system');
    const { i18nSystem: instance2 } = await import('../src/i18n-system');
    expect(instance1).toBe(instance2);
  });

  it('should handle initialization gracefully with missing DOM elements', async () => {
    const { i18nSystem } = await import('../src/i18n-system');

    // Should not throw even when DOM elements are missing
    await expect(i18nSystem.initialize()).resolves.not.toThrow();
  });

  it('should provide translation interface', async () => {
    const { i18nSystem } = await import('../src/i18n-system');

    // Should return string (even if not properly initialized in test environment)
    const result = i18nSystem.t('test.key');
    expect(typeof result).toBe('string');
  });

  it('should provide language management interface', async () => {
    const { i18nSystem } = await import('../src/i18n-system');

    // Should return a valid language
    const currentLang = i18nSystem.getCurrentLanguage();
    expect(['ja', 'en']).toContain(currentLang);

    // Should provide async setLanguage method
    expect(typeof i18nSystem.setLanguage).toBe('function');
  });

  it('should provide formatting utilities', async () => {
    const { i18nSystem } = await import('../src/i18n-system');

    const timeResult = i18nSystem.formatTime(3, 45);
    expect(typeof timeResult).toBe('string');

    const pourResult = i18nSystem.formatPourAction(0);
    expect(typeof pourResult).toBe('string');
  });
});
