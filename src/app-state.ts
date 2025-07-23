import type { Taste, Strength, Recipe } from './types';

export type PageType = 'setup' | 'timer' | 'complete';

export class AppState {
  private beanWeight: number = 20;
  private taste: Taste = 'balanced';
  private strength: Strength = 'medium';
  private currentPage: PageType = 'setup';
  private recipe: Recipe | null = null;
  private listeners: Map<string, ((...args: unknown[]) => void)[]> = new Map();

  // Bean weight (5-50g)
  getBeanWeight(): number {
    return this.beanWeight;
  }

  setBeanWeight(weight: number): void {
    if (weight >= 5 && weight <= 50) {
      this.beanWeight = weight;
      this.emit('beanWeightChanged', weight);
    }
  }

  // Taste preference
  getTaste(): Taste {
    return this.taste;
  }

  setTaste(taste: Taste): void {
    this.taste = taste;
    this.emit('tasteChanged', taste);
  }

  // Strength preference
  getStrength(): Strength {
    return this.strength;
  }

  setStrength(strength: Strength): void {
    this.strength = strength;
    this.emit('strengthChanged', strength);
  }

  // Page navigation
  getCurrentPage(): PageType {
    return this.currentPage;
  }

  setCurrentPage(page: PageType): void {
    const previousPage = this.currentPage;
    this.currentPage = page;
    this.emit('pageChanged', { from: previousPage, to: page });
  }

  // Recipe
  getRecipe(): Recipe | null {
    return this.recipe;
  }

  setRecipe(recipe: Recipe): void {
    this.recipe = recipe;
    this.emit('recipeChanged', recipe);
  }

  // Event system
  on(event: string, listener: (...args: unknown[]) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(listener);
  }

  off(event: string, listener: (...args: unknown[]) => void): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: unknown): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach((listener) => listener(data));
    }
  }
}
