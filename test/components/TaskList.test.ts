/**
 * Unit tests for TaskList component.
 * Tests cover:
 * - Empty state rendering (when tasks array is empty)
 * - Rendering a list of tasks (when tasks array has items)
 * - Proper forwarding of onToggle, onDelete, and onEdit callbacks to TaskItem components
 * - Accessibility features (ARIA labels, roles)
 * - Responsive design classes are applied correctly
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TaskList } from '../../src/components/TaskList';
import { Task } from '../../src/types/Task';

// Mock TaskItem component to isolate TaskList testing
jest.mock('../../src/components/TaskItem', () => {
  const React = require('react');
  const MockTaskItem = (props) =>
    React.createElement(
      'div',
      {
        'data-testid': `task-item-${props.task.id}`,
        onClick: () => props.onToggle(props.task.id),
        onDoubleClick: () => props.onEdit(props.task.id, props.task.text),
      },
      React.createElement('span', null, props.task.text),
      React.createElement(
        'button',
        {
          'data-testid': `delete-button-${props.task.id}`,
          onClick: () => props.onDelete(props.task.id),
        },
        'Delete'
      )
    );
  return { TaskItem: MockTaskItem };
});

describe('TaskList', () => {
  // Mock callback functions
  const mockOnToggle = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clean up any side effects
    jest.restoreAllMocks();
  });

  describe('Empty State Rendering', () => {
    test('should render empty state message when tasks array is empty', () => {
      render(<TaskList tasks={[]} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      const emptyState = screen.getByTestId('task-list-empty');
      expect(emptyState).toBeInTheDocument();
      expect(emptyState).toHaveClass('task-list-empty');
    });

    test('should display appropriate message in empty state', () => {
      render(<TaskList tasks={[]} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      const message = screen.getByText(/no tasks yet/i);
      expect(message).toBeInTheDocument();
      expect(message).toHaveClass('task-list-empty-message');
    });

    test('should not render task list when tasks array is empty', () => {
      render(<TaskList tasks={[]} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      const taskList = screen.queryByTestId('task-list');
      expect(taskList).not.toBeInTheDocument();
    });

    test('should not call any callbacks when tasks array is empty', () => {
      render(<TaskList tasks={[]} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      expect(mockOnToggle).not.toHaveBeenCalled();
      expect(mockOnDelete).not.toHaveBeenCalled();
      expect(mockOnEdit).not.toHaveBeenCalled();
    });

    test('should apply proper ARIA attributes to empty state', () => {
      render(<TaskList tasks={[]} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      const emptyState = screen.getByTestId('task-list-empty');
      expect(emptyState).toHaveAttribute('role', 'status');
      expect(emptyState).toHaveAttribute('aria-live', 'polite');
    });

    test('should have correct data-testid on empty state', () => {
      render(<TaskList tasks={[]} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      const emptyState = screen.getByTestId('task-list-empty');
      expect(emptyState).toBeInTheDocument();
    });
  });

  describe('Rendering a List of Tasks', () => {
    test('should render a ul element when tasks array has items', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Task 1',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
        {
          id: '2',
          text: 'Task 2',
          completed: true,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      const taskList = screen.getByTestId('task-list');
      expect(taskList).toBeInTheDocument();
      expect(taskList).toHaveClass('task-list');
      expect(taskList.tagName).toBe('UL');
    });

    test('should render TaskItem components for each task in the array', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Task 1',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
        {
          id: '2',
          text: 'Task 2',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
        {
          id: '3',
          text: 'Task 3',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      expect(screen.getByTestId('task-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('task-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('task-item-3')).toBeInTheDocument();
    });

    test('should render tasks in the correct order', () => {
      const tasks: Task[] = [
        {
          id: '3',
          text: 'Third task',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
        {
          id: '1',
          text: 'First task',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
        {
          id: '2',
          text: 'Second task',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      const taskItems = screen.getAllByTestId(/task-item-/);
      expect(taskItems[0]).toHaveTextContent('Third task');
      expect(taskItems[1]).toHaveTextContent('First task');
      expect(taskItems[2]).toHaveTextContent('Second task');
    });

    test('should render only one TaskItem for each task', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Task 1',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
        {
          id: '2',
          text: 'Task 2',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      const taskItems = screen.getAllByTestId(/task-item-/);
      expect(taskItems).toHaveLength(2);
    });

    test('should not render empty state when tasks array has items', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Task 1',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      const emptyState = screen.queryByTestId('task-list-empty');
      expect(emptyState).not.toBeInTheDocument();
    });
  });

  describe('Callback Forwarding', () => {
    test('should forward onToggle callback to TaskItem components', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Task 1',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
        {
          id: '2',
          text: 'Task 2',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      // Simulate clicking on task item 1
      fireEvent.click(screen.getByTestId('task-item-1'));

      // Verify onToggle was called with the correct task ID
      expect(mockOnToggle).toHaveBeenCalledTimes(1);
      expect(mockOnToggle).toHaveBeenCalledWith('1');
    });

    test('should forward onToggle callback for each task when clicked', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Task 1',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
        {
          id: '2',
          text: 'Task 2',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      // Click first task
      fireEvent.click(screen.getByTestId('task-item-1'));
      expect(mockOnToggle).toHaveBeenCalledWith('1');

      // Click second task
      fireEvent.click(screen.getByTestId('task-item-2'));
      expect(mockOnToggle).toHaveBeenCalledWith('2');

      // Verify both callbacks were called
      expect(mockOnToggle).toHaveBeenCalledTimes(2);
    });

    test('should forward onDelete callback to TaskItem components', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Task 1',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      // Simulate clicking delete button
      fireEvent.click(screen.getByTestId('delete-button-1'));

      // Verify onDelete was called with the correct task ID
      expect(mockOnDelete).toHaveBeenCalledTimes(1);
      expect(mockOnDelete).toHaveBeenCalledWith('1');
    });

    test('should forward onDelete callback for each task when clicked', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Task 1',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
        {
          id: '2',
          text: 'Task 2',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      // Click delete button for first task
      fireEvent.click(screen.getByTestId('delete-button-1'));
      expect(mockOnDelete).toHaveBeenCalledWith('1');

      // Click delete button for second task
      fireEvent.click(screen.getByTestId('delete-button-2'));
      expect(mockOnDelete).toHaveBeenCalledWith('2');

      // Verify both callbacks were called
      expect(mockOnDelete).toHaveBeenCalledTimes(2);
    });

    test('should forward onEdit callback to TaskItem components', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Task 1',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      // Simulate double-clicking on task item
      fireEvent.doubleClick(screen.getByTestId('task-item-1'));

      // Verify onEdit was called with the correct task ID and text
      expect(mockOnEdit).toHaveBeenCalledTimes(1);
      expect(mockOnEdit).toHaveBeenCalledWith('1', 'Task 1');
    });

    test('should forward onEdit callback for each task when double-clicked', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Task 1',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
        {
          id: '2',
          text: 'Task 2',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      // Double-click first task
      fireEvent.doubleClick(screen.getByTestId('task-item-1'));
      expect(mockOnEdit).toHaveBeenCalledWith('1', 'Task 1');

      // Double-click second task
      fireEvent.doubleClick(screen.getByTestId('task-item-2'));
      expect(mockOnEdit).toHaveBeenCalledWith('2', 'Task 2');

      // Verify both callbacks were called
      expect(mockOnEdit).toHaveBeenCalledTimes(2);
    });

    test('should not call any callbacks when tasks array is empty', () => {
      render(<TaskList tasks={[]} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      expect(mockOnToggle).not.toHaveBeenCalled();
      expect(mockOnDelete).not.toHaveBeenCalled();
      expect(mockOnEdit).not.toHaveBeenCalled();
    });

    test('should handle multiple rapid clicks on the same task', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Task 1',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      // Rapidly click the task item multiple times
      fireEvent.click(screen.getByTestId('task-item-1'));
      fireEvent.click(screen.getByTestId('task-item-1'));
      fireEvent.click(screen.getByTestId('task-item-1'));

      // Verify onToggle was called three times
      expect(mockOnToggle).toHaveBeenCalledTimes(3);
    });
  });

  describe('Accessibility Features', () => {
    test('should apply correct role to task list', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Task 1',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      const taskList = screen.getByTestId('task-list');
      expect(taskList).toHaveAttribute('role', 'list');
    });

    test('should apply aria-label to task list', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Task 1',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      const taskList = screen.getByTestId('task-list');
      expect(taskList).toHaveAttribute('aria-label', 'Task list');
    });

    test('should apply correct role to empty state', () => {
      render(<TaskList tasks={[]} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      const emptyState = screen.getByTestId('task-list-empty');
      expect(emptyState).toHaveAttribute('role', 'status');
    });

    test('should apply aria-live to empty state', () => {
      render(<TaskList tasks={[]} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      const emptyState = screen.getByTestId('task-list-empty');
      expect(emptyState).toHaveAttribute('aria-live', 'polite');
    });

    test('should have proper heading structure in empty state', () => {
      render(<TaskList tasks={[]} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      const message = screen.getByText(/no tasks yet/i);
      expect(message).toBeInTheDocument();
    });
  });

  describe('Responsive Design Classes', () => {
    test('should apply task-list class to ul element', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Task 1',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      const taskList = screen.getByTestId('task-list');
      expect(taskList).toHaveClass('task-list');
    });

    test('should apply task-list-empty class to empty state div', () => {
      render(<TaskList tasks={[]} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      const emptyState = screen.getByTestId('task-list-empty');
      expect(emptyState).toHaveClass('task-list-empty');
    });

    test('should apply task-list-empty-message class to empty state message', () => {
      render(<TaskList tasks={[]} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      const message = screen.getByText(/no tasks yet/i);
      expect(message).toHaveClass('task-list-empty-message');
    });

    test('should not apply task-list class when tasks array is empty', () => {
      render(<TaskList tasks={[]} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      const taskList = screen.queryByTestId('task-list');
      expect(taskList).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('should handle single task in the list', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Single task',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      expect(screen.getByTestId('task-item-1')).toBeInTheDocument();
      expect(screen.queryAllByTestId(/task-item-/)).toHaveLength(1);
    });

    test('should handle tasks with special characters in text', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Task with special chars: @#$%^&*()',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      const taskItem = screen.getByTestId('task-item-1');
      expect(taskItem).toHaveTextContent('Task with special chars: @#$%^&*()');
    });

    test('should handle tasks with Unicode characters in text', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: '你好世界 🌍',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      const taskItem = screen.getByTestId('task-item-1');
      expect(taskItem).toHaveTextContent('你好世界 🌍');
    });

    test('should handle tasks with very long text', () => {
      const longText = 'A'.repeat(10000);
      const tasks: Task[] = [
        {
          id: '1',
          text: longText,
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      const taskItem = screen.getByTestId('task-item-1');
      expect(taskItem).toHaveTextContent(longText);
    });

    test('should handle tasks with mixed completed statuses', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Completed task',
          completed: true,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
        {
          id: '2',
          text: 'Incomplete task',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
        {
          id: '3',
          text: 'Another completed task',
          completed: true,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      expect(screen.getByTestId('task-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('task-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('task-item-3')).toBeInTheDocument();
    });

    test('should handle tasks with very large ID', () => {
      const tasks: Task[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          text: 'UUID task',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      expect(screen.getByTestId('task-item-550e8400-e29b-41d4-a716-446655440000')).toBeInTheDocument();
    });

    test('should handle tasks with numeric ID', () => {
      const tasks: Task[] = [
        {
          id: '12345',
          text: 'Numeric ID task',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      expect(screen.getByTestId('task-item-12345')).toBeInTheDocument();
    });

    test('should handle tasks with timestamp-based ID', () => {
      const tasks: Task[] = [
        {
          id: '1716969600000',
          text: 'Timestamp ID task',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      expect(screen.getByTestId('task-item-1716969600000')).toBeInTheDocument();
    });

    test('should handle tasks with different ISO8601 timestamp formats', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Task 1',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
        {
          id: '2',
          text: 'Task 2',
          completed: false,
          createdAt: '2026-04-28T00:00:00Z',
          updatedAt: '2026-04-28T00:00:00Z',
        },
        {
          id: '3',
          text: 'Task 3',
          completed: false,
          createdAt: '2026-04-28T12:34:56.789Z',
          updatedAt: '2026-04-28T12:34:56.789Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      expect(screen.getByTestId('task-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('task-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('task-item-3')).toBeInTheDocument();
    });

    test('should handle tasks with empty text', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: '',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      const taskItem = screen.getByTestId('task-item-1');
      expect(taskItem).toHaveTextContent('');
    });

    test('should handle tasks with only whitespace text', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: '   ',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      const taskItem = screen.getByTestId('task-item-1');
      expect(taskItem).toHaveTextContent('   ');
    });

    test('should handle tasks with line breaks in text', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Task with\nline breaks',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      const taskItem = screen.getByTestId('task-item-1');
      expect(taskItem).toHaveTextContent('Task with\nline breaks');
    });

    test('should handle tasks with multiple spaces in text', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Task with   multiple   spaces',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      const taskItem = screen.getByTestId('task-item-1');
      expect(taskItem).toHaveTextContent('Task with   multiple   spaces');
    });
  });

  describe('Component Rendering', () => {
    test('should render task list ul element', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Task 1',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      const taskList = screen.getByTestId('task-list');
      expect(taskList).toBeInTheDocument();
      expect(taskList.tagName).toBe('UL');
    });

    test('should render empty state div', () => {
      render(<TaskList tasks={[]} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      const emptyState = screen.getByTestId('task-list-empty');
      expect(emptyState).toBeInTheDocument();
    });

    test('should not render task list when tasks array is empty', () => {
      render(<TaskList tasks={[]} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      const taskList = screen.queryByTestId('task-list');
      expect(taskList).not.toBeInTheDocument();
    });

    test('should render empty state message when tasks array is empty', () => {
      render(<TaskList tasks={[]} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      const message = screen.getByText(/no tasks yet/i);
      expect(message).toBeInTheDocument();
    });

    test('should render task item elements', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Task 1',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      const taskItem = screen.getByTestId('task-item-1');
      expect(taskItem).toBeInTheDocument();
    });

    test('should not render task items when tasks array is empty', () => {
      render(<TaskList tasks={[]} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      const taskItem = screen.queryByTestId('task-item-1');
      expect(taskItem).not.toBeInTheDocument();
    });

    test('should render delete buttons for each task', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Task 1',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
        {
          id: '2',
          text: 'Task 2',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} onEdit={mockOnEdit} />);

      const deleteButtons = screen.getAllByTestId(/delete-button-/);
      expect(deleteButtons).toHaveLength(2);
    });
  });
});
