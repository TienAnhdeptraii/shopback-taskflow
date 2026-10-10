export const STORAGE_KEY = 'shopback_tasks_v1';
export const THEME_STORAGE_KEY = 'shopback_theme_v1';

export const CATEGORIES = [
  { id: 'work', label: 'Work', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' },
  { id: 'personal', label: 'Personal', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
  { id: 'study', label: 'Study', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.12)' },
  { id: 'health', label: 'Health', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.12)' },
  { id: 'other', label: 'Other', color: '#64748b', bg: 'rgba(100, 116, 139, 0.12)' },
];

export const PRIORITIES = [
  { id: 'high', label: 'High', color: '#ef4444', weight: 3 },
  { id: 'medium', label: 'Medium', color: '#f59e0b', weight: 2 },
  { id: 'low', label: 'Low', color: '#10b981', weight: 1 },
];

export const STATUS_TABS = [
  { id: 'all', label: 'All Tasks' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
];

export const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest First' },
  { id: 'oldest', label: 'Oldest First' },
  { id: 'priority', label: 'Priority (High → Low)' },
  { id: 'dueDate', label: 'Due Date (Earliest)' },
];

// Helper to get relative date string YYYY-MM-DD
const getRelativeDateString = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_SEED_TASKS = [
  {
    id: 'seed-1',
    title: 'Review ShopBack architecture and requirements checklist',
    description: 'Verify state management, localStorage resilience, and responsive design guidelines.',
    completed: true,
    priority: 'high',
    category: 'work',
    dueDate: getRelativeDateString(-1),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'seed-2',
    title: 'Write automated unit & integration tests with Vitest',
    description: 'Cover edge case input trimming, toggle completion, and localStorage persistence.',
    completed: false,
    priority: 'high',
    category: 'work',
    dueDate: getRelativeDateString(0), // Due today
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'seed-3',
    title: 'Polish CSS design tokens for Dark & Light modes',
    description: 'Ensure smooth color transitions, focus rings, and mobile-friendly touch targets.',
    completed: false,
    priority: 'medium',
    category: 'study',
    dueDate: getRelativeDateString(1), // Tomorrow
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'seed-4',
    title: 'Exercise & evening 5km recovery run',
    description: 'Stay refreshed and maintain high energy for technical interviews.',
    completed: false,
    priority: 'low',
    category: 'health',
    dueDate: getRelativeDateString(2),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
