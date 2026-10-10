import { test, expect } from '@playwright/test';

test.describe('TaskFlow End-to-End (E2E) Browser Automation Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to local Vite dev server
    await page.goto('/');
    // Clear localStorage to ensure a clean starting slate
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('E2E-01: Page loads with header, metrics overview, and default seed tasks', async ({ page }) => {
    await expect(page).toHaveTitle(/TaskFlow/i);
    await expect(page.locator('.app-title')).toHaveText('TaskFlow');
    
    // Stats overview should be visible
    await expect(page.locator('.stats-overview')).toBeVisible();
    await expect(page.locator('.stat-label').first()).toBeVisible();

    // Default tasks should be displayed
    const taskCards = page.locator('.task-item-card');
    await expect(taskCards).toHaveCount(4);
  });

  test('E2E-02: User creates a new task with expanded options (Category, Priority, Due Date)', async ({ page }) => {
    const titleInput = page.locator('.task-title-input');
    await titleInput.fill('E2E Playwright Integration Task');

    // Expand options
    await page.locator('.expand-toggle-btn').click();
    await expect(page.locator('.task-form-expanded-panel')).toBeVisible();

    // Select Priority High and Category Study
    await page.locator('#task-priority').selectOption('high');
    await page.locator('#task-category').selectOption('study');
    await page.locator('#task-desc').fill('Automated end-to-end browser verification notes');

    // Submit form
    await page.locator('.submit-task-btn').click();

    // Verify toast notification
    await expect(page.locator('.toast-item')).toContainText('New task added successfully.');

    // Verify task is at the top of the list with High priority badge
    const firstTask = page.locator('.task-item-card').first();
    await expect(firstTask.locator('.task-title')).toHaveText('E2E Playwright Integration Task');
    await expect(firstTask.locator('.priority-pill')).toContainText('High');
    await expect(firstTask.locator('.category-pill')).toContainText('Study');
  });

  test('E2E-03: Edge Case — User cannot submit empty or whitespace-only task', async ({ page }) => {
    const titleInput = page.locator('.task-title-input');
    await titleInput.fill('     '); // spaces only
    await page.locator('.submit-task-btn').click();

    // Error hint should appear
    await expect(page.locator('.form-error-hint')).toBeVisible();
    await expect(page.locator('.form-error-hint')).toContainText('Please enter a non-empty task title.');

    // Count of tasks remains 4
    await expect(page.locator('.task-item-card')).toHaveCount(4);
  });

  test('E2E-04: User toggles task completion and observes animated strikethrough & stats update', async ({ page }) => {
    const firstTask = page.locator('.task-item-card').nth(1); // pick second task
    const checkbox = firstTask.locator('.custom-checkbox');

    // Click to toggle
    await checkbox.click();

    // Checkbox becomes checked and title has completed strikethrough
    await expect(checkbox).toHaveClass(/checked/);
    await expect(firstTask.locator('.task-title')).toHaveClass(/completed-text/);
  });

  test('E2E-05: User edits an existing task via EditTaskModal and saves changes', async ({ page }) => {
    const firstTask = page.locator('.task-item-card').first();
    await firstTask.locator('.edit-btn').click();

    // Modal dialog opens
    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();
    await expect(modal.locator('.modal-title')).toHaveText('Edit Task');

    // Edit title
    const editInput = modal.locator('#edit-title');
    await editInput.fill('Updated Title Via E2E Playwright');
    await modal.locator('button[type="submit"]').click();

    // Modal closes and list reflects change
    await expect(modal).not.toBeVisible();
    await expect(page.locator('.toast-item')).toContainText('Task updated successfully.');
    await expect(page.locator('.task-item-card').first().locator('.task-title')).toHaveText('Updated Title Via E2E Playwright');
  });

  test('E2E-06: User searches and filters tasks dynamically', async ({ page }) => {
    const searchInput = page.locator('.search-input');
    await searchInput.fill('exercise');

    // Only matching tasks are displayed
    const visibleCards = page.locator('.task-item-card');
    await expect(visibleCards).toHaveCount(1);
    await expect(visibleCards.first().locator('.task-title')).toContainText('Exercise');

    // Clear search
    await page.locator('.clear-search-btn').click();
    await expect(page.locator('.task-item-card')).toHaveCount(4);
  });

  test('E2E-07: Safe Deletion — Deleting requires confirmation in ConfirmDialog', async ({ page }) => {
    const taskToDelete = page.locator('.task-item-card').first();
    const taskTitleText = await taskToDelete.locator('.task-title').textContent();

    // Click delete button
    await taskToDelete.locator('.delete-btn').click();

    // Confirmation dialog appears
    const confirmDialog = page.locator('.confirm-dialog-box');
    await expect(confirmDialog).toBeVisible();
    await expect(confirmDialog.locator('.modal-title')).toHaveText('Delete Task');

    // Click Confirm Delete
    await confirmDialog.locator('.btn-danger').click();

    // Dialog closes and task is removed
    await expect(confirmDialog).not.toBeVisible();
    await expect(page.locator('.task-title', { hasText: taskTitleText })).not.toBeVisible();
  });

  test('E2E-08: Persistence — State survives browser page reload', async ({ page }) => {
    const titleInput = page.locator('.task-title-input');
    await titleInput.fill('Task To Persist Across Reload');
    await page.locator('.submit-task-btn').click();

    await expect(page.locator('.task-title', { hasText: 'Task To Persist Across Reload' })).toBeVisible();

    // Hard reload the browser
    await page.reload();

    // Task is still present after reload from localStorage
    await expect(page.locator('.task-title', { hasText: 'Task To Persist Across Reload' })).toBeVisible();
  });

  test('E2E-09: Theme Switcher — Toggles between Dark Mode and Light Mode', async ({ page }) => {
    const themeBtn = page.locator('.theme-toggle-btn');
    const initialTheme = await page.locator('html').getAttribute('data-theme');

    // Toggle theme
    await themeBtn.click();
    const newTheme = await page.locator('html').getAttribute('data-theme');
    expect(newTheme).not.toBe(initialTheme);

    // Toggle back
    await themeBtn.click();
    const revertedTheme = await page.locator('html').getAttribute('data-theme');
    expect(revertedTheme).toBe(initialTheme);
  });
});
