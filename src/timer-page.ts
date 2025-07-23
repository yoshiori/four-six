import { AppState } from './app-state';
import { Timer, TimerState, TimerEvent } from './timer';
import { PourTimer, PourTimerEvent } from './pour-timer';
import type { Pour } from './types';
import { i18nSystem } from './i18n-system';

export class TimerPage {
  private appState: AppState;
  private timer: Timer | null = null;
  private pourTimer: PourTimer | null = null;
  private timerInterval: number | null = null;
  private currentPourIndex: number = 0;
  private currentPourAmount: number = 0;

  // DOM elements
  private currentAction!: HTMLElement;
  private currentAmount!: HTMLElement;
  private timerCountdown!: HTMLElement;
  private progressBar!: HTMLElement;
  private currentPour!: HTMLElement;
  private totalPours!: HTMLElement;
  private stopTimerBtn!: HTMLButtonElement;

  constructor(appState: AppState) {
    this.appState = appState;
    this.initializeElements();
    this.setupEventListeners();
    this.setupLanguageChangeListener();
  }

  private initializeElements(): void {
    this.currentAction = document.getElementById(
      'currentAction'
    ) as HTMLElement;
    this.currentAmount = document.getElementById(
      'currentAmount'
    ) as HTMLElement;
    this.timerCountdown = document.getElementById(
      'timerCountdown'
    ) as HTMLElement;
    this.progressBar = document.querySelector(
      '#progressBar > div'
    ) as HTMLElement;
    this.currentPour = document.getElementById('currentPour') as HTMLElement;
    this.totalPours = document.getElementById('totalPours') as HTMLElement;
    this.stopTimerBtn = document.getElementById(
      'stopTimerBtn'
    ) as HTMLButtonElement;
  }

  private setupEventListeners(): void {
    this.stopTimerBtn.addEventListener('click', () => {
      this.stopBrewing();
    });
  }

  private setupLanguageChangeListener(): void {
    // Update dynamic texts when language changes
    (
      window as { updateTimerPageDynamicValues?: () => void }
    ).updateTimerPageDynamicValues = () => {
      // Update current action text if we have an active pour
      if (this.pourTimer && this.currentPourIndex >= 0) {
        this.currentAction.textContent = i18nSystem.formatPourAction(
          this.currentPourIndex
        );
        this.currentAmount.textContent = `${this.currentPourAmount.toFixed(0)}${i18nSystem.t('common.units.grams')}`;
      }
    };
  }

  startBrewing(): void {
    const recipe = this.appState.getRecipe();
    if (!recipe) return;

    // Create pour array
    const pours: Pour[] = recipe.pours.map((amount, index) => ({
      amount,
      timing: recipe.timings[index],
    }));

    // Initialize timers
    this.timer = new Timer();
    this.pourTimer = new PourTimer(pours);

    // Setup timer event listeners
    this.setupTimerEventListeners();

    // Start pour timer (shows first pour)
    this.pourTimer.start();

    // Start 45-second countdown to next pour
    this.startCountdownTimer(45);

    // Start timer interval for countdown
    this.startTimerInterval();
  }

  private setupTimerEventListeners(): void {
    if (!this.timer || !this.pourTimer) return;

    // Timer events for countdown
    this.timer.on(TimerEvent.TICK, (seconds: unknown) => {
      this.updateCountdown(seconds as number);
    });

    this.timer.on(TimerEvent.COMPLETE, () => {
      this.onCountdownComplete();
    });

    // Pour timer events
    this.pourTimer.on(
      PourTimerEvent.POUR_READY,
      (pourIndex: unknown, amount: unknown) => {
        this.showPourInstruction(pourIndex as number, amount as number);
      }
    );

    this.pourTimer.on(PourTimerEvent.COMPLETE, () => {
      this.onBrewingComplete();
    });
  }

  private showPourInstruction(pourIndex: number, amount: number): void {
    // Store current values for language change updates
    this.currentPourIndex = pourIndex;
    this.currentPourAmount = amount;

    this.currentAction.textContent = i18nSystem.formatPourAction(pourIndex);
    this.currentAmount.textContent = `${amount.toFixed(0)}${i18nSystem.t('common.units.grams')}`;

    // Update progress and pour count
    this.updateUI();
  }

  private startCountdownTimer(seconds: number): void {
    if (this.timer) {
      this.timer.start(seconds);
    }
  }

  private onCountdownComplete(): void {
    if (!this.pourTimer) return;

    // Move to next pour if not finished
    if (!this.pourTimer.isFinished()) {
      this.pourTimer.nextPour();

      // Start countdown to next pour if not finished
      if (!this.pourTimer.isFinished()) {
        this.startCountdownTimer(45);
      }
    }
  }

  private updateCountdown(seconds: number): void {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    this.timerCountdown.textContent = `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  }

  private updateUI(): void {
    if (!this.pourTimer) return;

    // Update progress
    const progress = this.pourTimer.getProgress();
    this.progressBar.style.width = `${progress}%`;

    // Update pour count
    this.currentPour.textContent = (
      this.pourTimer.getCurrentPourIndex() + 1
    ).toString();
    this.totalPours.textContent = this.pourTimer.getTotalPours().toString();
  }

  private onBrewingComplete(): void {
    // Stop timer interval
    this.stopTimerInterval();

    // Navigate to complete page
    setTimeout(() => {
      this.appState.setCurrentPage('complete');
    }, 1000);
  }

  private startTimerInterval(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = window.setInterval(() => {
      if (this.timer && this.timer.getState() === TimerState.RUNNING) {
        this.timer.tick();
      }
    }, 1000);
  }

  private stopTimerInterval(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private stopBrewing(): void {
    // Stop timer interval
    this.stopTimerInterval();

    // Stop timers
    if (this.timer) {
      this.timer.stop();
    }

    // Clear timer instances
    this.timer = null;
    this.pourTimer = null;

    // Navigate back to setup page
    this.appState.setCurrentPage('setup');
  }
}
