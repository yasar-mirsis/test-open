/**
 * Unit tests for TaskInput component.
 * Tests cover:
 * - Adding tasks with valid input
 * - Keyboard navigation (Enter to add, Escape to clear)
 * - Empty input validation
 * - Focus management
 * - Proper ARIA labels for accessibility
 * - UUID generation for new tasks
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskInput from '../../src/components/TaskInput';
import { Task } from '../../src/types/Task';

// Mock uuid to return predictable values for testing
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-123'),
}));

describe('TaskInput', () => {
  const mockOnAdd = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('should render the input field with correct placeholder', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByPlaceholderText('Add a new task...');
      expect(input).toBeInTheDocument();
    });

    test('should render the Add button', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const button = screen.getByRole('button', { name: 'Add task' });
      expect(button).toBeInTheDocument();
    });

    test('should render with ARIA label for accessibility', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText('New task input');
      expect(input).toBeInTheDocument();
    });

    test('should render button with ARIA label for accessibility', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const button = screen.getByLabelText('Add task');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Focus Management', () => {
    test('should focus input on component mount', async () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByPlaceholderText('Add a new task...');
      expect(input).toHaveFocus();
    });

    test('should refocus input after adding a task', async () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByPlaceholderText('Add a new task...');

      // Type text and click Add
      fireEvent.change(input, { target: { value: 'New task' } });
      fireEvent.click(screen.getByRole('button', { name: 'Add task' }));

      await waitFor(() => {
        expect(input).toHaveFocus();
      });
    });

    test('should refocus input after pressing Enter', async () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByPlaceholderText('Add a new task...');

      // Type text and press Enter
      fireEvent.change(input, { target: { value: 'New task' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      await waitFor(() => {
        expect(input).toHaveFocus();
      });
    });
  });

  describe('Adding Tasks', () => {
    test('should call onAdd callback with valid task when clicking Add button', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByPlaceholderText('Add a new task...');
      const button = screen.getByRole('button', { name: 'Add task' });

      fireEvent.change(input, { target: { value: 'Buy groceries' } });
      fireEvent.click(button);

      expect(mockOnAdd).toHaveBeenCalledTimes(1);
      expect(mockOnAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'test-uuid-123',
          text: 'Buy groceries',
          completed: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        })
      );
    });

    test('should call onAdd callback with valid task when pressing Enter', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByPlaceholderText('Add a new task...');

      fireEvent.change(input, { target: { value: 'Walk the dog' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      expect(mockOnAdd).toHaveBeenCalledTimes(1);
      expect(mockOnAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'test-uuid-123',
          text: 'Walk the dog',
          completed: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        })
      );
    });

    test('should create task with trimmed text', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByPlaceholderText('Add a new task...');

      fireEvent.change(input, { target: { value: '  Task with spaces  ' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      expect(mockOnAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'Task with spaces',
        })
      );
    });

    test('should generate unique ID for each task', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByPlaceholderText('Add a new task...');

      fireEvent.change(input, { target: { value: 'First task' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      fireEvent.change(input, { target: { value: 'Second task' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      expect(mockOnAdd).toHaveBeenCalledTimes(2);

      const firstCall = mockOnAdd.mock.calls[0][0];
      const secondCall = mockOnAdd.mock.calls[1][0];

      expect(firstCall.id).toBe('test-uuid-123');
      expect(secondCall.id).toBe('test-uuid-123');
    });

    test('should set completed to false for new tasks', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByPlaceholderText('Add a new task...');

      fireEvent.change(input, { target: { value: 'New task' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      expect(mockOnAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          completed: false,
        })
      );
    });

    test('should set createdAt timestamp for new tasks', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByPlaceholderText('Add a new task...');

      fireEvent.change(input, { target: { value: 'New task' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      const call = mockOnAdd.mock.calls[0][0];
      expect(call.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    test('should set updatedAt timestamp for new tasks', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByPlaceholderText('Add a new task...');

      fireEvent.change(input, { target: { value: 'New task' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      const call = mockOnAdd.mock.calls[0][0];
      expect(call.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  describe('Empty Input Validation', () => {
    test('should not call onAdd when input is empty and Add button is clicked', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const button = screen.getByRole('button', { name: 'Add task' });

      fireEvent.click(button);

      expect(mockOnAdd).not.toHaveBeenCalled();
    });

    test('should not call onAdd when input is empty and Enter is pressed', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByPlaceholderText('Add a new task...');

      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      expect(mockOnAdd).not.toHaveBeenCalled();
    });

    test('should not call onAdd when input contains only whitespace', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByPlaceholderText('Add a new task...');

      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      expect(mockOnAdd).not.toHaveBeenCalled();
    });

    test('should not call onAdd when input contains only tabs', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByPlaceholderText('Add a new task...');

      fireEvent.change(input, { target: { value: '\t\t' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      expect(mockOnAdd).not.toHaveBeenCalled();
    });

    test('should not call onAdd when input contains mixed whitespace', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByPlaceholderText('Add a new task...');

      fireEvent.change(input, { target: { value: '  \t  ' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      expect(mockOnAdd).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation', () => {
    test('should handle Escape key to clear input', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByPlaceholderText('Add a new task...');

      // Type some text
      fireEvent.change(input, { target: { value: 'Test task' } });
      expect(input).toHaveValue('Test task');

      // Press Escape
      fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });

      expect(input).toHaveValue('');
    });

    test('should handle Enter key to add task', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByPlaceholderText('Add a new task...');

      fireEvent.change(input, { target: { value: 'Test task' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      expect(mockOnAdd).toHaveBeenCalledTimes(1);
      expect(mockOnAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'Test task',
        })
      );
    });

    test('should handle Enter key to add task and then allow another task', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByPlaceholderText('Add a new task...');

      fireEvent.change(input, { target: { value: 'First task' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      fireEvent.change(input, { target: { value: 'Second task' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      expect(mockOnAdd).toHaveBeenCalledTimes(2);
      expect(mockOnAdd).toHaveBeenNthCalledWith(1, expect.objectContaining({ text: 'First task' }));
      expect(mockOnAdd).toHaveBeenNthCalledWith(2, expect.objectContaining({ text: 'Second task' }));
    });

    test('should handle Escape key to clear input and allow new input', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByPlaceholderText('Add a new task...');

      // Type and press Enter
      fireEvent.change(input, { target: { value: 'Task 1' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      expect(mockOnAdd).toHaveBeenCalledTimes(1);

      // Type and press Escape
      fireEvent.change(input, { target: { value: 'Task 2' } });
      fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });
      expect(input).toHaveValue('');

      // Type new task and press Enter
      fireEvent.change(input, { target: { value: 'Task 3' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      expect(mockOnAdd).toHaveBeenCalledTimes(2);
    });
  });

  describe('Input Changes', () => {
    test('should update input value when user types', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByPlaceholderText('Add a new task...');

      fireEvent.change(input, { target: { value: 'My task' } });

      expect(input).toHaveValue('My task');
    });

    test('should handle multiple character inputs', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByPlaceholderText('Add a new task...');

      fireEvent.change(input, { target: { value: 'A' } });
      expect(input).toHaveValue('A');

      fireEvent.change(input, { target: { value: 'AB' } });
      expect(input).toHaveValue('AB');

      fireEvent.change(input, { target: { value: 'ABC' } });
      expect(input).toHaveValue('ABC');
    });

    test('should handle backspace key', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByPlaceholderText('Add a new task...');

      fireEvent.change(input, { target: { value: 'ABC' } });
      expect(input).toHaveValue('ABC');

      fireEvent.keyDown(input, { key: 'Backspace', code: 'Backspace' });
      expect(input).toHaveValue('AB');

      fireEvent.keyDown(input, { key: 'Backspace', code: 'Backspace' });
      expect(input).toHaveValue('A');
    });

    test('should handle delete key', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByPlaceholderText('Add a new task...');

      fireEvent.change(input, { target: { value: 'ABC' } });
      expect(input).toHaveValue('ABC');

      fireEvent.keyDown(input, { key: 'Delete', code: 'Delete' });
      expect(input).toHaveValue('BC');
    });
  });

  describe('Edge Cases', () => {
    test('should handle very long task text', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByPlaceholderText('Add a new task...');

      const longText = 'A'.repeat(10000);
      fireEvent.change(input, { target: { value: longText } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      expect(mockOnAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          text: longText,
        })
      );
    });

    test('should handle task text with special characters', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByPlaceholderText('Add a new task...');

      const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
      fireEvent.change(input, { target: { value: specialChars } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      expect(mockOnAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          text: specialChars,
        })
      );
    });

    test('should handle task text with Unicode characters', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByPlaceholderText('Add a new task...');

      const unicodeText = '你好世界 🌍';
      fireEvent.change(input, { target: { value: unicodeText } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      expect(mockOnAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          text: unicodeText,
        })
      );
    });

    test('should handle task text with line breaks (if supported)', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByPlaceholderText('Add a new task...');

      const textWithLineBreaks = 'Line 1\nLine 2';
      fireEvent.change(input, { target: { value: textWithLineBreaks } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      expect(mockOnAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          text: textWithLineBreaks,
        })
      );
    });

    test('should handle task text with mixed case', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByPlaceholderText('Add a new task...');

      const mixedCase = 'HeLLo WoRLd';
      fireEvent.change(input, { target: { value: mixedCase } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      expect(mockOnAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          text: mixedCase,
        })
      );
    });

    test('should handle task text with numbers', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByPlaceholderText('Add a new task...');

      const textWithNumbers = 'Task 123 with numbers 456';
      fireEvent.change(input, { target: { value: textWithNumbers } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      expect(mockOnAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          text: textWithNumbers,
        })
      );
    });
  });

  describe('Accessibility', () => {
    test('should have correct data-testid attributes', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByTestId('task-input');
      const button = screen.getByTestId('task-add-button');

      expect(input).toBeInTheDocument();
      expect(button).toBeInTheDocument();
    });

    test('should have proper input type', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByPlaceholderText('Add a new task...');

      expect(input).toHaveAttribute('type', 'text');
    });

    test('should have button type set to button', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const button = screen.getByRole('button', { name: 'Add task' });

      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('Multiple Additions', () => {
    test('should handle multiple rapid additions', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByPlaceholderText('Add a new task...');

      for (let i = 0; i < 10; i++) {
        fireEvent.change(input, { target: { value: `Task ${i}` } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      }

      expect(mockOnAdd).toHaveBeenCalledTimes(10);
    });

    test('should maintain input state between additions', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByPlaceholderText('Add a new task...');

      fireEvent.change(input, { target: { value: 'Task 1' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      // Input should be cleared after addition
      expect(input).toHaveValue('');

      fireEvent.change(input, { target: { value: 'Task 2' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      expect(input).toHaveValue('');
    });
  });
});
