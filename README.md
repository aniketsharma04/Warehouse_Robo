# Warehouse Robot Dashboard

A comprehensive web-based dashboard for monitoring and managing warehouse robots. Built with React, TypeScript, and modern web technologies.

![Dashboard Preview](https://img.shields.io/badge/Status-Active-green) ![React](https://img.shields.io/badge/React-18.3-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [State Management](#-state-management)
- [Pages Overview](#-pages-overview)
- [Bonus Features](#-bonus-features)
- [API Integration](#-api-integration)
- [Responsive Design](#-responsive-design)
- [Screenshots](#-screenshots)

## ✨ Features

### Core Features
- **User Authentication**: Login/Signup with form validation and protected routes
- **Dashboard Home**: Overview of all bot statistics with quick actions
- **Bot Status Monitoring**: Real-time status cards for 10 warehouse bots
- **Task Management**: Create, queue, and assign tasks to bots
- **Analytics Dashboard**: Interactive charts and performance metrics
- **Warehouse Map**: SVG-based 2D map with bot positions

### Bonus Features
- **Three.js 3D Visualization**: Immersive 3D warehouse view with animated bots
- **Real-time Updates**: Live bot status updates every 2-10 seconds
- **Responsive Design**: Fully responsive across mobile and desktop
- **Dark Industrial Theme**: Custom-designed UI with cyan/teal accents

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | Frontend framework |
| **TypeScript** | Type safety and better DX |
| **Vite** | Build tool and dev server |
| **Zustand** | Global state management |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | UI component library |
| **React Router** | Client-side routing |
| **Recharts** | Data visualization |
| **Three.js / R3F** | 3D visualization |
| **Lucide React** | Icon library |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd warehouse-robot-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx    # Route protection HOC
│   ├── bot/
│   │   └── BotCard.tsx           # Individual bot status card
│   ├── layout/
│   │   └── DashboardLayout.tsx   # Main layout with sidebar
│   ├── task/
│   │   ├── TaskCard.tsx          # Task display component
│   │   └── TaskForm.tsx          # Task creation form
│   ├── ui/                       # shadcn/ui components
│   └── warehouse/
│       └── Warehouse3D.tsx       # Three.js 3D visualization
├── hooks/
│   ├── use-mobile.tsx            # Mobile detection hook
│   └── use-toast.ts              # Toast notification hook
├── lib/
│   └── utils.ts                  # Utility functions
├── pages/
│   ├── Analytics.tsx             # Charts and analytics
│   ├── BotStatus.tsx             # Bot monitoring grid
│   ├── Dashboard.tsx             # Home dashboard
│   ├── Index.tsx                 # Landing/redirect page
│   ├── Login.tsx                 # Authentication page
│   ├── NotFound.tsx              # 404 page
│   ├── TaskAllocation.tsx        # Task creation
│   ├── TaskQueue.tsx             # Task queue management
│   └── WarehouseMap.tsx          # 2D/3D warehouse view
├── store/
│   └── useStore.ts               # Zustand global store
├── App.tsx                       # Root component with routes
├── index.css                     # Global styles + design tokens
└── main.tsx                      # Application entry point
```

## 🗃 State Management

The application uses **Zustand** for global state management, providing a simple yet powerful solution.

### Store Structure (`src/store/useStore.ts`)

```typescript
interface AppState {
  // Authentication
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, name: string) => void;
  logout: () => void;

  // Bots (10 simulated robots)
  bots: Bot[];
  updateBot: (botId: string, updates: Partial<Bot>) => void;
  updateAllBots: () => void;

  // Tasks
  tasks: Task[];
  addTask: (task: TaskInput) => void;
  removeTask: (taskId: string) => void;
  getNextTask: () => Task | undefined;
}
```

### Bot Data Model

```typescript
interface Bot {
  id: string;
  name: string;
  battery: number;        // 0-100%
  status: BotStatus;      // 'idle' | 'busy' | 'charging' | 'error'
  currentTask: string | null;
  speed: number;          // m/s
  lastUpdated: Date;
  position: { x: number; y: number };  // Percentage coordinates
}
```

### Task Data Model

```typescript
interface Task {
  id: string;
  pickup: string;
  drop: string;
  priority: TaskPriority;  // 'low' | 'medium' | 'high' | 'critical'
  comments: string;
  createdAt: Date;
  assignedBot: string | null;
}
```

## 📱 Pages Overview

### 1. Login Page (`/login`)
- Email and password authentication
- Form validation with error messages
- Responsive design with themed styling

### 2. Dashboard (`/`)
- Key metrics: Total Bots, Active Bots, Completed Tasks, Avg Battery
- Status distribution summary
- Quick action navigation cards

### 3. Bot Status (`/bots`)
- Grid of 10 bot cards with real-time updates
- Visual battery indicators
- Status badges (idle, busy, charging, error)
- Auto-refresh every 10 seconds

### 4. Task Allocation (`/tasks`)
- Create new tasks with:
  - Pickup location
  - Drop location
  - Priority level
  - Optional comments
- Form validation

### 5. Task Queue (`/queue`)
- View pending tasks
- Automatic task assignment simulation (every 3s)
- Priority-based visual indicators

### 6. Analytics (`/analytics`)
- Bot Status Distribution (Pie chart)
- Battery Levels (Bar chart)
- Hourly Activity (Area chart)
- Efficiency Metrics (Line chart)

### 7. Warehouse Map (`/map`)
- Toggle between 2D and 3D views
- SVG upload support for custom layouts
- Real-time bot position tracking
- Interactive 3D camera controls

## 🎁 Bonus Features

### Three.js 3D Visualization
- Fully rendered 3D warehouse environment
- Animated bot models with status-based colors
- Interactive camera controls (orbit, zoom, pan)
- Zone markers and charging stations
- Real-time bot movement animations

### Features Implemented:
- ✅ Three.js visualization with bot movement
- ✅ SVG map upload capability
- ✅ Real-time simulated updates
- ✅ Responsive mobile design
- ✅ Comprehensive documentation

## 🔌 API Integration

The application is designed to integrate with REST APIs. Currently using simulated data with the following structure:

### Expected API Endpoints

```
GET    /api/bots           # Get all bots
GET    /api/bots/:id       # Get single bot
PATCH  /api/bots/:id       # Update bot status

GET    /api/tasks          # Get all tasks
POST   /api/tasks          # Create new task
DELETE /api/tasks/:id      # Remove task
PATCH  /api/tasks/:id      # Update task (assign bot)

POST   /api/auth/login     # User login
POST   /api/auth/logout    # User logout
```

### Data Format
All API communication uses **JSON** format.

## 📐 Responsive Design

The dashboard is fully responsive with breakpoints:

| Breakpoint | Screen Size | Layout |
|------------|-------------|--------|
| `sm` | 640px+ | 2-column grids |
| `md` | 768px+ | Sidebar visible |
| `lg` | 1024px+ | 3-column grids |
| `xl` | 1280px+ | Full desktop layout |

### Mobile Optimizations:
- Collapsible sidebar navigation
- Touch-friendly buttons and inputs
- Stacked card layouts
- Responsive charts

## 🎨 Design System

### Color Palette (HSL)
```css
--primary: 187 85% 53%      /* Cyan accent */
--background: 222 47% 11%   /* Dark blue-gray */
--card: 217 33% 17%         /* Card background */
--foreground: 210 40% 98%   /* Light text */
--muted: 217 33% 25%        /* Muted elements */
```

### Typography
- **Headings**: Bold, 1.5rem - 3rem
- **Body**: Regular, 0.875rem - 1rem
- **Mono**: For technical data

## 📸 Screenshots

### Dashboard
The main dashboard provides an at-a-glance overview of warehouse operations.

### Bot Status Grid
Real-time monitoring of all warehouse robots with status indicators.

### 3D Warehouse View
Immersive Three.js visualization with animated bot movement.

### Analytics
Interactive charts for performance analysis.

---

## 👤 Author

Developed as part of a frontend internship assignment.

## 📄 License

This project is for educational purposes.
