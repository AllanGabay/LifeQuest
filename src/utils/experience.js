export const getExperienceToNextLevel = (level) => {
    const baseXP = 100;
    const difficultyFactor = 0.15;
    return Math.round(baseXP * (1 + difficultyFactor * (level - 1)));
  };