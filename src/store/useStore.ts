import { create } from 'zustand';

// Types
export type BotStatus = 'idle' | 'busy' | 'charging' | 'error';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Bot {
  id: string;
  name: string;
  battery: number;
  status: BotStatus;
  currentTask: string | null;
  speed: number;
  lastUpdated: Date;
  position: { x: number; y: number };
}

export interface Task {
  id: string;
  pickup: string;
  drop: string;
  priority: TaskPriority;
  comments: string;
  createdAt: Date;
  assignedBot: string | null;
}

export interface User {
  email: string;
  name: string;
}

interface AppState {
  // Auth state
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, name: string) => void;
  logout: () => void;

  // Bots state
  bots: Bot[];
  updateBot: (botId: string, updates: Partial<Bot>) => void;
  updateAllBots: () => void;

  // Tasks state
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'assignedBot'>) => void;
  removeTask: (taskId: string) => void;
  getNextTask: () => Task | undefined;
}

// Helper functions
const generateRandomBotUpdate = (bot: Bot): Partial<Bot> => {
  const statuses: BotStatus[] = ['idle', 'busy', 'charging', 'error'];
  const tasks = ['Picking item A-123', 'Delivering to Zone B', 'Returning to base', 'Charging', null];
  
  // Battery changes based on status
  let batteryChange = 0;
  if (bot.status === 'charging') {
    batteryChange = Math.min(100 - bot.battery, Math.random() * 15 + 5);
  } else if (bot.status === 'busy') {
    batteryChange = -(Math.random() * 5 + 2);
  } else {
    batteryChange = -(Math.random() * 2);
  }

  const newBattery = Math.max(0, Math.min(100, bot.battery + batteryChange));
  
  // Determine new status
  let newStatus = bot.status;
  if (newBattery < 15 && bot.status !== 'charging') {
    newStatus = 'charging';
  } else if (Math.random() > 0.7) {
    newStatus = statuses[Math.floor(Math.random() * statuses.length)];
  }

  // Random speed based on status
  let newSpeed = bot.speed;
  if (newStatus === 'busy') {
    newSpeed = Math.random() * 2 + 0.5;
  } else if (newStatus === 'idle' || newStatus === 'charging') {
    newSpeed = 0;
  } else {
    newSpeed = Math.random() * 0.5;
  }

  // Update position
  const newPosition = {
    x: Math.max(0, Math.min(100, bot.position.x + (Math.random() - 0.5) * 10)),
    y: Math.max(0, Math.min(100, bot.position.y + (Math.random() - 0.5) * 10)),
  };

  return {
    battery: Math.round(newBattery),
    status: newStatus,
    currentTask: newStatus === 'busy' ? tasks[Math.floor(Math.random() * (tasks.length - 1))] : null,
    speed: Math.round(newSpeed * 10) / 10,
    lastUpdated: new Date(),
    position: newPosition,
  };
};

// Initial bots data
const initialBots: Bot[] = Array.from({ length: 10 }, (_, i) => ({
  id: `bot-${i + 1}`,
  name: `Bot ${String(i + 1).padStart(2, '0')}`,
  battery: Math.floor(Math.random() * 60) + 40,
  status: (['idle', 'busy', 'charging', 'error'] as BotStatus[])[Math.floor(Math.random() * 4)],
  currentTask: Math.random() > 0.5 ? 'Picking item A-123' : null,
  speed: Math.random() * 2,
  lastUpdated: new Date(),
  position: { x: Math.random() * 100, y: Math.random() * 100 },
}));

export const useStore = create<AppState>((set, get) => ({
  // Auth
  isAuthenticated: false,
  user: null,
  login: (email, name) => set({ isAuthenticated: true, user: { email, name } }),
  logout: () => set({ isAuthenticated: false, user: null }),

  // Bots
  bots: initialBots,
  updateBot: (botId, updates) =>
    set((state) => ({
      bots: state.bots.map((bot) =>
        bot.id === botId ? { ...bot, ...updates } : bot
      ),
    })),
  updateAllBots: () =>
    set((state) => ({
      bots: state.bots.map((bot) => ({
        ...bot,
        ...generateRandomBotUpdate(bot),
      })),
    })),

  // Tasks
  tasks: [],
  addTask: (taskData) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          ...taskData,
          id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
          assignedBot: null,
        },
      ],
    })),
  removeTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    })),
  getNextTask: () => {
    const state = get();
    return state.tasks[0];
  },
}));
