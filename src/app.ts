import { AppState, PageType } from './app-state';
import { PageManager } from './page-manager';
import { SetupPage } from './setup-page';
import { TimerPage } from './timer-page';
import { CompletePage } from './complete-page';
import { i18nSystem } from './i18n-system';

class App {
  private appState: AppState;
  private pageManager: PageManager;
  private setupPage: SetupPage | null = null;
  private timerPage: TimerPage | null = null;
  private completePage: CompletePage | null = null;

  constructor() {
    this.appState = new AppState();
    this.pageManager = new PageManager();

    this.initialize();
  }

  private async initialize(): Promise<void> {
    // Initialize i18n system first
    await i18nSystem.initialize();

    this.initializeEventListeners();

    // Initialize pages after i18n is ready - only create once
    if (!this.setupPage) {
      this.setupPage = new SetupPage(this.appState);
    }

    // Show initial page
    this.pageManager.showPage('setup');
  }

  private initializeEventListeners(): void {
    // Listen for page changes
    this.appState.on('pageChanged', (data: unknown) => {
      const { to } = data as { from: string; to: string };
      this.handlePageChange(to);
    });
  }

  private handlePageChange(to: string): void {
    this.pageManager.showPage(to as PageType);

    // Initialize pages on demand
    if (to === 'timer' && !this.timerPage) {
      this.timerPage = new TimerPage(this.appState);
    } else if (to === 'complete' && !this.completePage) {
      this.completePage = new CompletePage(this.appState);
    }

    // Start timer when entering timer page
    if (to === 'timer' && this.timerPage) {
      this.timerPage.startBrewing();
    }
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
