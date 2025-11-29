/**
 * Streak Tracking Utilities
 * Handles streak calculations and date comparisons
 */

// Check if a date is today
export const isToday = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
};

// Check if a date is yesterday
export const isYesterday = (date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const checkDate = new Date(date);
  
  return (
    checkDate.getDate() === yesterday.getDate() &&
    checkDate.getMonth() === yesterday.getMonth() &&
    checkDate.getFullYear() === yesterday.getFullYear()
  );
};

// Get days between two dates
export const getDaysBetween = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  // Reset hours to compare only dates
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Format date to YYYY-MM-DD
export const formatDateKey = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Calculate current streak from completion dates
export const calculateStreak = (completedDates) => {
  if (!completedDates || completedDates.length === 0) return 0;
  
  // Sort dates in descending order (newest first)
  const sortedDates = completedDates
    .map(d => new Date(d))
    .sort((a, b) => b - a);
  
  // Check if most recent completion is today or yesterday
  const mostRecent = sortedDates[0];
  if (!isToday(mostRecent) && !isYesterday(mostRecent)) {
    return 0; // Streak broken
  }
  
  // Count consecutive days
  let streak = 1;
  let currentDate = new Date(mostRecent);
  
  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    
    const checkDate = sortedDates[i];
    
    // Check if this date is the day before the current date
    if (
      checkDate.getDate() === prevDate.getDate() &&
      checkDate.getMonth() === prevDate.getMonth() &&
      checkDate.getFullYear() === prevDate.getFullYear()
    ) {
      streak++;
      currentDate = checkDate;
    } else {
      break; // Streak broken
    }
  }
  
  return streak;
};

// Get longest streak from completion dates
export const getLongestStreak = (completedDates) => {
  if (!completedDates || completedDates.length === 0) return 0;
  
  // Sort dates in ascending order
  const sortedDates = completedDates
    .map(d => new Date(d))
    .sort((a, b) => a - b);
  
  let longestStreak = 1;
  let currentStreak = 1;
  
  for (let i = 1; i < sortedDates.length; i++) {
    const daysDiff = getDaysBetween(sortedDates[i - 1], sortedDates[i]);
    
    if (daysDiff === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  
  return longestStreak;
};

// Check if habit was completed on a specific date
export const isCompletedOnDate = (completedDates, date) => {
  const checkKey = formatDateKey(date);
  return completedDates.some(d => formatDateKey(d) === checkKey);
};

// Get completion rate for last N days
export const getCompletionRate = (completedDates, days = 7) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days + 1);
  
  let completedCount = 0;
  
  for (let i = 0; i < days; i++) {
    const checkDate = new Date(startDate);
    checkDate.setDate(checkDate.getDate() + i);
    
    if (isCompletedOnDate(completedDates, checkDate)) {
      completedCount++;
    }
  }
  
  return Math.round((completedCount / days) * 100);
};

// Get streak emoji based on streak count
export const getStreakEmoji = (streak) => {
  if (streak === 0) return '⚪';
  if (streak < 3) return '🔥';
  if (streak < 7) return '🔥🔥';
  if (streak < 14) return '🔥🔥🔥';
  if (streak < 30) return '💪🔥';
  if (streak < 60) return '⚡🔥';
  if (streak < 100) return '🚀🔥';
  return '👑🔥';
};
