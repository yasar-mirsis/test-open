/**
 * Unit tests for TaskList component.
 * Tests cover:
 * - Rendering empty list with message
 * - Rendering tasks list with multiple tasks
 * - Rendering single task
 * - TaskItem component integration
 * - Accessibility (ARIA labels)
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TaskList } from '../../src/components/TaskList';
import { Task } from '../../src/types/Task';

describe('TaskList', () => {
  // Mock callback functions
  const mockOnToggle = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clean up any side effects
    jest.restoreAllMocks();
  });

  describe('Empty List Rendering', () => {
    test('should render empty state message when no tasks are provided', () => {
      render(<TaskList tasks={[]} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const emptyMessage = screen.getByText(/no tasks yet/i);
      expect(emptyMessage).toBeInTheDocument();
      expect(emptyMessage).toHaveTextContent('No tasks yet. Add one above!');
    });

    test('should render empty state message when tasks array is empty', () => {
      render(<TaskList tasks={[]} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const emptyMessage = screen.getByText(/no tasks yet/i);
      expect(emptyMessage).toBeInTheDocument();
    });

    test('should not render any task items when tasks array is empty', () => {
      render(<TaskList tasks={[]} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const taskItems = screen.queryAllByRole('listitem');
      expect(taskItems).toHaveLength(0);
    });

    test('should not render a <ul> element when tasks array is empty', () => {
      render(<TaskList tasks={[]} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const ul = screen.queryByRole('list');
      expect(ul).not.toBeInTheDocument();
    });
  });

  describe('Single Task Rendering', () => {
    test('should render a single task when tasks array has one item', () => {
      const singleTask: Task = {
        id: '1',
        text: 'Single task',
        completed: false,
        createdAt: '2026-04-28T00:00:00.000Z',
        updatedAt: '2026-04-28T00:00:00.000Z',
      };

      render(<TaskList tasks={[singleTask]} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const taskItem = screen.getByRole('listitem');
      expect(taskItem).toBeInTheDocument();
    });

    test('should render task text for single task', () => {
      const singleTask: Task = {
        id: '1',
        text: 'Single task',
        completed: false,
        createdAt: '2026-04-28T00:00:00.000Z',
        updatedAt: '2026-04-28T00:00:00.000Z',
      };

      render(<TaskList tasks={[singleTask]} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const taskText = screen.getByText('Single task');
      expect(taskText).toBeInTheDocument();
    });

    test('should render checkbox for single task', () => {
      const singleTask: Task = {
        id: '1',
        text: 'Single task',
        completed: false,
        createdAt: '2026-04-28T00:00:00.000Z',
        updatedAt: '2026-04-28T00:00:00.000Z',
      };

      render(<TaskList tasks={[singleTask]} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
    });

    test('should render delete button for single task', () => {
      const singleTask: Task = {
        id: '1',
        text: 'Single task',
        completed: false,
        createdAt: '2026-04-28T00:00:00.000Z',
        updatedAt: '2026-04-28T00:00:00.000Z',
      };

      render(<TaskList tasks={[singleTask]} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const deleteButton = screen.getByText('Delete');
      expect(deleteButton).toBeInTheDocument();
    });
  });

  describe('Multiple Tasks Rendering', () => {
    test('should render multiple task items when tasks array has multiple items', () => {
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
        {
          id: '3',
          text: 'Task 3',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const taskItems = screen.getAllByRole('listitem');
      expect(taskItems).toHaveLength(3);
    });

    test('should render all task texts when multiple tasks are provided', () => {
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

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });

    test('should render checkboxes for all tasks', () => {
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

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(2);
    });

    test('should render delete buttons for all tasks', () => {
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

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const deleteButtons = screen.getAllByText('Delete');
      expect(deleteButtons).toHaveLength(2);
    });

    test('should render <ul> element when multiple tasks are provided', () => {
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

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const ul = screen.getByRole('list');
      expect(ul).toBeInTheDocument();
    });
  });

  describe('TaskItem Integration', () => {
    test('should pass task data to TaskItem component', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Task 1',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const taskText = screen.getByText('Task 1');
      expect(taskText).toBeInTheDocument();
    });

    test('should pass onToggle callback to TaskItem component', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Task 1',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(mockOnToggle).toHaveBeenCalledWith('1');
    });

    test('should pass onDelete callback to TaskItem component', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Task 1',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const deleteButton = screen.getByText('Delete');
      fireEvent.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledWith('1');
    });

    test('should call onToggle with correct task ID', () => {
      const tasks: Task[] = [
        {
          id: 'task-123',
          text: 'Task 123',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(mockOnToggle).toHaveBeenCalledWith('task-123');
    });

    test('should call onDelete with correct task ID', () => {
      const tasks: Task[] = [
        {
          id: 'task-456',
          text: 'Task 456',
          completed: true,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const deleteButton = screen.getByText('Delete');
      fireEvent.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledWith('task-456');
    });
  });

  describe('Completed Task Styling', () => {
    test('should render task with completed: true', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Completed task',
          completed: true,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    test('should render task with completed: false', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Incomplete task',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    test('should render checkbox unchecked for incomplete task', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Incomplete task',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });
  });

  describe('Accessibility', () => {
    test('should have aria-label on list', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Task 1',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const list = screen.getByRole('list');
      expect(list).toHaveAttribute('aria-label', 'Task list');
    });

    test('should have listitem role on task elements', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Task 1',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const taskItems = screen.getAllByRole('listitem');
      expect(taskItems).toHaveLength(1);
    });

    test('should have accessible checkbox labels for each task', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Task 1',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-label');
    });

    test('should have accessible delete button labels for each task', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Task 1',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const deleteButton = screen.getByText('Delete');
      expect(deleteButton).toHaveAttribute('aria-label');
    });
  });

  describe('Edge Cases', () => {
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

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const taskItem = screen.getByRole('listitem');
      expect(taskItem).toBeInTheDocument();
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

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const taskItem = screen.getByRole('listitem');
      expect(taskItem).toBeInTheDocument();
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

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const taskText = screen.getByText(longText);
      expect(taskText).toBeInTheDocument();
    });

    test('should handle tasks with Unicode characters', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: '你好世界 🌍',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const taskText = screen.getByText('你好世界 🌍');
      expect(taskText).toBeInTheDocument();
    });

    test('should handle tasks with special characters', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Task with special chars: @#$%^&*()',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const taskText = screen.getByText('Task with special chars: @#$%^&*()');
      expect(taskText).toBeInTheDocument();
    });

    test('should handle tasks with line breaks', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Task with\nline breaks',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const taskText = screen.getByText('Task with\nline breaks');
      expect(taskText).toBeInTheDocument();
    });

    test('should handle very large number of tasks', () => {
      const tasks: Task[] = Array.from({ length: 100 }, (_, i) => ({
        id: `${i}`,
        text: `Task ${i}`,
        completed: i % 2 === 0,
        createdAt: '2026-04-28T00:00:00.000Z',
        updatedAt: '2026-04-28T00:00:00.000Z',
      }));

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const taskItems = screen.getAllByRole('listitem');
      expect(taskItems).toHaveLength(100);
    });

    test('should handle tasks with different completed statuses mixed', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Task 1',
          completed: true,
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
          completed: true,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
        {
          id: '4',
          text: 'Task 4',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(4);

      // Check that checkboxes are correctly checked/unchecked
      const checkedCheckboxes = screen.getAllByRole('checkbox', { checked: true });
      const uncheckedCheckboxes = screen.getAllByRole('checkbox', { checked: false });

      expect(checkedCheckboxes).toHaveLength(2);
      expect(uncheckedCheckboxes).toHaveLength(2);
    });
  });

  describe('Component Rendering', () => {
    test('should render list element', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Task 1',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
    });

    test('should not render list element when tasks array is empty', () => {
      render(<TaskList tasks={[]} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const list = screen.queryByRole('list');
      expect(list).not.toBeInTheDocument();
    });

    test('should render task item for each task', () => {
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

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const taskItems = screen.getAllByRole('listitem');
      expect(taskItems).toHaveLength(2);
    });

    test('should render task text correctly', () => {
      const tasks: Task[] = [
        {
          id: '1',
          text: 'Test task text',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        },
      ];

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const taskText = screen.getByText('Test task text');
      expect(taskText).toBeInTheDocument();
    });

    test('should render checkbox for each task', () => {
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

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(2);
    });

    test('should render delete button for each task', () => {
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

      render(<TaskList tasks={tasks} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const deleteButtons = screen.getAllByText('Delete');
      expect(deleteButtons).toHaveLength(2);
    });

    test('should not render any content when tasks array is empty', () => {
      render(<TaskList tasks={[]} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      const taskItems = screen.queryAllByRole('listitem');
      expect(taskItems).toHaveLength(0);

      const checkboxes = screen.queryAllByRole('checkbox');
      expect(checkboxes).toHaveLength(0);

      const deleteButtons = screen.queryAllByText('Delete');
      expect(deleteButtons).toHaveLength(0);
    });
  });
});
