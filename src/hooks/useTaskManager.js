import { useReducer, useEffect, useMemo, useState } from 'react';
import { STORAGE_KEY, INITIAL_SEED_TASKS, PRIORITIES } from '../constants';

// Safe initial hydration from localStorage
const loadStoredTasks = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_SEED_TASKS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return INITIAL_SEED_TASKS;
  } catch (error) {
    console.warn('[Storage] Corrupted localStorage data. Falling back to seed tasks:', error);
    return INITIAL_SEED_TASKS;
  }
};

// Pure state reducer
export const taskReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TASK': {
      const trimmedTitle = action.payload.title?.trim();
      if (!trimmedTitle) {
        return state; // Defensive: block blank/whitespace-only titles
      }

      const newTask = {
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: trimmedTitle,
        description: action.payload.description?.trim() || '',
        completed: false,
        priority: action.payload.priority || 'medium',
        category: action.payload.category || 'work',
        dueDate: action.payload.dueDate || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return [newTask, ...state];
    }

    case 'UPDATE_TASK': {
      const { id, updates } = action.payload;
      return state.map((task) => {
        if (task.id !== id) return task;
        return {
          ...task,
          ...updates,
          title: updates.title !== undefined ? updates.title.trim() : task.title,
          description: updates.description !== undefined ? updates.description.trim() : task.description,
          updatedAt: new Date().toISOString(),
        };
      });
    }

    case 'TOGGLE_TASK': {
      const id = action.payload;
      return state.map((task) =>
        task.id === id ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() } : task
      );
    }

    case 'DELETE_TASK': {
      const id = action.payload;
      return state.filter((task) => task.id !== id);
    }

    case 'CLEAR_COMPLETED': {
      return state.filter((task) => !task.completed);
    }

    case 'RESTORE_SEED': {
      return INITIAL_SEED_TASKS;
    }

    default:
      return state;
  }
};

export const useTaskManager = () => {
  const [tasks, dispatch] = useReducer(taskReducer, [], loadStoredTasks);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'priority' | 'dueDate'

  // Synchronize to localStorage defensively
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('[Storage] Failed to save tasks to localStorage (e.g. QuotaExceeded):', error);
    }
  }, [tasks]);

  // Derived real-time statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const active = total - completed;
    const rate = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, active, rate };
  }, [tasks]);

  // Compound filter & sort pipeline
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchDesc = task.description?.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc) return false;
        }

        // Status filter
        if (statusFilter === 'active' && task.completed) return false;
        if (statusFilter === 'completed' && !task.completed) return false;

        // Category filter
        if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;

        // Priority filter
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
        if (sortBy === 'priority') {
          const weightA = PRIORITIES.find((p) => p.id === a.priority)?.weight || 0;
          const weightB = PRIORITIES.find((p) => p.id === b.priority)?.weight || 0;
          return weightB - weightA;
        }
        if (sortBy === 'dueDate') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        }
        return 0;
      });
  }, [tasks, searchQuery, statusFilter, categoryFilter, priorityFilter, sortBy]);

  // Public Action Handlers
  const addTask = (taskData) => {
    dispatch({ type: 'ADD_TASK', payload: taskData });
  };

  const updateTask = (id, updates) => {
    dispatch({ type: 'UPDATE_TASK', payload: { id, updates } });
  };

  const toggleTask = (id) => {
    dispatch({ type: 'TOGGLE_TASK', payload: id });
  };

  const deleteTask = (id) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const clearCompleted = () => {
    dispatch({ type: 'CLEAR_COMPLETED' });
  };

  const restoreSeedTasks = () => {
    dispatch({ type: 'RESTORE_SEED' });
  };

  return {
    tasks,
    filteredTasks,
    stats,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    priorityFilter,
    setPriorityFilter,
    sortBy,
    setSortBy,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    clearCompleted,
    restoreSeedTasks,
  };
};
