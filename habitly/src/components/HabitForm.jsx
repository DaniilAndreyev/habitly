import { useState } from 'react';
import { useHabits } from '../contexts/HabitContext';
import './HabitForm.css';

const HABIT_PRESETS = [
  { name: 'Study 2 hours', category: 'study', difficulty: 'medium', icon: '📚' },
  { name: 'Sleep 8 hours', category: 'sleep', difficulty: 'medium', icon: '😴' },
  { name: 'Exercise 30 min', category: 'exercise', difficulty: 'medium', icon: '💪' },
  { name: 'Read 20 pages', category: 'reading', difficulty: 'easy', icon: '📖' },
  { name: 'Meditate 10 min', category: 'wellness', difficulty: 'easy', icon: '🧘' },
  { name: 'Drink 8 glasses water', category: 'wellness', difficulty: 'easy', icon: '💧' },
  { name: 'Complete assignments', category: 'study', difficulty: 'hard', icon: '✏️' },
  { name: 'Review notes', category: 'study', difficulty: 'easy', icon: '📝' },
];

export default function HabitForm({ onClose }) {
  const { addHabit } = useHabits();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'study',
    difficulty: 'medium'
  });
  const [showPresets, setShowPresets] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter a habit name');
      return;
    }

    addHabit(formData);
    onClose();
  };

  const selectPreset = (preset) => {
    setFormData({
      name: preset.name,
      description: '',
      category: preset.category,
      difficulty: preset.difficulty
    });
    setShowPresets(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Create New Habit</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {showPresets ? (
          <div className="presets-section">
            <p className="presets-subtitle">Choose a student habit or create custom:</p>
            <div className="presets-grid">
              {HABIT_PRESETS.map((preset, index) => (
                <button
                  key={index}
                  className="preset-card"
                  onClick={() => selectPreset(preset)}
                >
                  <span className="preset-icon">{preset.icon}</span>
                  <span className="preset-name">{preset.name}</span>
                  <span className={`preset-difficulty ${preset.difficulty}`}>
                    {preset.difficulty}
                  </span>
                </button>
              ))}
            </div>
            <button 
              className="custom-button"
              onClick={() => setShowPresets(false)}
            >
              Or Create Custom Habit
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="habit-form">
            <div className="form-group">
              <label htmlFor="name">Habit Name *</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Study for 2 hours"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description (Optional)</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add details about this habit..."
                rows="3"
                maxLength={20}
              />
              <small className="char-counter">{formData.description.length}/20 characters</small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="study">📚 Study</option>
                  <option value="sleep">😴 Sleep</option>
                  <option value="exercise">💪 Exercise</option>
                  <option value="reading">📖 Reading</option>
                  <option value="wellness">🧘 Wellness</option>
                  <option value="other">📌 Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="difficulty">Difficulty</label>
                <select
                  id="difficulty"
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                >
                  <option value="easy">Easy (10 XP)</option>
                  <option value="medium">Medium (20 XP)</option>
                  <option value="hard">Hard (30 XP)</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="submit-button">
                Create Habit
              </button>
            </div>

            <button 
              type="button"
              className="back-to-presets"
              onClick={() => setShowPresets(true)}
            >
              ← Back to Presets
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
