/**
 * Level System Utilities
 * Handles XP calculation, level progression, and rewards
 */

// XP required for each level (exponential growth)
export const calculateXPForLevel = (level) => {
  // Level 1: 100 XP, Level 2: 150 XP, Level 3: 225 XP, etc.
  // Formula: baseXP * (1.5 ^ (level - 1))
  const baseXP = 100;
  return Math.floor(baseXP * Math.pow(1.5, level - 1));
};

// Get total XP needed to reach a specific level
export const getTotalXPForLevel = (targetLevel) => {
  let totalXP = 0;
  for (let i = 1; i < targetLevel; i++) {
    totalXP += calculateXPForLevel(i);
  }
  return totalXP;
};

// Calculate current level and progress from total XP
export const getLevelFromXP = (totalXP) => {
  let level = 1;
  let xpRemaining = totalXP;
  
  while (xpRemaining >= calculateXPForLevel(level)) {
    xpRemaining -= calculateXPForLevel(level);
    level++;
  }
  
  return {
    level,
    currentXP: xpRemaining,
    xpForNextLevel: calculateXPForLevel(level),
    progress: (xpRemaining / calculateXPForLevel(level)) * 100,
    totalXP
  };
};

// Calculate XP reward for completing a habit
export const calculateHabitXP = (streak, habitDifficulty = 'medium') => {
  const baseXP = {
    easy: 10,
    medium: 20,
    hard: 30
  };
  
  const base = baseXP[habitDifficulty] || baseXP.medium;
  
  // Streak bonus: +5% XP per day of streak (capped at 100% bonus)
  const streakBonus = Math.min(streak * 0.05, 1.0);
  
  return Math.floor(base * (1 + streakBonus));
};

// Milestone rewards (every 5 levels)
export const getMilestoneReward = (level) => {
  if (level % 5 !== 0) return null;
  
  const rewards = {
    5: { badge: '🌱', title: 'Seedling', description: 'Started your journey!' },
    10: { badge: '🌿', title: 'Growing Strong', description: 'Building momentum!' },
    15: { badge: '🌳', title: 'Mighty Oak', description: 'Habits taking root!' },
    20: { badge: '⭐', title: 'Rising Star', description: 'Shining bright!' },
    25: { badge: '💎', title: 'Diamond Mind', description: 'Unbreakable discipline!' },
    30: { badge: '👑', title: 'Habit Master', description: 'True dedication!' },
    35: { badge: '🚀', title: 'Sky Rocket', description: 'Reaching new heights!' },
    40: { badge: '🔥', title: 'On Fire', description: 'Unstoppable force!' },
    45: { badge: '🏆', title: 'Champion', description: 'Elite performance!' },
    50: { badge: '🌟', title: 'Legend', description: 'Legendary commitment!' }
  };
  
  return rewards[level] || { 
    badge: '🎖️', 
    title: `Level ${level} Elite`, 
    description: 'Keep going strong!' 
  };
};

// Get rank title based on level
export const getRankTitle = (level) => {
  if (level < 5) return 'Beginner';
  if (level < 10) return 'Novice';
  if (level < 15) return 'Intermediate';
  if (level < 20) return 'Advanced';
  if (level < 30) return 'Expert';
  if (level < 40) return 'Master';
  if (level < 50) return 'Grandmaster';
  return 'Legend';
};
