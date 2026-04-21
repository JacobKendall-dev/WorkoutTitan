import { images } from '../data/challenges.js';
import { emitChallengeEvent } from './challengeEvents';

// ---------------------------------------------
// Helper: calculates max weight for qualifying sets
// Only counts sets that meet min reps requirement
// ---------------------------------------------
export const getMaxWeightForReps = (sets, minReps, minSets) => {
  if (!sets || sets.length === 0) return 0;

  // Filter sets that satisfy minimum reps condition
  const validSets = sets.filter(
    set => Number(set.reps) >= minReps
  );

  // Not enough valid sets → challenge not progressed
  if (validSets.length < minSets) return 0;

  // Return heaviest valid set
  return Math.max(
    ...validSets.map(set => Number(set.weight) || 0)
  );
};

// ---------------------------------------------
// Evaluates a single rule inside a challenge
// Returns TRUE if rule is satisfied
// ---------------------------------------------
export const checkRule = (rule, exercises, session) => {
  switch (rule.metric) {

    // Strength-based progression (e.g. bench press)
    case 'maxWeightForReps': {
      const sets = exercises[rule.exercise]?.sets || [];

      const value = getMaxWeightForReps(
        sets,
        rule.minReps,
        rule.minSets
      );

      return value >= rule.target;
    }
    //Checks for minimum reps within the minimum amount of allowed Sets
    case 'minimumReps': {
      const sets = exercises[rule.exercise]?.sets || [];

      const qualifyingSets = sets.filter(
        set => Number(set.reps) >= rule.target
      );

      return qualifyingSets.length >= rule.minSets;
    }

    // Simple max value check (e.g. personal best lift)
    case 'personalBest': {
      const value =
        exercises[rule.exercise]?.personalBest || 0;

      return value >= rule.target;
    }

    // Time-based challenges (uses session data instead of history)
    case 'time': {
      const value =
        session?.[rule.metric] || 0;

      return value >= rule.target;
    }

    // Unknown rule type → fail safe
    default:
      return false;
  }
};

// ---------------------------------------------
// Main challenge evaluator
// Supports AND / OR logic across multiple rules
// ---------------------------------------------
export const checkChallenge = (challenge, exercises, session = {}) => {
  const logic = challenge.requirements?.logic || "AND";
  const rules = challenge.requirements?.rules;

  // Safety check: invalid structure = not unlocked
  if (!Array.isArray(rules)) return false;

  // ALL rules must pass
  if (logic === "AND") {
    return rules.every(rule =>
      checkRule(rule, exercises, session)
    );
  }

  // ANY rule can pass
  if (logic === "OR") {
    return rules.some(rule =>
      checkRule(rule, exercises, session)
    );
  }

  return false;
};

// ---------------------------------------------
// Used for UI progress bars
// Returns numeric progress (not boolean)
// ---------------------------------------------
export const getProgress = (rule, exercises) => {
  switch (rule.metric) {

    // Strength progression tracking
    case 'maxWeightForReps': {
    const sets = exercises[rule.exercise]?.sets || [];

      return getMaxWeightForReps(
        sets,
        rule.minReps,
        rule.minSets
      );
    }
    //Reps progression tracking
    case 'minimumReps': {
    const sets = exercises[rule.exercise]?.sets || [];
      // get best qualifying set reps (or latest valid set)
      const validSets = sets.filter(
        set => Number(set.reps) >= rule.target
      );

      const bestReps = validSets.length
        ? Math.max(...validSets.map(s => Number(s.reps)))
        : 0;

      return bestReps;
    }

    // Simple tracked best value
    case 'personalBest':
      return exercises[rule.exercise]?.personalBest || 0;

    // Unknown metric → no progress tracking
    default:
      return 0;
  }
};

// ---------------------------------------------
// Global unlock checker (runs after workouts)
// Grants rewards for newly completed challenges
// ---------------------------------------------
export const checkAllChallenges = async (
  exerciseState,
  ownedItems,
  addOwnedItem
) => {
  for (const challenge of images) {

    // Determine if challenge is completed
    const unlocked = checkChallenge(
      challenge,
      exerciseState
    );

    const itemId = challenge.reward?.id;
    if (!itemId) continue;

    // Only grant reward once
    if (unlocked && !ownedItems.includes(itemId)) {
      await addOwnedItem(itemId);

    console.log("challenge:", challenge.id);
console.log("reward:", challenge.reward);
console.log("itemId:", challenge.reward?.id);

      // 🔥 broadcast completion
      emitChallengeEvent('CHALLENGE_COMPLETED', {
        id: challenge.id,
        name: challenge.name,
        tier: challenge.tier,
        exercise: challenge.requirements?.rules?.[0]?.exercise,
        reward: itemId,
      });
    }
  }
};