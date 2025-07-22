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

function adjustForTaste(basePours, taste) {
  const adjustedPours = [...basePours];

  if (taste === 'sweet') {
    // Sweet: more in first pour, less in second
    const adjustment = basePours[0] * 0.2;
    adjustedPours[0] = basePours[0] + adjustment;
    adjustedPours[1] = basePours[1] - adjustment;
  } else if (taste === 'bright') {
    // Bright: less in first pour, more in second
    const adjustment = basePours[0] * 0.2;
    adjustedPours[0] = basePours[0] - adjustment;
    adjustedPours[1] = basePours[1] + adjustment;
  }

  return adjustedPours;
}

function adjustForStrength(basePours, strength) {
  const adjustedPours = [...basePours];

  if (strength === 'strong') {
    // Strong: more in 3rd pour, less in 4th and 5th
    const totalLastThree = basePours[2] + basePours[3] + basePours[4];
    adjustedPours[2] = totalLastThree * 0.4; // 40% of last three
    adjustedPours[3] = totalLastThree * 0.3; // 30% of last three
    adjustedPours[4] = totalLastThree * 0.3; // 30% of last three
  }
  // Light and medium keep equal distribution (no change needed)

  return adjustedPours;
}

function calculatePourTimings(interval = 45) {
  const timings = [];
  for (let i = 0; i < 5; i++) {
    timings.push(i * interval);
  }
  return timings;
}

function calculateRecipe(beanWeight, taste = 'balanced', strength = 'medium') {
  const totalWater = calculateTotalWater(beanWeight);
  let pours = calculatePourAmounts(totalWater);
  pours = adjustForTaste(pours, taste);
  pours = adjustForStrength(pours, strength);
  const timings = calculatePourTimings();

  return {
    beanWeight,
    totalWater,
    pours,
    timings,
    taste,
    strength,
  };
}

module.exports = {
  calculateTotalWater,
  calculatePourAmounts,
  adjustForTaste,
  adjustForStrength,
  calculatePourTimings,
  calculateRecipe,
};
