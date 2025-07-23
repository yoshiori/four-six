import { i18n, Language } from './i18n';

export class I18nSystem {
  private static instance: I18nSystem;

  public static getInstance(): I18nSystem {
    if (!I18nSystem.instance) {
      I18nSystem.instance = new I18nSystem();
    }
    return I18nSystem.instance;
  }

  private constructor() {
    i18n.onLanguageChange(() => {
      this.updateAllTranslations();
      this.updateLanguageButtons();
    });
  }

  async initialize(): Promise<void> {
    await i18n.loadTranslations();
    this.updateAllTranslations();
    this.updateLanguageButtons();
    this.setupLanguageButtons();
  }

  private setupLanguageButtons(): void {
    const jaBtn = document.getElementById('lang-ja');
    const enBtn = document.getElementById('lang-en');

    jaBtn?.addEventListener('click', () => {
      i18n.setLanguage('ja');
    });

    enBtn?.addEventListener('click', () => {
      i18n.setLanguage('en');
    });
  }

  private updateLanguageButtons(): void {
    const jaBtn = document.getElementById('lang-ja');
    const enBtn = document.getElementById('lang-en');
    const currentLang = i18n.getCurrentLanguage();

    if (jaBtn && enBtn) {
      // Reset styles
      jaBtn.className =
        'px-3 py-1 text-sm rounded hover:bg-amber-200 transition-colors';
      enBtn.className =
        'px-3 py-1 text-sm rounded hover:bg-gray-200 transition-colors';

      // Apply active styles
      if (currentLang === 'ja') {
        jaBtn.className += ' bg-amber-100 text-amber-700';
        enBtn.className += ' bg-gray-100 text-gray-700';
      } else {
        jaBtn.className += ' bg-gray-100 text-gray-700';
        enBtn.className += ' bg-amber-100 text-amber-700';
      }
    }
  }

  private updateAllTranslations(): void {
    // Update elements with data-i18n attributes
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach((element) => {
      const key = element.getAttribute('data-i18n');
      if (key) {
        // Special handling for elements with child elements like spans
        const hasValueSpan = element.querySelector(
          '#beanWeightValue, #tasteValue, #strengthValue'
        );
        if (hasValueSpan) {
          // For labels with value spans, only update the text content, preserve the spans
          const textNode = Array.from(element.childNodes).find(
            (node) => node.nodeType === Node.TEXT_NODE
          );
          if (textNode) {
            textNode.textContent = i18n.t(key);
          } else {
            // Create text node and insert before the span
            const newTextNode = document.createTextNode(i18n.t(key) + ' ');
            element.insertBefore(newTextNode, hasValueSpan);
          }
        } else {
          element.textContent = i18n.t(key);
        }
      }
    });

    // Update special elements that need custom handling
    this.updateDynamicTexts();
  }

  private updateDynamicTexts(): void {
    // Bean weight label has special handling since it contains a value span
    // But we'll let the standard data-i18n processing handle it
    // No special processing needed here anymore

    // Update slider range labels - only update if elements exist
    this.updateSliderLabels();

    // Update recipe preview - only update if elements exist
    this.updateRecipePreview();

    // Update dynamic values in SetupPage if available
    const updateFunction = (
      window as { updateSetupPageDynamicValues?: () => void }
    ).updateSetupPageDynamicValues;
    if (typeof updateFunction === 'function') {
      updateFunction();
    }
  }

  private updateSliderLabels(): void {
    // Taste slider labels - check if elements exist first
    const tasteContainer = document
      .querySelector('#tasteSlider')
      ?.parentElement?.querySelector('.flex.justify-between');
    if (tasteContainer) {
      const spans = tasteContainer.querySelectorAll('span[data-i18n]');
      if (spans.length >= 3) {
        // Use data-i18n attributes instead of hardcoded paths
        spans.forEach((span) => {
          const key = span.getAttribute('data-i18n');
          if (key) {
            span.textContent = i18n.t(key);
          }
        });
      }
    }

    // Strength slider labels - check if elements exist first
    const strengthContainer = document
      .querySelector('#strengthSlider')
      ?.parentElement?.querySelector('.flex.justify-between');
    if (strengthContainer) {
      const spans = strengthContainer.querySelectorAll('span[data-i18n]');
      if (spans.length >= 3) {
        // Use data-i18n attributes instead of hardcoded paths
        spans.forEach((span) => {
          const key = span.getAttribute('data-i18n');
          if (key) {
            span.textContent = i18n.t(key);
          }
        });
      }
    }
  }

  private updateRecipePreview(): void {
    // Update recipe preview labels using data-i18n attributes
    const previewElements = document.querySelectorAll(
      '#recipePreview strong[data-i18n]'
    );
    previewElements.forEach((element) => {
      const key = element.getAttribute('data-i18n');
      if (key) {
        element.textContent = i18n.t(key);
      }
    });
  }

  // Public methods for components to use
  public t(
    key: string,
    replacements?: Record<string, string | number>
  ): string {
    return i18n.t(key, replacements);
  }

  public formatTime(minutes: number, seconds: number): string {
    return i18n.formatTime(minutes, seconds);
  }

  public formatPourAction(pourIndex: number): string {
    return i18n.formatPourAction(pourIndex);
  }

  public getCurrentLanguage(): Language {
    return i18n.getCurrentLanguage();
  }

  public setLanguage(lang: Language): Promise<void> {
    return i18n.setLanguage(lang);
  }
}

// Global instance
export const i18nSystem = I18nSystem.getInstance();
