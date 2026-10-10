import { ListTodo, Clock, CheckCheck, TrendingUp } from 'lucide-react';

export default function StatsOverview({ stats }) {
  const { total, active, completed, rate } = stats;

  return (
    <section className="stats-overview" aria-label="Task Statistics Summary">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrap total">
            <ListTodo size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Tasks</span>
            <span className="stat-value">{total}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap active">
            <Clock size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-label">In Progress</span>
            <span className="stat-value">{active}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap completed">
            <CheckCheck size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{completed}</span>
          </div>
        </div>

        <div className="stat-card progress-card">
          <div className="stat-icon-wrap rate">
            <TrendingUp size={20} />
          </div>
          <div className="stat-info progress-info">
            <div className="progress-header">
              <span className="stat-label">Completion Rate</span>
              <span className="stat-percentage">{rate}%</span>
            </div>
            <div className="progress-bar-bg" role="progressbar" aria-valuenow={rate} aria-valuemin="0" aria-valuemax="100">
              <div
                className="progress-bar-fill"
                style={{ width: `${rate}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
