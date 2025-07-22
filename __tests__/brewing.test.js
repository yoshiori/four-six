const { calculateTotalWater, calculatePourAmounts } = require('../src/brewing');

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
});
