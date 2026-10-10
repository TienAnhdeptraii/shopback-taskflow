import { Search, X, Filter, ArrowUpDown, Trash2 } from 'lucide-react';
import { CATEGORIES, PRIORITIES, STATUS_TABS, SORT_OPTIONS } from '../constants';

export default function TaskToolbar({
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
  completedCount,
  onClearCompletedClick,
}) {
  return (
    <div className="task-toolbar" aria-label="Task controls and filters">
      {/* Search Bar */}
      <div className="search-bar-wrap">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          className="search-input"
          placeholder="Search by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search tasks"
        />
        {searchQuery && (
          <button
            type="button"
            className="clear-search-btn"
            onClick={() => setSearchQuery('')}
            aria-label="Clear search input"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Status Filter Tabs */}
      <div className="toolbar-row-flex">
        <div className="status-tabs-wrap" role="tablist" aria-label="Task status tabs">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={statusFilter === tab.id}
              className={`status-tab ${statusFilter === tab.id ? 'active' : ''}`}
              onClick={() => setStatusFilter(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dropdown Filters & Sorting */}
        <div className="filter-controls-group">
          {/* Category Filter */}
          <div className="select-wrapper">
            <Filter size={14} className="select-icon" />
            <select
              className="toolbar-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="select-wrapper">
            <select
              className="toolbar-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              aria-label="Filter by priority"
            >
              <option value="all">All Priorities</option>
              {PRIORITIES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label} Priority
                </option>
              ))}
            </select>
          </div>

          {/* Sorting */}
          <div className="select-wrapper">
            <ArrowUpDown size={14} className="select-icon" />
            <select
              className="toolbar-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort tasks by"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Completed Action */}
          {completedCount > 0 && (
            <button
              type="button"
              className="clear-completed-btn"
              onClick={onClearCompletedClick}
              title="Remove all completed tasks"
              aria-label="Clear completed tasks"
            >
              <Trash2 size={15} />
              <span className="btn-label-desktop">Clear Completed ({completedCount})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
