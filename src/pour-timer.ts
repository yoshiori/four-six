import type { Pour } from './brewing';

export enum PourTimerEvent {
  POUR_READY = 'pour_ready',
  COMPLETE = 'complete',
  START = 'start',
}

type EventListener = (...args: unknown[]) => void;

export class PourTimer {
  private pours: Pour[];
  private currentPourIndex: number = 0;
  private isStarted: boolean = false;
  private isCompleted: boolean = false;
  private eventListeners: Map<PourTimerEvent, EventListener[]> = new Map();

  constructor(pours: Pour[]) {
    if (pours.length === 0) {
      throw new Error('Pours array cannot be empty');
    }

    this.pours = [...pours];
    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    Object.values(PourTimerEvent).forEach((event) => {
      this.eventListeners.set(event, []);
    });
  }

  getCurrentPourIndex(): number {
    return this.currentPourIndex;
  }

  getTotalPours(): number {
    return this.pours.length;
  }

  getCurrentPour(): Pour | null {
    if (this.isCompleted) {
      return null;
    }
    return this.pours[this.currentPourIndex];
  }

  isFinished(): boolean {
    return this.isCompleted;
  }

  getProgress(): number {
    if (this.isCompleted) {
      return 100;
    }
    return Math.round((this.currentPourIndex / this.pours.length) * 100);
  }

  start(): void {
    if (this.isStarted) {
      throw new Error('Timer is already started');
    }

    this.isStarted = true;
    this.currentPourIndex = 0;

    this.emit(PourTimerEvent.START);
    this.emit(
      PourTimerEvent.POUR_READY,
      this.currentPourIndex,
      this.pours[this.currentPourIndex].amount
    );
  }

  nextPour(): void {
    if (this.isCompleted) {
      throw new Error('Timer is already completed');
    }

    this.currentPourIndex++;

    // Check if we've completed all pours
    if (this.currentPourIndex >= this.pours.length) {
      this.isCompleted = true;
      this.emit(PourTimerEvent.COMPLETE);
      return;
    }

    // Emit next pour ready event
    this.emit(
      PourTimerEvent.POUR_READY,
      this.currentPourIndex,
      this.pours[this.currentPourIndex].amount
    );
  }

  on(event: PourTimerEvent, listener: EventListener): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.push(listener);
    }
  }

  off(event: PourTimerEvent, listener: EventListener): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: PourTimerEvent, ...args: unknown[]): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((listener) => listener(...args));
    }
  }
}
