import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import App from '../App';
import { STORAGE_KEY } from '../constants';

describe('ShopBack TaskFlow — Industrial QA Test Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Edge Case: Blocks submission of empty or whitespace-only tasks and displays error', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText(/what needs to be done/i);
    const addButton = screen.getByRole('button', { name: /add task/i });

    // Attempt to submit whitespace only
    await user.type(input, '       ');
    await user.click(addButton);

    // Verify error hint appears
    expect(screen.getByText(/please enter a non-empty task title/i)).toBeInTheDocument();
  });

  it('Core Flow: Successfully adds a new task to the list', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText(/what needs to be done/i);
    await user.type(input, 'Build ShopBack Take-Home Assessment{enter}');

    expect(screen.getByText('Build ShopBack Take-Home Assessment')).toBeInTheDocument();
  });

  it('State & Toggle Flow: Correctly toggles task completion', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a unique task
    const input = screen.getByPlaceholderText(/what needs to be done/i);
    await user.type(input, 'Unique Test Toggle Task{enter}');

    const taskTitle = screen.getByText('Unique Test Toggle Task');
    expect(taskTitle).not.toHaveClass('completed-text');

    // Click checkbox
    const checkbox = screen.getByRole('button', { name: /mark "unique test toggle task" as complete/i });
    await user.click(checkbox);

    // Verify strike-through completion class
    expect(taskTitle).toHaveClass('completed-text');
  });

  it('Persistence Flow: Persists new tasks into localStorage under versioned key', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText(/what needs to be done/i);
    await user.type(input, 'Verify LocalStorage Persistence{enter}');

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const found = stored.some((t) => t.title === 'Verify LocalStorage Persistence');
      expect(found).toBe(true);
    });
  });

  it('Safety Flow: Deleting a task requires user confirmation in ConfirmDialog', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText(/what needs to be done/i);
    await user.type(input, 'Safety Delete Candidate{enter}');

    expect(screen.getByText('Safety Delete Candidate')).toBeInTheDocument();

    // Click delete icon
    const deleteBtn = screen.getByRole('button', { name: /delete task "safety delete candidate"/i });
    await user.click(deleteBtn);

    // Confirmation dialog should be visible
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByText(/are you sure you want to delete "safety delete candidate"\?/i)).toBeInTheDocument();

    // Confirm deletion
    const confirmDeleteBtn = screen.getAllByRole('button', { name: /^delete$/i })[0];
    await user.click(confirmDeleteBtn);

    // Item should now be removed
    expect(screen.queryByText('Safety Delete Candidate')).not.toBeInTheDocument();
  });
});
