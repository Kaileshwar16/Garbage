/**
 * Mifflin-St Jeor BMR formula
 */
export function calcBMR(weight, height, age, gender) {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return Math.round(gender === "Female" ? base - 161 : base + 5);
}

/**
 * Total daily energy expenditure
 */
export function calcCalories(bmr, activityLevel) {
  const multipliers = {
    Beginner: 1.375,
    Intermediate: 1.55,
    Advanced: 1.725,
  };
  return Math.round(bmr * (multipliers[activityLevel] || 1.375));
}

/**
 * Daily protein target in grams
 */
export function calcProtein(weight, goal) {
  const gPerKg = {
    "Muscle Gain": 2.2,
    "Fat Loss": 2.0,
  };
  return Math.round(weight * (gPerKg[goal] || 1.8));
}

/**
 * Daily water target in litres
 */
export function calcWater(weight) {
  return parseFloat((weight * 0.033).toFixed(1));
}

/**
 * Target body weight based on goal
 */
export function calcTargetWeight(weight, goal) {
  if (goal === "Fat Loss")    return Math.round(weight * 0.9);
  if (goal === "Muscle Gain") return Math.round(weight * 1.08);
  return weight;
}

/**
 * Calories burned per minute based on activity level
 */
export function calsPerMin(activityLevel) {
  if (activityLevel === "Advanced")     return 9;
  if (activityLevel === "Intermediate") return 7;
  return 5;
}
