import React, { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  isCompleted: boolean;
  dueDate?: Date;
  pomodoroConfig: PomodoroConfig;
  createdAt: Date;
}

export interface PomodoroConfig {
  workDuration: number; // minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
}

export interface Session {
  id: string;
  taskId: string;
  sessionType: 'work' | 'shortBreak' | 'longBreak';
  duration: number;
  completedAt: Date;
  wasCompleted: boolean;
}

interface PomodoroContextType {
  // Timer state
  isRunning: boolean;
  timeLeft: number;
  sessionType: 'work' | 'shortBreak' | 'longBreak';
  currentSession: number;
  totalSessions: number;
  
  // Tasks
  tasks: Task[];
  currentTask: Task | null;
  
  // Actions
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  selectTask: (task: Task) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

const defaultConfig: PomodoroConfig = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
};

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design App Interface',
    description: 'Create wireframes and mockups for the new feature',
    priority: 'high',
    category: 'Design',
    estimatedPomodoros: 4,
    completedPomodoros: 2,
    isCompleted: false,
    pomodoroConfig: defaultConfig,
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Code Review',
    description: 'Review pull requests from team members',
    priority: 'medium',
    category: 'Development',
    estimatedPomodoros: 2,
    completedPomodoros: 0,
    isCompleted: false,
    pomodoroConfig: defaultConfig,
    createdAt: new Date(),
  },
  {
    id: '3',
    title: 'Write Documentation',
    description: 'Update API documentation with new endpoints',
    priority: 'low',
    category: 'Documentation',
    estimatedPomodoros: 3,
    completedPomodoros: 1,
    isCompleted: false,
    pomodoroConfig: defaultConfig,
    createdAt: new Date(),
  },
];

export function PomodoroProvider({ children }: { children: React.ReactNode }) {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [sessionType, setSessionType] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [currentSession, setCurrentSession] = useState(1);
  const [totalSessions, setTotalSessions] = useState(4);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadData = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('pomodoro_tasks');
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        }));
        setTasks(parsedTasks);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = async (newTasks: Task[]) => {
    try {
      await AsyncStorage.setItem('pomodoro_tasks', JSON.stringify(newTasks));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, ...updates } : task
    );
    setTasks(updatedTasks);
    saveData(updatedTasks);
    
    // Update current task if it's the one being updated
    if (currentTask?.id === id) {
      setCurrentTask({ ...currentTask, ...updates });
    }
  }, [tasks, currentTask]);

  const handleSessionComplete = useCallback(() => {
    setIsRunning(false);
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    if (sessionType === 'work') {
      // Update task progress
      if (currentTask) {
        updateTask(currentTask.id, {
          completedPomodoros: currentTask.completedPomodoros + 1,
        });
      }

      // Determine next session type
      if (currentSession >= totalSessions) {
        setSessionType('longBreak');
        setTimeLeft((currentTask?.pomodoroConfig.longBreakDuration || 15) * 60);
        setCurrentSession(1);
      } else {
        setSessionType('shortBreak');
        setTimeLeft((currentTask?.pomodoroConfig.shortBreakDuration || 5) * 60);
        setCurrentSession(prev => prev + 1);
      }
    } else {
      // Break completed, start work session
      setSessionType('work');
      setTimeLeft((currentTask?.pomodoroConfig.workDuration || 25) * 60);
    }
  }, [sessionType, currentTask, currentSession, totalSessions, updateTask]);

  const startTimer = useCallback(() => {
    setIsRunning(true);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setSessionType('work');
    setCurrentSession(1);
    setTimeLeft((currentTask?.pomodoroConfig.workDuration || 25) * 60);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [currentTask]);

  const selectTask = useCallback((task: Task) => {
    setCurrentTask(task);
    setSessionType('work');
    setCurrentSession(1);
    setTotalSessions(task.pomodoroConfig.sessionsBeforeLongBreak);
    setTimeLeft(task.pomodoroConfig.workDuration * 60);
    setIsRunning(false);
  }, []);

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveData(updatedTasks);
  }, [tasks]);

  const deleteTask = useCallback((id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    saveData(updatedTasks);
    
    if (currentTask?.id === id) {
      setCurrentTask(null);
      resetTimer();
    }
  }, [tasks, currentTask, resetTimer]);

  const completeTask = useCallback((id: string) => {
    updateTask(id, { isCompleted: true });
  }, [updateTask]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, handleSessionComplete]);

  const contextValue = useMemo(() => ({
    isRunning,
    timeLeft,
    sessionType,
    currentSession,
    totalSessions,
    tasks,
    currentTask,
    startTimer,
    pauseTimer,
    resetTimer,
    selectTask,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
  }), [
    isRunning,
    timeLeft,
    sessionType,
    currentSession,
    totalSessions,
    tasks,
    currentTask,
    startTimer,
    pauseTimer,
    resetTimer,
    selectTask,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
  ]);

  return (
    <PomodoroContext.Provider value={contextValue}>
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoro() {
  const context = useContext(PomodoroContext);
  if (context === undefined) {
    throw new Error('usePomodoro must be used within a PomodoroProvider');
  }
  return context;
}