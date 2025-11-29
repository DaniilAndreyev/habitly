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

// Rank images (file names without spaces)
import bronze from '../assets/rank-bronze.png';
import silver from '../assets/rank-silver.webp';
import gold from '../assets/rank-gold.webp';
import platinum from '../assets/rank-platinum.webp';
import diamond from '../assets/rank-diamond.webp';
import grandmaster from '../assets/rank-grandmaster.webp';
import celestial from '../assets/rank-celestial.webp';
import eternity from '../assets/rank-eternity.webp';
import oneAboveAll from '../assets/rank-one-above-all.webp';

// Rank definitions based on level ranges
export const rankDefinitions = [
  { minLevel: 1, maxLevel: 4, key: 'bronze', title: 'Bronze', image: bronze },
  { minLevel: 5, maxLevel: 9, key: 'silver', title: 'Silver', image: silver },
  { minLevel: 10, maxLevel: 14, key: 'gold', title: 'Gold', image: gold },
  { minLevel: 15, maxLevel: 19, key: 'platinum', title: 'Platinum', image: platinum },
  { minLevel: 20, maxLevel: 24, key: 'diamond', title: 'Diamond', image: diamond },
  { minLevel: 25, maxLevel: 29, key: 'grandmaster', title: 'Grandmaster', image: grandmaster },
  { minLevel: 30, maxLevel: 39, key: 'celestial', title: 'Celestial', image: celestial },
  { minLevel: 40, maxLevel: 49, key: 'eternity', title: 'Eternity', image: eternity },
  { minLevel: 50, maxLevel: Infinity, key: 'oneAboveAll', title: 'One Above All', image: oneAboveAll }
];

export const getRankInfo = (level) => {
  return rankDefinitions.find(r => level >= r.minLevel && level <= r.maxLevel) || rankDefinitions[0];
};

export const getNextRankInfo = (level) => {
  const currentIndex = rankDefinitions.findIndex(r => level >= r.minLevel && level <= r.maxLevel);
  if (currentIndex === -1) return null;
  const next = rankDefinitions[currentIndex + 1];
  if (!next) return null;
  return {
    ...next,
    levelsRemaining: Math.max(next.minLevel - level, 0)
  };
};

export const getRankTitle = (level) => getRankInfo(level).title;

export default getRankInfo;
