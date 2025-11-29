import { useState, useEffect } from 'react';
import { useHabits } from '../contexts/HabitContext';
import { useAuth } from '../contexts/AuthContext';
import HabitCard from './HabitCard';
import HabitForm from './HabitForm';
import { getRankInfo } from '../utils/levelSystem';
import './Dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { habits, levelInfo, addDebugXP } = useHabits();
  const [showHabitForm, setShowHabitForm] = useState(false);

  const rankInfo = getRankInfo(levelInfo.level);

  // Debug: Press Enter to add 100 XP
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Enter') {
        // Avoid adding XP when focusing on input elements
        const tag = e.target.tagName.toLowerCase();
        if (['input','textarea','button'].includes(tag)) return;
        addDebugXP(100);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [addDebugXP]);

  return (
    <div className="dashboard">
      {/* Header with user info and logout */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-title">Habitly</h1>
        </div>
        <div className="header-right">
          <span className="welcome-text">Welcome, <strong>{user.username}</strong></span>
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Level & XP Progress Section */}
        <div className="level-section">
          {/* Rank Display at Top */}
          <div className="rank-display">
            <img 
              src={rankInfo.image} 
              alt={rankInfo.title}
              className="rank-image"
            />
            <div className="rank-info">
              <h2 className="rank-title">{rankInfo.title}</h2>
              <p className="level-subtitle">Level {levelInfo.level}</p>
            </div>
          </div>
          
          {/* XP Progress Bar at Bottom */}
          <div className="xp-section">
            <div className="xp-numbers">
              <span className="xp-current">{levelInfo.currentXP}</span>
              <span className="xp-separator">/</span>
              <span className="xp-total">{levelInfo.xpForNextLevel} XP</span>
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill"
                style={{ width: `${levelInfo.progress}%` }}
              >
                <span className="progress-percentage">{Math.round(levelInfo.progress)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Habits Section */}
        <div className="habits-section">
          <div className="section-header">
            <h2 className="section-title">My Habits</h2>
            <button 
              className="add-habit-button"
              onClick={() => setShowHabitForm(true)}
            >
              + Add Habit
            </button>
          </div>

          {habits.length === 0 ? (
            <div className="empty-state">
              <p className="empty-icon">📝</p>
              <h3 className="empty-title">No habits yet!</h3>
              <p className="empty-description">
                Create your first habit to start building streaks and leveling up.
              </p>
              <button 
                className="empty-action-button"
                onClick={() => setShowHabitForm(true)}
              >
                Create Your First Habit
              </button>
            </div>
          ) : (
            <div className="habits-grid">
              {habits.map(habit => (
                <HabitCard key={habit.id} habit={habit} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Habit Form Modal */}
      {showHabitForm && (
        <HabitForm onClose={() => setShowHabitForm(false)} />
      )}
    </div>
  );
}
