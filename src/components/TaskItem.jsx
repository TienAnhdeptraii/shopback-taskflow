import { Check, Edit3, Trash2, Calendar, Tag, AlertCircle } from 'lucide-react';
import { CATEGORIES, PRIORITIES } from '../constants';

// Normalized midnight comparison to avoid timezone & intraday hours bugs
const getDueDateBadge = (dueDateString, isCompleted) => {
  if (!dueDateString || isCompleted) return null;

  const parts = dueDateString.split('-');
  if (parts.length !== 3) return null;

  const targetDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.round((targetDate - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: `Overdue (${Math.abs(diffDays)}d)`, type: 'overdue' };
  }
  if (diffDays === 0) {
    return { text: 'Due Today', type: 'today' };
  }
  if (diffDays === 1) {
    return { text: 'Due Tomorrow', type: 'tomorrow' };
  }
  return {
    text: targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    type: 'future',
  };
};

export default function TaskItem({ task, onToggle, onEditClick, onDeleteClick }) {
  const categoryMeta = CATEGORIES.find((c) => c.id === task.category) || CATEGORIES[4];
  const priorityMeta = PRIORITIES.find((p) => p.id === task.priority) || PRIORITIES[1];
  const dueBadge = getDueDateBadge(task.dueDate, task.completed);

  return (
    <article className={`task-item-card ${task.completed ? 'completed' : ''} priority-${task.priority}`}>
      <div className="task-priority-indicator" style={{ backgroundColor: priorityMeta.color }} />

      <div className="task-item-content">
        <div className="task-header-row">
          {/* Custom Checkbox */}
          <button
            type="button"
            className={`custom-checkbox ${task.completed ? 'checked' : ''}`}
            onClick={() => onToggle(task.id)}
            aria-label={task.completed ? `Mark "${task.title}" as incomplete` : `Mark "${task.title}" as complete`}
          >
            {task.completed && <Check size={14} className="check-icon" />}
          </button>

          {/* Title and notes */}
          <div className="task-text-group">
            <h3 className={`task-title ${task.completed ? 'completed-text' : ''}`}>{task.title}</h3>
            {task.description && <p className="task-description">{task.description}</p>}
          </div>

          {/* Actions */}
          <div className="task-actions">
            <button
              type="button"
              className="action-btn edit-btn"
              onClick={() => onEditClick(task)}
              title="Edit task details"
              aria-label={`Edit task "${task.title}"`}
            >
              <Edit3 size={16} />
            </button>
            <button
              type="button"
              className="action-btn delete-btn"
              onClick={() => onDeleteClick(task)}
              title="Delete task"
              aria-label={`Delete task "${task.title}"`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Task Metadata Badges Footer */}
        <div className="task-badges-row">
          {/* Category Pill */}
          <span
            className="meta-pill category-pill"
            style={{ color: categoryMeta.color, backgroundColor: categoryMeta.bg }}
          >
            <Tag size={12} />
            <span>{categoryMeta.label}</span>
          </span>

          {/* Priority Pill */}
          <span className={`meta-pill priority-pill priority-${task.priority}`}>
            <AlertCircle size={12} />
            <span>{priorityMeta.label}</span>
          </span>

          {/* Due Date Badge */}
          {dueBadge && (
            <span className={`meta-pill due-pill due-${dueBadge.type}`}>
              <Calendar size={12} />
              <span>{dueBadge.text}</span>
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
