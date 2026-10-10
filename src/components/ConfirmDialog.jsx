import { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  title = 'Delete Task',
  message = 'Are you sure you want to delete this task? This action cannot be undone.',
  confirmText = 'Delete',
  isDanger = true,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel} role="alertdialog" aria-modal="true" aria-labelledby="dialog-title">
      <div className="modal-content confirm-dialog-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="confirm-icon-title">
            <div className={`dialog-icon-wrap ${isDanger ? 'danger' : 'warning'}`}>
              <AlertTriangle size={20} />
            </div>
            <h2 id="dialog-title" className="modal-title">{title}</h2>
          </div>
          <button type="button" className="modal-close-btn" onClick={onCancel} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p className="confirm-message">{message}</p>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className={isDanger ? 'btn-danger' : 'btn-primary'}
            onClick={onConfirm}
            autoFocus
          >
            {isDanger && <Trash2 size={16} />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
