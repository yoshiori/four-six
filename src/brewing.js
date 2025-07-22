function calculateTotalWater(beanWeight) {
  return beanWeight * 15;
}

function calculatePourAmounts(totalWater) {
  const firstPhase = totalWater * 0.4; // 40% for first 2 pours
  const secondPhase = totalWater * 0.6; // 60% for last 3 pours

  return [
    firstPhase / 2,
    firstPhase / 2,
    secondPhase / 3,
    secondPhase / 3,
    secondPhase / 3,
  ];
}

module.exports = { calculateTotalWater, calculatePourAmounts };
