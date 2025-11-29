import { useState } from 'react';
import { useHabits } from '../contexts/HabitContext';
import { getStreakEmoji } from '../utils/streakTracker';
import './HabitCard.css';

export default function HabitCard({ habit }) {
  const { completeHabit, uncompleteHabit, getHabitStats, levelInfo } = useHabits();
  const [showSuccess, setShowSuccess] = useState(false);
  
  const stats = getHabitStats(habit.id);
  
  if (!stats) return null;

  const handleComplete = async () => {
    if (stats.isCompletedToday) {
      // Uncomplete if already done
      uncompleteHabit(habit.id);
    } else {
      // Complete and show XP gain
      const result = completeHabit(habit.id);
      
      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }
    }
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

        <button 
          className={`complete-button ${stats.isCompletedToday ? 'completed' : ''}`}
          onClick={handleComplete}
        >
          {stats.isCompletedToday ? '✓ Done Today' : 'Complete'}
        </button>
      </div>

      {showSuccess && (
        <div className="xp-popup">
          +{habit.difficulty === 'easy' ? 10 : habit.difficulty === 'hard' ? 30 : 20} XP! 🎉
        </div>
      )}
    </div>
  );
}
