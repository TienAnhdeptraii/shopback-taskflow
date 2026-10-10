import { useState, useEffect, useRef } from 'react';
import { X, Save, AlertCircle, Calendar, Tag } from 'lucide-react';
import { CATEGORIES, PRIORITIES } from '../constants';

export default function EditTaskModal({ isOpen, task, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('work');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const inputRef = useRef(null);

  // Sync state when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'medium');
      setCategory(task.category || 'work');
      setDueDate(task.dueDate || '');
      setError('');
    }
  }, [task]);

  // Autofocus and keyboard Escape handler
  useEffect(() => {
    if (!isOpen) return;

    inputRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Task title cannot be empty.');
      return;
    }

    onSave(task.id, {
      title: trimmedTitle,
      description: description.trim(),
      priority,
      category,
      dueDate,
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-edit-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="modal-edit-title" className="modal-title">Edit Task</h2>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            <div className="form-field">
              <label htmlFor="edit-title">Task Title *</label>
              <input
                id="edit-title"
                ref={inputRef}
                type="text"
                className={`custom-modal-input ${error ? 'input-error' : ''}`}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError('');
                }}
                maxLength={120}
                required
              />
              {error && (
                <div className="form-error-hint">
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="edit-desc">Description</label>
              <textarea
                id="edit-desc"
                className="task-desc-textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional notes or details..."
              />
            </div>

            <div className="form-options-grid">
              <div className="form-field">
                <label htmlFor="edit-priority">
                  <AlertCircle size={14} /> Priority
                </label>
                <select
                  id="edit-priority"
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
                <label htmlFor="edit-category">
                  <Tag size={14} /> Category
                </label>
                <select
                  id="edit-category"
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
                <label htmlFor="edit-duedate">
                  <Calendar size={14} /> Due Date
                </label>
                <input
                  id="edit-duedate"
                  type="date"
                  className="custom-date-input"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Save size={16} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
