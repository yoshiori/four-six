export enum TimerState {
  IDLE = 'idle',
  RUNNING = 'running',
  PAUSED = 'paused',
  COMPLETED = 'completed',
}

export enum TimerEvent {
  TICK = 'tick',
  COMPLETE = 'complete',
  START = 'start',
  PAUSE = 'pause',
  RESUME = 'resume',
  STOP = 'stop',
}

type EventListener = (...args: unknown[]) => void;

export class Timer {
  private state: TimerState = TimerState.IDLE;
  private seconds: number = 0;
  private eventListeners: Map<TimerEvent, EventListener[]> = new Map();

  constructor() {
    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    Object.values(TimerEvent).forEach((event) => {
      this.eventListeners.set(event, []);
    });
  }

  getState(): TimerState {
    return this.state;
  }

  getCurrentSeconds(): number {
    return this.seconds;
  }

  start(duration: number): void {
    if (this.state === TimerState.RUNNING) {
      throw new Error('Timer is already running');
    }

    this.state = TimerState.RUNNING;
    this.seconds = duration;
    this.emit(TimerEvent.START, duration);
  }

  pause(): void {
    if (this.state !== TimerState.RUNNING) {
      throw new Error('Timer is not running');
    }

    this.state = TimerState.PAUSED;
    this.emit(TimerEvent.PAUSE);
  }

  resume(): void {
    if (this.state !== TimerState.PAUSED) {
      throw new Error('Timer is not paused');
    }

    this.state = TimerState.RUNNING;
    this.emit(TimerEvent.RESUME);
  }

  stop(): void {
    if (this.state === TimerState.IDLE) {
      return;
    }

    this.state = TimerState.IDLE;
    this.seconds = 0;
    this.emit(TimerEvent.STOP);
  }

  tick(): void {
    if (this.state !== TimerState.RUNNING) {
      return;
    }

    this.seconds--;
    this.emit(TimerEvent.TICK, this.seconds);

    if (this.seconds <= 0) {
      this.state = TimerState.COMPLETED;
      this.seconds = 0;
      this.emit(TimerEvent.COMPLETE);
    }
  }

  on(event: TimerEvent, listener: EventListener): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.push(listener);
    }
  }

  off(event: TimerEvent, listener: EventListener): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: TimerEvent, ...args: unknown[]): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((listener) => listener(...args));
    }
  }
}
