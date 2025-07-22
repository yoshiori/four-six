import {
  calculateTotalWater,
  calculateRecipe,
  calculatePoursByTaste,
  calculatePoursByStrength,
} from '../src/brewing';

describe('4:6 Method Brewing calculations', () => {
  test('calculateTotalWater should return 300g for 20g of beans (1:15 ratio)', () => {
    const beanWeight = 20;
    const expectedWater = 300;

    const result = calculateTotalWater(beanWeight);

    expect(result).toBe(expectedWater);
  });

  describe('Pour calculation by taste', () => {
    test('calculatePoursByTaste should calculate pours for sweet preference', () => {
      const beanWeight = 20;
      const taste = 'sweet' as const;
      const expectedPours = [72, 48]; // First pour +20%, second pour -20% from 60g each

      const result = calculatePoursByTaste(beanWeight, taste);

      expect(result).toEqual(expectedPours);
      expect(result.reduce((sum, pour) => sum + pour, 0)).toBe(120); // 40% of 300g
    });

    test('calculatePoursByTaste should calculate pours for bright preference', () => {
      const beanWeight = 20;
      const taste = 'bright' as const;
      const expectedPours = [48, 72]; // First pour -20%, second pour +20% from 60g each

      const result = calculatePoursByTaste(beanWeight, taste);

      expect(result).toEqual(expectedPours);
      expect(result.reduce((sum, pour) => sum + pour, 0)).toBe(120); // 40% of 300g
    });

    test('calculatePoursByTaste should return balanced pours for balanced preference', () => {
      const beanWeight = 20;
      const taste = 'balanced' as const;
      const expectedPours = [60, 60]; // Equal distribution

      const result = calculatePoursByTaste(beanWeight, taste);

      expect(result).toEqual(expectedPours);
      expect(result.reduce((sum, pour) => sum + pour, 0)).toBe(120); // 40% of 300g
    });
  });

  describe('Pour calculation by strength', () => {
    test('calculatePoursByStrength should calculate 2 pours for light strength', () => {
      const beanWeight = 20;
      const strength = 'light' as const;
      const expectedPours = [90, 90]; // 60% divided by 2

      const result = calculatePoursByStrength(beanWeight, strength);

      expect(result).toEqual(expectedPours);
      expect(result.reduce((sum, pour) => sum + pour, 0)).toBe(180); // 60% of 300g
    });

    test('calculatePoursByStrength should calculate 3 pours for medium strength', () => {
      const beanWeight = 20;
      const strength = 'medium' as const;
      const expectedPours = [60, 60, 60]; // 60% divided by 3

      const result = calculatePoursByStrength(beanWeight, strength);

      expect(result).toEqual(expectedPours);
      expect(result.reduce((sum, pour) => sum + pour, 0)).toBe(180); // 60% of 300g
    });

    test('calculatePoursByStrength should calculate 4 pours for strong strength', () => {
      const beanWeight = 20;
      const strength = 'strong' as const;
      const expectedPours = [45, 45, 45, 45]; // 60% divided by 4

      const result = calculatePoursByStrength(beanWeight, strength);

      expect(result).toEqual(expectedPours);
      expect(result.reduce((sum, pour) => sum + pour, 0)).toBe(180); // 60% of 300g
    });
  });

  describe('Complete 4:6 recipe calculation', () => {
    test('calculateRecipe should create light strength recipe (4 pours total)', () => {
      const beanWeight = 20;
      const taste = 'balanced' as const;
      const strength = 'light' as const;

      const result = calculateRecipe(beanWeight, taste, strength);

      expect(result).toMatchObject({
        beanWeight: 20,
        totalWater: 300,
        pours: [60, 60, 90, 90], // 2 + 2 pours
        timings: [0, 45, 90, 135],
        taste: 'balanced',
        strength: 'light',
      });
      expect(result.pours.reduce((sum, pour) => sum + pour, 0)).toBe(300);
    });

    test('calculateRecipe should create medium strength recipe (5 pours total)', () => {
      const beanWeight = 20;
      const taste = 'balanced' as const;
      const strength = 'medium' as const;

      const result = calculateRecipe(beanWeight, taste, strength);

      expect(result).toMatchObject({
        beanWeight: 20,
        totalWater: 300,
        pours: [60, 60, 60, 60, 60], // 2 + 3 pours
        timings: [0, 45, 90, 135, 180],
        taste: 'balanced',
        strength: 'medium',
      });
      expect(result.pours.reduce((sum, pour) => sum + pour, 0)).toBe(300);
    });

    test('calculateRecipe should create strong strength recipe (6 pours total)', () => {
      const beanWeight = 20;
      const taste = 'balanced' as const;
      const strength = 'strong' as const;

      const result = calculateRecipe(beanWeight, taste, strength);

      expect(result).toMatchObject({
        beanWeight: 20,
        totalWater: 300,
        pours: [60, 60, 45, 45, 45, 45], // 2 + 4 pours
        timings: [0, 45, 90, 135, 180, 225],
        taste: 'balanced',
        strength: 'strong',
      });
      expect(result.pours.reduce((sum, pour) => sum + pour, 0)).toBe(300);
    });

    test('calculateRecipe should adjust taste with sweet preference', () => {
      const beanWeight = 20;
      const taste = 'sweet' as const;
      const strength = 'medium' as const;

      const result = calculateRecipe(beanWeight, taste, strength);

      expect(result).toMatchObject({
        beanWeight: 20,
        totalWater: 300,
        pours: [72, 48, 60, 60, 60], // First pour increased, second decreased
        timings: [0, 45, 90, 135, 180],
        taste: 'sweet',
        strength: 'medium',
      });
      expect(result.pours.reduce((sum, pour) => sum + pour, 0)).toBe(300);
    });

    test('calculateRecipe should adjust taste with bright preference', () => {
      const beanWeight = 20;
      const taste = 'bright' as const;
      const strength = 'medium' as const;

      const result = calculateRecipe(beanWeight, taste, strength);

      expect(result).toMatchObject({
        beanWeight: 20,
        totalWater: 300,
        pours: [48, 72, 60, 60, 60], // First pour decreased, second increased
        timings: [0, 45, 90, 135, 180],
        taste: 'bright',
        strength: 'medium',
      });
      expect(result.pours.reduce((sum, pour) => sum + pour, 0)).toBe(300);
    });
  });
});
