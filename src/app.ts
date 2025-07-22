import { calculateRecipe } from './brewing';
import type { Recipe, Taste, Strength, Pour } from './types';
import { Timer, TimerState, TimerEvent } from './timer';
import { PourTimer, PourTimerEvent } from './pour-timer';

// DOM elements
const recipeForm = document.getElementById('recipeForm') as HTMLFormElement;
const recipeDisplay = document.getElementById(
  'recipeDisplay'
) as HTMLDivElement;
const timerSection = document.getElementById('timerSection') as HTMLDivElement;

// Timer DOM elements
const startTimerBtn = document.getElementById(
  'startTimer'
) as HTMLButtonElement;
const timerDisplay = document.getElementById('timerDisplay') as HTMLDivElement;
const currentAction = document.getElementById('currentAction') as HTMLElement;
const currentAmount = document.getElementById('currentAmount') as HTMLElement;
const timerCountdown = document.getElementById('timerCountdown') as HTMLElement;
const progressBar = document.querySelector('#progressBar > div') as HTMLElement;
const currentPour = document.getElementById('currentPour') as HTMLElement;
const totalPours = document.getElementById('totalPours') as HTMLElement;
const stopTimerBtn = document.getElementById(
  'stopTimerBtn'
) as HTMLButtonElement;

// Global timer instances
let currentTimer: Timer | null = null;
let currentPourTimer: PourTimer | null = null;
let currentRecipe: Recipe | null = null;
let timerInterval: number | null = null;

// Type guard functions
function isTaste(value: string): value is Taste {
  return ['sweet', 'balanced', 'bright'].includes(value);
}

function isStrength(value: string): value is Strength {
  return ['light', 'medium', 'strong'].includes(value);
}

// Form submission handler
recipeForm.addEventListener('submit', function (e: Event) {
  e.preventDefault();

  // Clear previous error messages
  clearErrorMessages();

  // Get form values
  const beanWeightInput = document.getElementById(
    'beanWeight'
  ) as HTMLInputElement;
  const beanWeight = parseFloat(beanWeightInput.value);
  const tasteInput = document.querySelector<HTMLInputElement>(
    'input[name="taste"]:checked'
  );
  const strengthInput = document.querySelector<HTMLInputElement>(
    'input[name="strength"]:checked'
  );

  // Validate inputs
  let hasErrors = false;

  // Validate bean weight
  if (isNaN(beanWeight) || beanWeight < 10 || beanWeight > 30) {
    showError(
      beanWeightInput,
      'コーヒー豆の重量は10-30gの範囲で入力してください'
    );
    hasErrors = true;
  }

  // Validate taste selection
  if (!tasteInput || !isTaste(tasteInput.value)) {
    const tasteContainer = document
      .querySelector<HTMLDivElement>('input[name="taste"]')
      ?.closest('div');
    if (tasteContainer) {
      showError(tasteContainer, '味の好みを選択してください');
    }
    hasErrors = true;
  }

  // Validate strength selection
  if (!strengthInput || !isStrength(strengthInput.value)) {
    const strengthContainer = document
      .querySelector<HTMLDivElement>('input[name="strength"]')
      ?.closest('div');
    if (strengthContainer) {
      showError(strengthContainer, '濃さの好みを選択してください');
    }
    hasErrors = true;
  }

  // If validation fails, stop here
  if (hasErrors || !tasteInput || !strengthInput) {
    return;
  }

  // Calculate recipe
  const recipe = calculateRecipe(
    beanWeight,
    tasteInput.value as Taste,
    strengthInput.value as Strength
  );

  // Store current recipe
  currentRecipe = recipe;

  // Display recipe
  displayRecipe(recipe);

  // Show timer section
  timerSection.classList.remove('hidden');
});

// Input validation functions
function showError(element: HTMLElement, message: string): void {
  // Remove existing error message
  const existingError = element.parentNode?.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }

  // Add error styling to input
  if (element.tagName === 'INPUT') {
    element.classList.add('border-red-500', 'focus:ring-red-500');
    element.classList.remove('border-gray-300', 'focus:ring-amber-500');
  }

  // Create and insert error message
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message text-red-500 text-xs mt-1';
  errorDiv.textContent = message;
  element.parentNode?.appendChild(errorDiv);
}

function clearErrorMessages(): void {
  // Remove all error messages
  document
    .querySelectorAll('.error-message')
    .forEach((error) => error.remove());

  // Reset input styling
  document.querySelectorAll('input').forEach((input) => {
    input.classList.remove('border-red-500', 'focus:ring-red-500');
    input.classList.add('border-gray-300', 'focus:ring-amber-500');
  });
}

// Real-time validation for bean weight
const beanWeightInput = document.getElementById(
  'beanWeight'
) as HTMLInputElement;
beanWeightInput.addEventListener('input', function (e: Event) {
  const target = e.target as HTMLInputElement;
  const value = parseFloat(target.value);
  const errorMessage = target.parentNode?.querySelector('.error-message');

  if (errorMessage) {
    if (!isNaN(value) && value >= 10 && value <= 30) {
      errorMessage.remove();
      target.classList.remove('border-red-500', 'focus:ring-red-500');
      target.classList.add('border-gray-300', 'focus:ring-amber-500');
    }
  }
});

function displayRecipe(recipe: Recipe): void {
  const tasteLabels: Record<Taste, string> = {
    sweet: '甘め',
    balanced: 'バランス',
    bright: '酸味・明るめ',
  };

  const strengthLabels: Record<Strength, string> = {
    light: '薄め',
    medium: '標準',
    strong: '濃いめ',
  };

  let html = `
    <div class="space-y-6">
      <div class="bg-amber-50 rounded-lg p-4">
        <h3 class="font-semibold text-amber-900 mb-2">レシピ概要</h3>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div><strong>コーヒー豆:</strong> ${recipe.beanWeight}g</div>
          <div><strong>総水量:</strong> ${recipe.totalWater}g</div>
          <div><strong>味の好み:</strong> ${tasteLabels[recipe.taste]}</div>
          <div><strong>濃さ:</strong> ${strengthLabels[recipe.strength]}</div>
        </div>
      </div>
      
      <div>
        <h3 class="font-semibold text-gray-900 mb-3">注湯スケジュール</h3>
        <div class="space-y-2">
  `;

  recipe.pours.forEach((pour, index) => {
    const minutes = Math.floor(recipe.timings[index] / 60);
    const seconds = recipe.timings[index] % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    html += `
      <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
        <span class="font-medium">${index + 1}回目</span>
        <span>${pour.toFixed(0)}g</span>
        <span class="text-sm text-gray-600">${timeString}</span>
      </div>
    `;
  });

  html += `
        </div>
      </div>
    </div>
  `;

  recipeDisplay.innerHTML = html;
}

// Timer functionality
function createPourArray(recipe: Recipe): Pour[] {
  return recipe.pours.map((amount, index) => ({
    amount,
    timing: recipe.timings[index],
  }));
}

function startBrewing(): void {
  if (!currentRecipe) return;

  // Create pour array
  const pours = createPourArray(currentRecipe);

  // Initialize timers
  currentTimer = new Timer();
  currentPourTimer = new PourTimer(pours);

  // Setup event listeners
  setupTimerEventListeners();

  // Start pour timer (shows first pour)
  currentPourTimer.start();

  // Start 45-second countdown to next pour
  startCountdownTimer(45);

  // Start timer interval for countdown
  startTimerInterval();

  // Show timer display and hide start button
  timerDisplay.classList.remove('hidden');
  startTimerBtn.classList.add('hidden');
}

function setupTimerEventListeners(): void {
  if (!currentTimer || !currentPourTimer) return;

  // Timer events for countdown
  currentTimer.on(TimerEvent.TICK, (seconds: unknown) => {
    updateCountdown(seconds as number);
  });

  currentTimer.on(TimerEvent.COMPLETE, () => {
    onCountdownComplete();
  });

  // Pour timer events
  currentPourTimer.on(
    PourTimerEvent.POUR_READY,
    (pourIndex: unknown, amount: unknown) => {
      showPourInstruction(pourIndex as number, amount as number);
    }
  );

  currentPourTimer.on(PourTimerEvent.COMPLETE, () => {
    onBrewingComplete();
  });
}

function showPourInstruction(pourIndex: number, amount: number): void {
  currentAction.textContent = `${pourIndex + 1}回目の注湯`;
  currentAmount.textContent = `${amount.toFixed(0)}g`;

  // Update progress and pour count
  updateUI();
}

function startCountdownTimer(seconds: number): void {
  if (currentTimer) {
    currentTimer.start(seconds);
  }
}

function onCountdownComplete(): void {
  if (!currentPourTimer) return;

  // Move to next pour if not finished
  if (!currentPourTimer.isFinished()) {
    currentPourTimer.nextPour();

    // Start countdown to next pour if not finished
    if (!currentPourTimer.isFinished()) {
      startCountdownTimer(45);
    }
  }
}

function updateCountdown(seconds: number): void {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  timerCountdown.textContent = `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
}

function updateUI(): void {
  if (!currentPourTimer) return;

  // Update progress
  const progress = currentPourTimer.getProgress();
  progressBar.style.width = `${progress}%`;

  // Update pour count
  currentPour.textContent = (
    currentPourTimer.getCurrentPourIndex() + 1
  ).toString();
  totalPours.textContent = currentPourTimer.getTotalPours().toString();
}

function onBrewingComplete(): void {
  // Stop timer interval
  stopTimerInterval();

  currentAction.textContent = '抽出完了！';
  currentAmount.textContent = '完成';
  timerCountdown.textContent = '0:00';

  // Show completion message
  setTimeout(() => {
    alert('コーヒーの抽出が完了しました！美味しくお召し上がりください。');
  }, 500);
}

function startTimerInterval(): void {
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  timerInterval = window.setInterval(() => {
    if (currentTimer && currentTimer.getState() === TimerState.RUNNING) {
      currentTimer.tick();
    }
  }, 1000);
}

function stopTimerInterval(): void {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function stopBrewing(): void {
  // Stop timer interval
  stopTimerInterval();

  // Stop timers
  if (currentTimer) {
    currentTimer.stop();
  }

  // Reset UI
  timerDisplay.classList.add('hidden');
  startTimerBtn.classList.remove('hidden');

  // Clear timer instances
  currentTimer = null;
  currentPourTimer = null;
}

// Event listeners for timer controls
startTimerBtn.addEventListener('click', startBrewing);
stopTimerBtn.addEventListener('click', stopBrewing);
