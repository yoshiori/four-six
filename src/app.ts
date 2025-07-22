import { calculateRecipe } from './brewing';
import type { Recipe, Taste, Strength } from './types';

// DOM elements
const recipeForm = document.getElementById('recipeForm') as HTMLFormElement;
const recipeDisplay = document.getElementById(
  'recipeDisplay'
) as HTMLDivElement;
const timerSection = document.getElementById('timerSection') as HTMLDivElement;

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
