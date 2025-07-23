import { AppState } from './app-state';
import { calculateRecipe } from './brewing';
import type { Taste, Strength } from './types';

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

  // Labels
  private readonly tasteLabels: Record<string, string> = {
    '0': '甘め',
    '1': 'バランス',
    '2': '酸味・明るめ',
  };

  private readonly strengthLabels: Record<string, string> = {
    '0': '薄め',
    '1': '標準',
    '2': '濃いめ',
  };

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
    this.initializeElements();
    this.setupEventListeners();
    this.updatePreview();
  }

  private initializeElements(): void {
    // Sliders
    this.beanWeightSlider = document.getElementById(
      'beanWeightSlider'
    ) as HTMLInputElement;
    this.beanWeightValue = document.getElementById(
      'beanWeightValue'
    ) as HTMLElement;
    this.tasteSlider = document.getElementById(
      'tasteSlider'
    ) as HTMLInputElement;
    this.tasteValue = document.getElementById('tasteValue') as HTMLElement;
    this.strengthSlider = document.getElementById(
      'strengthSlider'
    ) as HTMLInputElement;
    this.strengthValue = document.getElementById(
      'strengthValue'
    ) as HTMLElement;

    // Preview
    this.previewWater = document.getElementById('previewWater') as HTMLElement;
    this.previewPours = document.getElementById('previewPours') as HTMLElement;
    this.previewTime = document.getElementById('previewTime') as HTMLElement;
    this.previewRatio = document.getElementById('previewRatio') as HTMLElement;

    // Button
    this.startBrewingBtn = document.getElementById(
      'startBrewingBtn'
    ) as HTMLButtonElement;

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
      const tasteLabel = this.tasteLabels[value];
      const tasteValue = this.tasteValues[value];

      this.tasteValue.textContent = tasteLabel;
      this.appState.setTaste(tasteValue);
      this.updatePreview();
    });

    // Strength slider
    this.strengthSlider.addEventListener('input', (e) => {
      const value = (e.target as HTMLInputElement).value;
      const strengthLabel = this.strengthLabels[value];
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
    this.previewWater.textContent = `${recipe.totalWater}ml`;
    this.previewPours.textContent = `${recipe.pours.length}回`;

    // Calculate total time (45 seconds between pours)
    const totalSeconds = (recipe.pours.length - 1) * 45;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    this.previewTime.textContent =
      seconds > 0 ? `約${minutes}分${seconds}秒` : `約${minutes}分`;

    // Show ratio
    const ratio = Math.round(recipe.totalWater / beanWeight);
    this.previewRatio.textContent = `1:${ratio}`;
  }
}
