import { Moon, Sun, CheckCircle2, RotateCcw } from 'lucide-react';

export default function Header({ theme, toggleTheme, onRestoreSeed }) {
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="logo-icon-wrapper">
          <CheckCircle2 className="logo-icon" size={28} />
        </div>
        <div>
          <h1 className="app-title">TaskFlow</h1>
          <p className="app-subtitle">ShopBack Engineering Assessment • {todayFormatted}</p>
        </div>
      </div>

      <div className="header-actions">
        <button
          type="button"
          className="header-btn"
          onClick={onRestoreSeed}
          title="Restore sample demo tasks"
          aria-label="Restore sample demo tasks"
        >
          <RotateCcw size={18} />
          <span className="btn-label-desktop">Reset Demo</span>
        </button>

        <button
          type="button"
          className="header-btn theme-toggle-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={18} className="theme-icon sun" /> : <Moon size={18} className="theme-icon moon" />}
          <span className="btn-label-desktop">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
    </header>
  );
}
