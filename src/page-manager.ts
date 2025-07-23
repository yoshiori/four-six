import type { PageType } from './app-state';

export class PageManager {
  private pages: Map<PageType, HTMLElement> = new Map();
  private currentPage: PageType | null = null;

  constructor() {
    this.initializePages();
  }

  private initializePages(): void {
    // Get page elements
    const setupPage = document.getElementById('page-setup');
    const timerPage = document.getElementById('page-timer');
    const completePage = document.getElementById('page-complete');

    if (setupPage) this.pages.set('setup', setupPage);
    if (timerPage) this.pages.set('timer', timerPage);
    if (completePage) this.pages.set('complete', completePage);

    // Hide all pages initially
    this.pages.forEach((page) => {
      page.classList.add('hidden');
    });
  }

  showPage(pageType: PageType): void {
    // Hide current page
    if (this.currentPage) {
      const currentPageElement = this.pages.get(this.currentPage);
      if (currentPageElement) {
        currentPageElement.classList.add('hidden');
      }
    }

    // Show new page
    const newPageElement = this.pages.get(pageType);
    if (newPageElement) {
      newPageElement.classList.remove('hidden');
      this.currentPage = pageType;
    }
  }

  // Future: Add page transition animations
  async transitionToPage(
    pageType: PageType,
    _animation?: string
  ): Promise<void> {
    // For now, just show the page
    // Later we can add CSS transitions or animations
    this.showPage(pageType);
  }
}
