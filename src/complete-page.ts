import { AppState } from './app-state';
import { i18nSystem } from './i18n-system';

export class CompletePage {
  private appState: AppState;

  // DOM elements
  private summaryBeans!: HTMLElement;
  private summaryWater!: HTMLElement;
  private summaryPours!: HTMLElement;
  private summaryTime!: HTMLElement;
  private brewAgainBtn!: HTMLButtonElement;

  constructor(appState: AppState) {
    this.appState = appState;
    this.initializeElements();
    this.setupEventListeners();
    this.displaySummary();
  }

  private initializeElements(): void {
    this.summaryBeans = document.getElementById('summaryBeans') as HTMLElement;
    this.summaryWater = document.getElementById('summaryWater') as HTMLElement;
    this.summaryPours = document.getElementById('summaryPours') as HTMLElement;
    this.summaryTime = document.getElementById('summaryTime') as HTMLElement;
    this.brewAgainBtn = document.getElementById(
      'brewAgainBtn'
    ) as HTMLButtonElement;
  }

  private setupEventListeners(): void {
    this.brewAgainBtn.addEventListener('click', () => {
      // Navigate back to setup page
      this.appState.setCurrentPage('setup');
    });
  }

  private displaySummary(): void {
    const recipe = this.appState.getRecipe();
    if (!recipe) return;

    // Display summary information
    this.summaryBeans.textContent = `${recipe.beanWeight}${i18nSystem.t('common.units.grams')}`;
    this.summaryWater.textContent = `${recipe.totalWater}${i18nSystem.t('common.units.ml')}`;
    this.summaryPours.textContent = `${recipe.pours.length}${i18nSystem.t('common.units.times')}`;

    // Calculate total brewing time
    const totalSeconds = (recipe.pours.length - 1) * 45;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    this.summaryTime.textContent = i18nSystem.formatTime(minutes, seconds);
  }
}
