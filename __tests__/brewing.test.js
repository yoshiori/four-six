const { calculateTotalWater } = require('../src/brewing');

describe('Brewing calculations', () => {
  test('calculateTotalWater should return 300g for 20g of beans (1:15 ratio)', () => {
    const beanWeight = 20;
    const expectedWater = 300;

    const result = calculateTotalWater(beanWeight);

    expect(result).toBe(expectedWater);
  });
});
