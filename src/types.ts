export type Taste = 'sweet' | 'balanced' | 'bright';
export type Strength = 'light' | 'medium' | 'strong';

export interface Recipe {
  beanWeight: number;
  totalWater: number;
  pours: number[];
  timings: number[];
  taste: Taste;
  strength: Strength;
}
