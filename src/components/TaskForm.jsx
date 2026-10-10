import { useState } from 'react';
import { Plus, ChevronDown, ChevronUp, Calendar, Tag, AlertCircle } from 'lucide-react';
import { CATEGORIES, PRIORITIES } from '../constants';

export default function TaskForm({ onAddTask, onErrorToast }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('work');
  const [dueDate, setDueDate] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setHasError(true);
      if (onErrorToast) onErrorToast('Task title cannot be empty or spaces only.');
      return;
    }

    setHasError(false);
    onAddTask({
      title: trimmedTitle,
      description: description.trim(),
      priority,
      category,
      dueDate,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory('work');
    setDueDate('');
    setIsExpanded(false);
  };

  return (
    <form className="task-form-card" onSubmit={handleSubmit} noValidate>
      <div className="task-form-main-row">
        <div className={`input-wrapper ${hasError ? 'input-error' : ''}`}>
          <input
            type="text"
            className="task-title-input"
            placeholder="What needs to be done? (e.g. Write integration tests...)"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (hasError) setHasError(false);
            }}
            maxLength={120}
            required
            aria-label="New Task Title"
          />
        </div>

        <button
          type="button"
          className={`expand-toggle-btn ${isExpanded ? 'active' : ''}`}
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? 'Collapse options' : 'More options (Due date, priority, category)'}
          aria-label="Toggle options"
        >
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          <span className="btn-label-desktop">Options</span>
        </button>

        <button type="submit" className="submit-task-btn" aria-label="Add Task">
          <Plus size={20} />
          <span>Add Task</span>
        </button>
      </div>

      {hasError && (
        <div className="form-error-hint">
          <AlertCircle size={14} />
          <span>Please enter a non-empty task title.</span>
        </div>
      )}

      {isExpanded && (
        <div className="task-form-expanded-panel">
          <div className="form-field">
            <label htmlFor="task-desc">Description (Optional)</label>
            <textarea
              id="task-desc"
              className="task-desc-textarea"
              placeholder="Add details, notes, or checklist context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="form-options-grid">
            <div className="form-field">
              <label htmlFor="task-priority">
                <AlertCircle size={14} /> Priority
              </label>
              <select
                id="task-priority"
                className="custom-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                {PRIORITIES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="task-category">
                <Tag size={14} /> Category
              </label>
              <select
                id="task-category"
                className="custom-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="task-duedate">
                <Calendar size={14} /> Due Date
              </label>
              <input
                id="task-duedate"
                type="date"
                className="custom-date-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
