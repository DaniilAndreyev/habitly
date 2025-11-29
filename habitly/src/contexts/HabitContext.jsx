import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  calculateStreak, 
  getLongestStreak, 
  isCompletedOnDate,
  formatDateKey 
} from '../utils/streakTracker';
import { 
  calculateHabitXP, 
  getLevelFromXP 
} from '../utils/levelSystem';

const HabitContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};

export const HabitProvider = ({ children }) => {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [totalXP, setTotalXP] = useState(0);
  const [levelInfo, setLevelInfo] = useState({
    level: 1,
    currentXP: 0,
    xpForNextLevel: 100,
    progress: 0,
    totalXP: 0
  });

  // Load user's habits and XP from localStorage
  useEffect(() => {
    if (!user) {
      setHabits([]);
      setTotalXP(0);
      setLevelInfo({
        level: 1,
        currentXP: 0,
        xpForNextLevel: 100,
        progress: 0,
        totalXP: 0
      });
      return;
    }

    const storageKey = `habitly_habits_${user.username}`;
    const xpKey = `habitly_xp_${user.username}`;
    
    const storedHabits = localStorage.getItem(storageKey);
    const storedXP = localStorage.getItem(xpKey);
    
    if (storedHabits) {
      try {
        setHabits(JSON.parse(storedHabits));
      } catch (error) {
        console.error('Error loading habits:', error);
        setHabits([]);
      }
    }
    
    if (storedXP) {
      const xp = parseInt(storedXP, 10);
      setTotalXP(xp);
      setLevelInfo(getLevelFromXP(xp));
    }
  }, [user]);

  // Save habits to localStorage whenever they change
  useEffect(() => {
    if (user && habits.length >= 0) {
      const storageKey = `habitly_habits_${user.username}`;
      localStorage.setItem(storageKey, JSON.stringify(habits));
    }
  }, [habits, user]);

  // Save XP to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      const xpKey = `habitly_xp_${user.username}`;
      localStorage.setItem(xpKey, totalXP.toString());
      setLevelInfo(getLevelFromXP(totalXP));
    }
  }, [totalXP, user]);

  // Add a new habit
  const addHabit = (habitData) => {
    const newHabit = {
      id: Date.now().toString(),
      name: habitData.name,
      description: habitData.description || '',
      category: habitData.category || 'other',
      difficulty: habitData.difficulty || 'medium',
      completedDates: [],
      createdAt: new Date().toISOString(),
    };

    setHabits(prev => [...prev, newHabit]);
    return newHabit;
  };

  // Delete a habit
  const deleteHabit = (habitId) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
  };

  // Update a habit
  const updateHabit = (habitId, updates) => {
    setHabits(prev => prev.map(h => 
      h.id === habitId ? { ...h, ...updates } : h
    ));
  };

  // Complete a habit for a specific date
  const completeHabit = (habitId, date = new Date()) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return { success: false, error: 'Habit not found' };
    
    // Check if already completed on this date
    if (isCompletedOnDate(habit.completedDates, date)) {
      return { success: false, error: 'Already completed on this date' };
    }

    // Add completion date
    const updatedDates = [...habit.completedDates, date.toISOString()];
    
    // Calculate new streak
    const newStreak = calculateStreak(updatedDates);
    
    // Determine if this is a backfill (past date) or current completion
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const completionDate = new Date(date);
    completionDate.setHours(0, 0, 0, 0);
    const isBackfill = completionDate < today;
    
    // Calculate XP reward only for today's completion
    const xpGained = isBackfill ? 0 : calculateHabitXP(newStreak, habit.difficulty);
    
    // Update habit
    setHabits(prev => prev.map(h => 
      h.id === habitId 
        ? { ...h, completedDates: updatedDates }
        : h
    ));

    // Add XP only if not backfill
    let leveledUp = false;
    let newLevel = levelInfo.level;
    
    if (!isBackfill && xpGained > 0) {
      const newTotalXP = totalXP + xpGained;
      const oldLevel = levelInfo.level;
      const newLevelInfo = getLevelFromXP(newTotalXP);
      
      setTotalXP(newTotalXP);
      leveledUp = newLevelInfo.level > oldLevel;
      newLevel = newLevelInfo.level;
    }

    return { 
      success: true, 
      xpGained,
      newStreak,
      leveledUp,
      newLevel,
      isBackfill
    };
  };

  // Uncomplete a habit for a specific date (for corrections)
  const uncompleteHabit = (habitId, date = new Date()) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return { success: false, error: 'Habit not found' };

    const dateKey = formatDateKey(date);
    
    // Check if completed on this date
    if (!isCompletedOnDate(habit.completedDates, date)) {
      return { success: false, error: 'Not completed on this date' };
    }

    // Remove completion date
    const updatedDates = habit.completedDates.filter(
      d => formatDateKey(d) !== dateKey
    );
    
    // Update habit
    setHabits(prev => prev.map(h => 
      h.id === habitId 
        ? { ...h, completedDates: updatedDates }
        : h
    ));

    return { success: true };
  };

  // Get habit statistics
  const getHabitStats = (habitId) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return null;

    return {
      currentStreak: calculateStreak(habit.completedDates),
      longestStreak: getLongestStreak(habit.completedDates),
      totalCompletions: habit.completedDates.length,
      isCompletedToday: isCompletedOnDate(habit.completedDates, new Date())
    };
  };

  const value = {
    habits,
    totalXP,
    levelInfo,
    addHabit,
    deleteHabit,
    updateHabit,
    completeHabit,
    uncompleteHabit,
    getHabitStats,
  };

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
};
