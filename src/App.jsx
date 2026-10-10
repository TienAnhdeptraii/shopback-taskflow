import { useState, useEffect } from 'react';
import { useTaskManager } from './hooks/useTaskManager';
import { THEME_STORAGE_KEY } from './constants';
import Header from './components/Header';
import StatsOverview from './components/StatsOverview';
import TaskForm from './components/TaskForm';
import TaskToolbar from './components/TaskToolbar';
import TaskList from './components/TaskList';
import EditTaskModal from './components/EditTaskModal';
import ConfirmDialog from './components/ConfirmDialog';
import { AlertCircle, CheckCircle } from 'lucide-react';
import './App.css';

export default function App() {
  // Theme state with localStorage persistence
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      console.warn('[Theme] Storage write failed', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Task manager hook
  const {
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
  } = useTaskManager();

  // Dialog & Modal states
  const [editingTask, setEditingTask] = useState(null);
  const [confirmConfig, setConfirmConfig] = useState(null);

  // Toast notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Handlers for safety dialogs
  const handleDeleteTaskClick = (task) => {
    setConfirmConfig({
      title: 'Delete Task',
      message: `Are you sure you want to delete "${task.title}"? This cannot be undone.`,
      confirmText: 'Delete',
      isDanger: true,
      onConfirm: () => {
        deleteTask(task.id);
        setConfirmConfig(null);
        showToast('Task deleted successfully.', 'info');
      },
    });
  };

  const handleClearCompletedClick = () => {
    setConfirmConfig({
      title: 'Clear Completed Tasks',
      message: `Are you sure you want to delete all ${stats.completed} completed tasks?`,
      confirmText: 'Clear All',
      isDanger: true,
      onConfirm: () => {
        clearCompleted();
        setConfirmConfig(null);
        showToast(`Cleared ${stats.completed} completed tasks.`, 'info');
      },
    });
  };

  const handleRestoreSeedClick = () => {
    setConfirmConfig({
      title: 'Reset to Sample Data',
      message: 'This will replace current tasks with the original sample tasks for testing.',
      confirmText: 'Reset Demo',
      isDanger: false,
      onConfirm: () => {
        restoreSeedTasks();
        setConfirmConfig(null);
        showToast('Sample tasks restored.', 'info');
      },
    });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setPriorityFilter('all');
    setSortBy('newest');
  };

  return (
    <div className="app-viewport">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        onRestoreSeed={handleRestoreSeedClick}
      />

      <StatsOverview stats={stats} />

      <TaskForm
        onAddTask={(data) => {
          addTask(data);
          showToast('New task added successfully.', 'info');
        }}
        onErrorToast={(msg) => showToast(msg, 'error')}
      />

      <TaskToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        completedCount={stats.completed}
        onClearCompletedClick={handleClearCompletedClick}
      />

      <TaskList
        tasks={filteredTasks}
        totalTasks={tasks.length}
        onToggle={toggleTask}
        onEditClick={(task) => setEditingTask(task)}
        onDeleteClick={handleDeleteTaskClick}
        onClearFilters={handleResetFilters}
      />

      {/* Edit Modal */}
      <EditTaskModal
        isOpen={Boolean(editingTask)}
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={(id, updates) => {
          updateTask(id, updates);
          showToast('Task updated successfully.', 'info');
        }}
      />

      {/* Destructive Confirmation Modal */}
      {confirmConfig && (
        <ConfirmDialog
          isOpen={Boolean(confirmConfig)}
          title={confirmConfig.title}
          message={confirmConfig.message}
          confirmText={confirmConfig.confirmText}
          isDanger={confirmConfig.isDanger}
          onConfirm={confirmConfig.onConfirm}
          onCancel={() => setConfirmConfig(null)}
        />
      )}

      {/* Toast Feedback */}
      {toast && (
        <div className="toast-container" role="status" aria-live="polite">
          <div className={`toast-item ${toast.type}`}>
            {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
