import { AppState } from './app-state';
import { calculateRecipe } from './brewing';
import type { Taste, Strength } from './types';
import { i18nSystem } from './i18n-system';

export class SetupPage {
  private appState: AppState;

  // DOM elements
  private beanWeightSlider!: HTMLInputElement;
  private beanWeightValue!: HTMLElement;
  private tasteSlider!: HTMLInputElement;
  private tasteValue!: HTMLElement;
  private strengthSlider!: HTMLInputElement;
  private strengthValue!: HTMLElement;

  // Preview elements
  private previewWater!: HTMLElement;
  private previewPours!: HTMLElement;
  private previewTime!: HTMLElement;
  private previewRatio!: HTMLElement;

  // Button
  private startBrewingBtn!: HTMLButtonElement;

  // Labels - now using i18n
  private getTasteLabel(value: string): string {
    const labels: Record<string, string> = {
      '0': i18nSystem.t('setup.taste.sweet'),
      '1': i18nSystem.t('setup.taste.balanced'),
      '2': i18nSystem.t('setup.taste.bright'),
    };
    return labels[value] || labels['1'];
  }

  private getStrengthLabel(value: string): string {
    const labels: Record<string, string> = {
      '0': i18nSystem.t('setup.strength.light'),
      '1': i18nSystem.t('setup.strength.medium'),
      '2': i18nSystem.t('setup.strength.strong'),
    };
    return labels[value] || labels['1'];
  }

  private readonly tasteValues: Record<string, Taste> = {
    '0': 'sweet',
    '1': 'balanced',
    '2': 'bright',
  };

  private readonly strengthValues: Record<string, Strength> = {
    '0': 'light',
    '1': 'medium',
    '2': 'strong',
  };

  constructor(appState: AppState) {
    this.appState = appState;
    // Wait for DOM to be fully loaded before initializing
    this.waitForElements()
      .then(() => {
        this.initializeElements();
        this.setupEventListeners();
        this.updatePreview();

        // Listen for language changes to update dynamic values
        i18nSystem.getCurrentLanguage(); // Initialize
        this.setupLanguageChangeListener();
      })
      .catch((error) => {
        console.warn('SetupPage initialization failed:', error);
        // Retry initialization after a delay
        setTimeout(() => {
          this.waitForElements()
            .then(() => {
              this.initializeElements();
              this.setupEventListeners();
              this.updatePreview();
              this.setupLanguageChangeListener();
            })
            .catch((retryError) => {
              console.error('SetupPage retry failed:', retryError);
            });
        }, 500);
      });
  }

  private async waitForElements(): Promise<void> {
    // Wait for elements to be available
    const checkElement = (id: string): boolean => {
      return document.getElementById(id) !== null;
    };

    const requiredElements = [
      'beanWeightSlider',
      'beanWeightValue',
      'tasteSlider',
      'tasteValue',
      'strengthSlider',
      'strengthValue',
      'previewWater',
      'previewPours',
      'previewTime',
      'previewRatio',
      'startBrewingBtn',
    ];

    // Poll for elements to exist
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max wait

    while (attempts < maxAttempts) {
      const allExists = requiredElements.every(checkElement);
      if (allExists) {
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
      attempts++;
    }

    console.warn('Some elements not found after timeout');
  }

  private initializeElements(): void {
    // Helper function to safely get elements with error checking
    const getElement = <T extends HTMLElement = HTMLElement>(id: string): T => {
      const element = document.getElementById(id) as T;
      if (!element) {
        console.error(`Element with ID '${id}' not found`);
        throw new Error(`Element with ID '${id}' not found`);
      }
      return element;
    };

    // Sliders
    this.beanWeightSlider = getElement<HTMLInputElement>('beanWeightSlider');
    this.beanWeightValue = getElement('beanWeightValue');
    this.tasteSlider = getElement<HTMLInputElement>('tasteSlider');
    this.tasteValue = getElement('tasteValue');
    this.strengthSlider = getElement<HTMLInputElement>('strengthSlider');
    this.strengthValue = getElement('strengthValue');

    // Preview
    this.previewWater = getElement('previewWater');
    this.previewPours = getElement('previewPours');
    this.previewTime = getElement('previewTime');
    this.previewRatio = getElement('previewRatio');

    // Button
    this.startBrewingBtn = getElement<HTMLButtonElement>('startBrewingBtn');

    // Set initial values from app state
    this.beanWeightSlider.value = this.appState.getBeanWeight().toString();
    this.beanWeightValue.textContent = `${this.appState.getBeanWeight()}g`;
  }

  private setupEventListeners(): void {
    // Bean weight slider
    this.beanWeightSlider.addEventListener('input', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value);
      this.appState.setBeanWeight(value);
      this.beanWeightValue.textContent = `${value}g`;
      this.updatePreview();
    });

    // Taste slider
    this.tasteSlider.addEventListener('input', (e) => {
      const value = (e.target as HTMLInputElement).value;
      const tasteLabel = this.getTasteLabel(value);
      const tasteValue = this.tasteValues[value];

      this.tasteValue.textContent = tasteLabel;
      this.appState.setTaste(tasteValue);
      this.updatePreview();
    });

    // Strength slider
    this.strengthSlider.addEventListener('input', (e) => {
      const value = (e.target as HTMLInputElement).value;
      const strengthLabel = this.getStrengthLabel(value);
      const strengthValue = this.strengthValues[value];

      this.strengthValue.textContent = strengthLabel;
      this.appState.setStrength(strengthValue);
      this.updatePreview();
    });

    // Start brewing button
    this.startBrewingBtn.addEventListener('click', () => {
      // Calculate and store recipe
      const recipe = calculateRecipe(
        this.appState.getBeanWeight(),
        this.appState.getTaste(),
        this.appState.getStrength()
      );
      this.appState.setRecipe(recipe);

      // Navigate to timer page
      this.appState.setCurrentPage('timer');
    });
  }

  private updatePreview(): void {
    const beanWeight = this.appState.getBeanWeight();
    const taste = this.appState.getTaste();
    const strength = this.appState.getStrength();

    // Calculate recipe for preview
    const recipe = calculateRecipe(beanWeight, taste, strength);

    // Update preview display
    this.previewWater.textContent = `${recipe.totalWater}${i18nSystem.t('common.units.ml')}`;
    this.previewPours.textContent = `${recipe.pours.length}${i18nSystem.t('common.units.times')}`;

    // Calculate total time (45 seconds between pours)
    const totalSeconds = (recipe.pours.length - 1) * 45;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const timeText = i18nSystem.formatTime(minutes, seconds);
    this.previewTime.textContent =
      i18nSystem.getCurrentLanguage() === 'ja'
        ? `約${timeText}`
        : `~${timeText}`;

    // Show ratio
    const ratio = Math.round(recipe.totalWater / beanWeight);
    this.previewRatio.textContent = `1:${ratio}`;
  }

  private setupLanguageChangeListener(): void {
    // Add a method to update dynamic values when language changes
    const updateDynamicValues = () => {
      // Update slider value displays when language changes
      if (
        this.tasteValue &&
        this.strengthValue &&
        this.tasteSlider &&
        this.strengthSlider
      ) {
        this.tasteValue.textContent = this.getTasteLabel(
          this.tasteSlider.value
        );
        this.strengthValue.textContent = this.getStrengthLabel(
          this.strengthSlider.value
        );
        this.updatePreview(); // Also update preview to translate time text
      }
    };

    // Store reference to update function so we can call it when language changes
    (
      window as { updateSetupPageDynamicValues?: () => void }
    ).updateSetupPageDynamicValues = updateDynamicValues;
  }
}
