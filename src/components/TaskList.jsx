import { Inbox, Sparkles, FilterX } from 'lucide-react';
import TaskItem from './TaskItem';

export default function TaskList({
  tasks,
  totalTasks,
  onToggle,
  onEditClick,
  onDeleteClick,
  onClearFilters,
}) {
  if (tasks.length === 0) {
    const isFiltered = totalTasks > 0;

    return (
      <div className="empty-state-card" aria-live="polite">
        <div className="empty-icon-wrap">
          {isFiltered ? <FilterX size={36} /> : <Inbox size={36} />}
        </div>
        <h3 className="empty-state-title">
          {isFiltered ? 'No matching tasks found' : 'All clear! No tasks yet'}
        </h3>
        <p className="empty-state-subtitle">
          {isFiltered
            ? 'Try adjusting your search query, status, or category filters.'
            : 'Get started by creating your first task above.'}
        </p>
        {isFiltered && (
          <button type="button" className="clear-filters-action-btn" onClick={onClearFilters}>
            <Sparkles size={16} />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <section className="task-list-section" aria-label="Tasks List">
      <div className="task-cards-stack">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
          />
        ))}
      </div>
    </section>
  );
}
