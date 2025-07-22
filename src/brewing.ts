import type { Taste, Strength, Recipe } from './types';

export type { Pour } from './types';

export function calculateTotalWater(beanWeight: number): number {
  return beanWeight * 15;
}

export function calculatePoursByTaste(
  beanWeight: number,
  taste: Taste
): number[] {
  const totalWater = calculateTotalWater(beanWeight);
  const firstPhaseWater = totalWater * 0.4; // 40% for first 2 pours
  const basePour = firstPhaseWater / 2;

  if (taste === 'sweet') {
    const adjustment = basePour * 0.2;
    return [basePour + adjustment, basePour - adjustment];
  } else if (taste === 'bright') {
    const adjustment = basePour * 0.2;
    return [basePour - adjustment, basePour + adjustment];
  } else {
    // balanced
    return [basePour, basePour];
  }
}

export function calculatePoursByStrength(
  beanWeight: number,
  strength: Strength
): number[] {
  const totalWater = calculateTotalWater(beanWeight);
  const secondPhaseWater = totalWater * 0.6; // 60% for remaining pours

  if (strength === 'light') {
    // Light: 2 pours (total 4)
    return [secondPhaseWater / 2, secondPhaseWater / 2];
  } else if (strength === 'medium') {
    // Medium: 3 pours (total 5)
    return [secondPhaseWater / 3, secondPhaseWater / 3, secondPhaseWater / 3];
  } else if (strength === 'strong') {
    // Strong: 4 pours (total 6)
    return [
      secondPhaseWater / 4,
      secondPhaseWater / 4,
      secondPhaseWater / 4,
      secondPhaseWater / 4,
    ];
  }

  // This should never happen with proper types, but TypeScript requires it
  throw new Error(`Invalid strength: ${strength}`);
}

export function calculateRecipe(
  beanWeight: number,
  taste: Taste = 'balanced',
  strength: Strength = 'medium'
): Recipe {
  const totalWater = calculateTotalWater(beanWeight);

  // Calculate pours by taste and strength
  const tastePours = calculatePoursByTaste(beanWeight, taste);
  const strengthPours = calculatePoursByStrength(beanWeight, strength);

  // Combine all pours
  const pours = tastePours.concat(strengthPours);

  // Calculate timings based on number of pours (45 second intervals)
  const timings: number[] = [];
  for (let i = 0; i < pours.length; i++) {
    timings.push(i * 45);
  }

  return {
    beanWeight,
    totalWater,
    pours,
    timings,
    taste,
    strength,
  };
}
