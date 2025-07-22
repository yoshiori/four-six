const {
  calculateTotalWater,
  calculatePourAmounts,
  adjustForTaste,
  adjustForStrength,
  calculatePourTimings,
  calculateRecipe,
} = require('../src/brewing');

describe('Brewing calculations', () => {
  test('calculateTotalWater should return 300g for 20g of beans (1:15 ratio)', () => {
    const beanWeight = 20;
    const expectedWater = 300;

    const result = calculateTotalWater(beanWeight);

    expect(result).toBe(expectedWater);
  });

  test('calculatePourAmounts should divide 300g water into 5 pours with 4:6 ratio', () => {
    const totalWater = 300;
    const expectedPours = [60, 60, 60, 60, 60]; // 40% (120g) / 2 = 60g each, 60% (180g) / 3 = 60g each

    const result = calculatePourAmounts(totalWater);

    expect(result).toEqual(expectedPours);
    expect(result.reduce((sum, pour) => sum + pour, 0)).toBe(totalWater);
  });

  test('calculatePourAmounts should work with different water amounts', () => {
    const totalWater = 240;
    const expectedPours = [48, 48, 48, 48, 48]; // 40% (96g) / 2 = 48g each, 60% (144g) / 3 = 48g each

    const result = calculatePourAmounts(totalWater);

    expect(result).toEqual(expectedPours);
    expect(result.reduce((sum, pour) => sum + pour, 0)).toBe(totalWater);
  });

  describe('Taste adjustments', () => {
    test('adjustForTaste should adjust for sweet preference', () => {
      const basePours = [60, 60, 60, 60, 60];
      const taste = 'sweet';
      const expectedPours = [72, 48, 60, 60, 60]; // First pour +20%, second pour -20%

      const result = adjustForTaste(basePours, taste);

      expect(result).toEqual(expectedPours);
      expect(result.reduce((sum, pour) => sum + pour, 0)).toBe(300);
    });

    test('adjustForTaste should adjust for bright preference', () => {
      const basePours = [60, 60, 60, 60, 60];
      const taste = 'bright';
      const expectedPours = [48, 72, 60, 60, 60]; // First pour -20%, second pour +20%

      const result = adjustForTaste(basePours, taste);

      expect(result).toEqual(expectedPours);
      expect(result.reduce((sum, pour) => sum + pour, 0)).toBe(300);
    });

    test('adjustForTaste should return unchanged for balanced preference', () => {
      const basePours = [60, 60, 60, 60, 60];
      const taste = 'balanced';

      const result = adjustForTaste(basePours, taste);

      expect(result).toEqual(basePours);
    });
  });

  describe('Strength adjustments', () => {
    test('adjustForStrength should adjust for light preference', () => {
      const basePours = [60, 60, 60, 60, 60];
      const strength = 'light';
      // Light: equal distribution in last 3 pours
      const expectedPours = [60, 60, 60, 60, 60];

      const result = adjustForStrength(basePours, strength);

      expect(result).toEqual(expectedPours);
      expect(result.reduce((sum, pour) => sum + pour, 0)).toBe(300);
    });

    test('adjustForStrength should adjust for strong preference', () => {
      const basePours = [60, 60, 60, 60, 60];
      const strength = 'strong';
      // Strong: more in 3rd pour, less in 4th and 5th
      const expectedPours = [60, 60, 72, 54, 54];

      const result = adjustForStrength(basePours, strength);

      expect(result).toEqual(expectedPours);
      expect(result.reduce((sum, pour) => sum + pour, 0)).toBe(300);
    });

    test('adjustForStrength should return unchanged for medium preference', () => {
      const basePours = [60, 60, 60, 60, 60];
      const strength = 'medium';

      const result = adjustForStrength(basePours, strength);

      expect(result).toEqual(basePours);
    });
  });

  describe('Pour timings', () => {
    test('calculatePourTimings should return timings for 5 pours at 45-second intervals', () => {
      const expectedTimings = [0, 45, 90, 135, 180]; // seconds

      const result = calculatePourTimings();

      expect(result).toEqual(expectedTimings);
    });

    test('calculatePourTimings should handle custom interval', () => {
      const interval = 30;
      const expectedTimings = [0, 30, 60, 90, 120]; // seconds

      const result = calculatePourTimings(interval);

      expect(result).toEqual(expectedTimings);
    });
  });

  describe('Complete recipe calculation', () => {
    test('calculateRecipe should integrate all calculations', () => {
      const beanWeight = 20;
      const taste = 'sweet';
      const strength = 'strong';

      const result = calculateRecipe(beanWeight, taste, strength);

      expect(result).toMatchObject({
        beanWeight: 20,
        totalWater: 300,
        pours: [72, 48, 72, 54, 54],
        timings: [0, 45, 90, 135, 180],
        taste: 'sweet',
        strength: 'strong',
      });
      expect(result.pours.reduce((sum, pour) => sum + pour, 0)).toBe(300);
    });

    test('calculateRecipe should work with defaults', () => {
      const beanWeight = 15;

      const result = calculateRecipe(beanWeight);

      expect(result).toMatchObject({
        beanWeight: 15,
        totalWater: 225,
        pours: [45, 45, 45, 45, 45],
        timings: [0, 45, 90, 135, 180],
        taste: 'balanced',
        strength: 'medium',
      });
    });
  });
});
