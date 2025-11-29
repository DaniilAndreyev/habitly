import { useState } from 'react';
import { useHabits } from '../contexts/HabitContext';
import { getStreakEmoji, isCompletedOnDate } from '../utils/streakTracker';
import { getRankInfo } from '../utils/levelSystem';
import './HabitCard.css';

export default function HabitCard({ habit }) {
  const { completeHabit, uncompleteHabit, getHabitStats, levelInfo } = useHabits();
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [oldRank, setOldRank] = useState(getRankInfo(levelInfo.level));
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBackfill, setShowBackfill] = useState(false);
  
  const stats = getHabitStats(habit.id);
  
  if (!stats) return null;

  const handleComplete = async () => {
    // Prevent multiple clicks while processing
    if (isProcessing) return;
    
    // Don't allow toggling off completion for today - only backfill should be permitted
    if (stats.isCompletedToday) {
      return;
    }

    setIsProcessing(true);
    
    // Complete and show XP gain
    const result = completeHabit(habit.id);
    
    if (result.success) {
      // Calculate XP with streak bonus
      const streakBonus = result.newStreak > 1 ? Math.min(result.newStreak * 0.05, 1.0) : 0;
      const totalXP = result.xpGained;
      
      let message = `+${totalXP} XP! 🎉`;
      if (streakBonus > 0) {
        const bonusPercent = Math.round(streakBonus * 100);
        message = `+${totalXP} XP! (+${bonusPercent}% streak bonus) 🔥`;
      }
      
      setSuccessMessage(message);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
      
      // Check for level up
      if (result.leveledUp) {
        const previousRank = oldRank;
        const newRank = getRankInfo(result.newLevel);
        if (previousRank.key !== newRank.key) {
          setShowLevelUp(true);
          setTimeout(() => setShowLevelUp(false), 3500);
        }
        setOldRank(newRank);
      }
    }
    
    setIsProcessing(false);
  };

  const handleBackfillToggle = (date) => {
    const isCompleted = isCompletedOnDate(habit.completedDates, date);
    
    if (isCompleted) {
      // Remove completion for this date
      uncompleteHabit(habit.id, date);
    } else {
      // Add completion for this date (no XP for backfill)
      completeHabit(habit.id, date);
    }
  };

  const getPastDays = (count = 7) => {
    const days = [];
    const today = new Date();
    
    for (let i = count - 1; i >= 1; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    
    return days;
  };

  const formatDateLabel = (date) => {
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#4ade80';
      case 'medium': return '#fbbf24';
      case 'hard': return '#f87171';
      default: return '#fbbf24';
    }
  };

  return (
    <div className={`habit-card ${stats.isCompletedToday ? 'completed' : ''}`}>
      <div className="habit-header">
        <div className="habit-title-section">
          <h3 className="habit-name">{habit.name}</h3>
          {habit.description && (
            <p className="habit-description">{habit.description}</p>
          )}
        </div>
        <div 
          className="difficulty-badge"
          style={{ backgroundColor: getDifficultyColor(habit.difficulty) }}
        >
          {habit.difficulty}
        </div>
      </div>

      <div className="habit-stats">
        <div className="stat-item">
          <span className="stat-emoji">{getStreakEmoji(stats.currentStreak)}</span>
          <div className="stat-info">
            <span className="stat-value">{stats.currentStreak}</span>
            <span className="stat-label">Current Streak</span>
          </div>
        </div>

        <div className="stat-item">
          <span className="stat-emoji">🏆</span>
          <div className="stat-info">
            <span className="stat-value">{stats.longestStreak}</span>
            <span className="stat-label">Best Streak</span>
          </div>
        </div>

        <div className="stat-item">
          <span className="stat-emoji">📊</span>
          <div className="stat-info">
            <span className="stat-value">{stats.totalCompletions}</span>
            <span className="stat-label">Total Days</span>
          </div>
        </div>
      </div>

      <div className="habit-footer">
        <div className="level-display">
          <span className="level-badge">Lv. {levelInfo.level}</span>
          <span className="xp-text">{levelInfo.currentXP} / {levelInfo.xpForNextLevel} XP</span>
        </div>

        <div className="footer-buttons">
          <button 
            className={`complete-button ${stats.isCompletedToday ? 'completed' : ''} ${isProcessing ? 'processing' : ''}`}
            onClick={handleComplete}
            disabled={stats.isCompletedToday || isProcessing}
          >
            {stats.isCompletedToday ? '✓ Done Today' : isProcessing ? 'Processing...' : 'Complete'}
          </button>
          
          <button 
            className="backfill-toggle-button"
            onClick={() => setShowBackfill(!showBackfill)}
            title="Log past days"
          >
            📅
          </button>
        </div>
      </div>

      {showBackfill && (
        <div className="backfill-section">
          <p className="backfill-title">Log Past Days (No XP)</p>
          <div className="backfill-days">
            {getPastDays(7).map((date, index) => {
              const isCompleted = isCompletedOnDate(habit.completedDates, date);
              return (
                <button
                  key={index}
                  className={`backfill-day ${isCompleted ? 'completed' : ''}`}
                  onClick={() => handleBackfillToggle(date)}
                >
                  <span className="day-label">{formatDateLabel(date)}</span>
                  <span className="day-status">{isCompleted ? '✓' : '○'}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="xp-popup">
          {successMessage}
        </div>
      )}
      
      {showLevelUp && (
        <div className="level-up-popup">
          <div className="level-up-content">
            <h3>🎊 RANK UP! 🎊</h3>
            <p className="new-level">Rank: {getRankInfo(levelInfo.level).title}</p>
            <img src={getRankInfo(levelInfo.level).image} alt={getRankInfo(levelInfo.level).title} className="rank-up-image" />
          </div>
        </div>
      )}
    </div>
  );
}
