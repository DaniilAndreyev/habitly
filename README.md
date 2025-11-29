# Habitly

A gamified habit tracking web application that helps students build healthy routines through streak tracking, XP rewards, and level progression. The project demonstrates modern React development, state management, local storage persistence, and a polished dark/green UI design.

## 📑 Table of Contents

<details>
  <summary>Click to expand</summary>
  
  - [About](#about)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Project](#running-the-project)
  - [Project Structure](#project-structure)
  - [Features](#features)
  - [Authors](#authors)
  - [License](#license)
  - [Contact](#contact)
  - [Acknowledgments](#acknowledgments)
  
</details>

## 📘 About

**Habitly** is a React-based habit tracker designed specifically for students to manage daily routines like studying, sleep, exercise, and reading. The application gamifies habit building with an XP and leveling system, streak tracking with visual feedback, and the ability to backfill past days for demo purposes.

### Problem Addressed

Students often struggle to maintain consistent healthy habits due to:
- **Lack of motivation** - No immediate feedback or rewards for completing habits
- **Poor tracking** - Difficulty visualizing progress over time
- **Broken streaks** - Losing motivation after missing a single day
- **Complex interfaces** - Overwhelming habit tracking apps with too many features
- **No accountability** - Absence of progress milestones or achievement recognition

### Solution Delivered

Habitly solves these problems through:
- **Gamification mechanics** - XP rewards, levels, and visual rank progression create immediate positive feedback
- **Streak visualization** - Clear display of current streaks, best streaks, and total completions with emoji indicators
- **Forgiving system** - Backfill feature allows logging past days, reducing anxiety about broken streaks
- **Student-focused simplicity** - Clean interface with 8 preset habits tailored to student life
- **Achievement system** - 6 unique rank tiers with custom artwork provide long-term goals and milestones
- **One-click completion** - Streamlined daily habit logging with lock mechanism to prevent duplicate entries

## 🛠️ Tech Stack

| Technology | Version |
|------------|---------|
| **Framework** | React 19.2.0 |
| **Build Tool** | Vite 7.2.4 |
| **Language** | JavaScript (ES6+) |
| **Styling** | CSS3 with custom properties |
| **Storage** | Browser LocalStorage |
| **Linting** | ESLint 9.39.1 |

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- A modern web browser (Chrome, Firefox, Edge, Safari)
- A compatible IDE such as **VS Code** (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/DaniilAndreyev/habitly.git

# Navigate into the project directory
cd habitly/habitly

# Install dependencies
npm install
```

### Running the Project

**Development mode:**

```bash
# Start the development server
npm run dev
```

**Production build:**

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

**Linting:**

```bash
# Run ESLint
npm run lint
```

## 📂 Project Structure

```
habitly/
 ├─ public/
 ├─ src/
 │   ├─ assets/          # Static assets (images, icons)
 │   ├─ components/      # React components
 │   │   ├─ AuthForm.jsx       # Login/Register form
 │   │   ├─ AuthForm.css
 │   │   ├─ Dashboard.jsx      # Main dashboard view
 │   │   ├─ Dashboard.css
 │   │   ├─ HabitCard.jsx      # Individual habit display
 │   │   ├─ HabitCard.css
 │   │   ├─ HabitForm.jsx      # Create habit with presets
 │   │   └─ HabitForm.css
 │   ├─ contexts/        # React Context providers
 │   │   ├─ AuthContext.jsx    # User authentication
 │   │   └─ HabitContext.jsx   # Habit management & XP
 │   ├─ utils/           # Utility functions
 │   │   ├─ levelSystem.js     # XP calculations & rewards
 │   │   └─ streakTracker.js   # Streak calculation logic
 │   ├─ App.jsx          # Main App component
 │   ├─ App.css
 │   ├─ main.jsx         # React entry point
 │   └─ index.css        # Global styles
 ├─ index.html
 ├─ package.json
 ├─ vite.config.js
 ├─ eslint.config.js
 └─ README.md
```

### Directory Overview

- **components/** – Reusable UI components (auth, dashboard, habits)
- **contexts/** – React Context providers for global state management
- **utils/** – Business logic for levels, XP, streaks, and calculations
- **assets/** – Images and rank icons
- **App.jsx** – Main application controller with routing logic
- **main.jsx** – React DOM rendering entry point

## ✨ Features

### User Management

- User registration with username/password validation
- User authentication with session persistence
- LocalStorage-based data persistence per user

### Habit Management

- **8 Student-focused presets:** Study, Sleep, Exercise, Reading, Meditation, Water, Healthy Eating, Journaling
- Custom habit creation with name, description (100 char limit), category, and difficulty
- Difficulty levels: Easy (10 XP), Medium (20 XP), Hard (30 XP)
- One completion per day per habit (lock system)

### Streak Tracking

- **Current Streak:** Counts consecutive days (only if today/yesterday is completed)
- **Longest Streak:** Tracks best historical streak
- **Total Days:** All-time completion count
- Visual feedback with 🥚 (0 streak) and 🔥 (active streak) emojis

### Gamification System

- **XP Rewards:** Base XP per difficulty + streak bonuses (5% per day, capped at 100%)
- **Level Progression:** Exponential XP scaling (100 → 150 → 225 XP per level)
- **Rank System:** 6 unique ranks with custom images (Seedling → Sprout → Tree → Star → Diamond → Crown)
- **Level-Up Animations:** Visual popups with rank images when leveling up
- **Progress Bar:** Real-time XP visualization on dashboard

### Backfill Feature

- Log past 7 days for streak simulation
- No XP awarded for past dates (demo-friendly)
- Calendar UI with toggle functionality
- Helps demonstrate streak mechanics without waiting

### UI/UX Design

- Dark theme with green accents (#10b981, #059669, #0a0f0d)
- Responsive layout with left (rank display) and right (habit grid) sections
- Smooth animations and transitions
- Custom green scrollbars
- Gradient backgrounds and card effects
- Hover states and visual feedback

## 👥 Authors

- **Slava Pletnov**
- **Daniil Andreyev**

## 📄 License

Distributed under the Unlicense License.

## 🙏 Acknowledgments

- [Vite](https://vitejs.dev/) - Build tool
- [React](https://react.dev/) - UI library
- [Best-README-Template](https://github.com/othneildrew/Best-README-Template) - README inspiration
- [Rank Assets](https://rivalskins.com/assets/rank-logos/) - Assets Used in the project
