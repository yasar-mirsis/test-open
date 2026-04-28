/**
 * Unit tests for TaskInput component.
 * Tests cover:
 * - Happy path: user enters text and clicks Add button - onAdd callback is called with trimmed text
 * - Happy path: user enters text and presses Enter - onAdd callback is called
 * - Validation: empty string submission shows error message
 * - Validation: whitespace-only submission shows error message
 * - Keyboard navigation: Escape key clears input and error
 * - Controlled input: input value updates correctly on change
 * - Error clearing: error message clears when user starts typing
 * - Accessibility: verify ARIA attributes are present
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TaskInput } from '../../src/components/TaskInput';

describe('TaskInput', () => {
  // Mock callback functions
  const mockOnAdd = jest.fn();

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clean up any side effects
    jest.restoreAllMocks();
  });

  describe('Happy Path - Button Click', () => {
    test('should call onAdd callback with trimmed text when Add button is clicked', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i);

      // Type text with leading and trailing whitespace
      fireEvent.change(input, { target: { value: '  Test task  ' } });

      // Click the Add button
      fireEvent.click(addButton);

      // Verify onAdd was called with trimmed text
      expect(mockOnAdd).toHaveBeenCalledTimes(1);
      expect(mockOnAdd).toHaveBeenCalledWith('Test task');
    });

    test('should call onAdd callback with trimmed text when clicking Add button on empty input', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const addButton = screen.getByLabelText(/add task/i);

      // Click the Add button without typing
      fireEvent.click(addButton);

      // Verify onAdd was NOT called
      expect(mockOnAdd).not.toHaveBeenCalled();
    });

    test('should clear input after successful submission via button click', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i);

      // Type text
      fireEvent.change(input, { target: { value: 'Test task' } });

      // Click Add button
      fireEvent.click(addButton);

      // Verify input is cleared
      expect(input).toHaveValue('');
    });

    test('should call onAdd callback with trimmed text for single space', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i);

      // Type a single space
      fireEvent.change(input, { target: { value: ' ' } });

      // Click Add button
      fireEvent.click(addButton);

      // Verify onAdd was NOT called (single space is invalid)
      expect(mockOnAdd).not.toHaveBeenCalled();
    });

    test('should call onAdd callback with trimmed text for multiple spaces', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i);

      // Type multiple spaces
      fireEvent.change(input, { target: { value: '   Test   Task   ' } });

      // Click Add button
      fireEvent.click(addButton);

      // Verify onAdd was called with trimmed text
      expect(mockOnAdd).toHaveBeenCalledTimes(1);
      expect(mockOnAdd).toHaveBeenCalledWith('Test   Task');
    });
  });

  describe('Happy Path - Enter Key', () => {
    test('should call onAdd callback when Enter key is pressed', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);

      // Type text and press Enter
      fireEvent.change(input, { target: { value: 'Test task via Enter' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      // Verify onAdd was called
      expect(mockOnAdd).toHaveBeenCalledTimes(1);
      expect(mockOnAdd).toHaveBeenCalledWith('Test task via Enter');
    });

    test('should prevent default Enter key behavior', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);

      // Type text and press Enter
      fireEvent.change(input, { target: { value: 'Test task' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', preventDefault: jest.fn() });

      // Verify preventDefault was called
      expect(input).toHaveValue('Test task');
    });

    test('should clear input after successful submission via Enter key', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);

      // Type text and press Enter
      fireEvent.change(input, { target: { value: 'Test task via Enter' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      // Verify input is cleared
      expect(input).toHaveValue('');
    });

    test('should NOT call onAdd when pressing Enter on empty input', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);

      // Press Enter without typing
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      // Verify onAdd was NOT called
      expect(mockOnAdd).not.toHaveBeenCalled();
    });

    test('should NOT call onAdd when pressing Enter on whitespace-only input', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);

      // Type spaces and press Enter
      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      // Verify onAdd was NOT called
      expect(mockOnAdd).not.toHaveBeenCalled();
    });
  });

  describe('Validation - Empty String', () => {
    test('should show error message when submitting empty string via button', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i);

      // Clear input
      fireEvent.change(input, { target: { value: '' } });

      // Click Add button
      fireEvent.click(addButton);

      // Verify error message is displayed
      expect(screen.getByText(/please enter a task name/i)).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent('Please enter a task name');
    });

    test('should show error message when submitting empty string via Enter key', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);

      // Clear input
      fireEvent.change(input, { target: { value: '' } });

      // Press Enter
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      // Verify error message is displayed
      expect(screen.getByText(/please enter a task name/i)).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent('Please enter a task name');
    });

    test('should NOT call onAdd when submitting empty string', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i);

      // Clear input
      fireEvent.change(input, { target: { value: '' } });

      // Click Add button
      fireEvent.click(addButton);

      // Verify onAdd was NOT called
      expect(mockOnAdd).not.toHaveBeenCalled();
    });
  });

  describe('Validation - Whitespace-Only', () => {
    test('should show error message when submitting only spaces via button', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i);

      // Type only spaces
      fireEvent.change(input, { target: { value: '   ' } });

      // Click Add button
      fireEvent.click(addButton);

      // Verify error message is displayed
      expect(screen.getByText(/please enter a task name/i)).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent('Please enter a task name');
    });

    test('should show error message when submitting only spaces via Enter key', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);

      // Type only spaces
      fireEvent.change(input, { target: { value: '   ' } });

      // Press Enter
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      // Verify error message is displayed
      expect(screen.getByText(/please enter a task name/i)).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent('Please enter a task name');
    });

    test('should NOT call onAdd when submitting whitespace-only text', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i);

      // Type only spaces
      fireEvent.change(input, { target: { value: '   ' } });

      // Click Add button
      fireEvent.click(addButton);

      // Verify onAdd was NOT called
      expect(mockOnAdd).not.toHaveBeenCalled();
    });

    test('should handle tabs and newlines as whitespace', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i);

      // Type tabs and newlines
      fireEvent.change(input, { target: { value: '\t\n   \t\n' } });

      // Click Add button
      fireEvent.click(addButton);

      // Verify error message is displayed
      expect(screen.getByText(/please enter a task name/i)).toBeInTheDocument();
      expect(mockOnAdd).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation - Escape Key', () => {
    test('should clear input when Escape key is pressed', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);

      // Type some text
      fireEvent.change(input, { target: { value: 'Test task' } });

      // Press Escape
      fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });

      // Verify input is cleared
      expect(input).toHaveValue('');
    });

    test('should clear error message when Escape key is pressed', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i);

      // Type empty input and click Add to show error
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.click(addButton);

      // Verify error is displayed
      expect(screen.getByText(/please enter a task name/i)).toBeInTheDocument();

      // Press Escape
      fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });

      // Verify error is cleared
      expect(screen.queryByText(/please enter a task name/i)).not.toBeInTheDocument();
    });

    test('should clear both input and error when Escape key is pressed with error', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i);

      // Type empty input and click Add to show error
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.click(addButton);

      // Verify error is displayed
      expect(screen.getByText(/please enter a task name/i)).toBeInTheDocument();

      // Press Escape
      fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });

      // Verify both input and error are cleared
      expect(input).toHaveValue('');
      expect(screen.queryByText(/please enter a task name/i)).not.toBeInTheDocument();
    });

    test('should prevent default Escape key behavior', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);

      // Type some text
      fireEvent.change(input, { target: { value: 'Test task' } });

      // Press Escape
      fireEvent.keyDown(input, { key: 'Escape', code: 'Escape', preventDefault: jest.fn() });

      // Verify preventDefault was called
      expect(input).toHaveValue('Test task');
    });
  });

  describe('Controlled Input', () => {
    test('should update input value when user types', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);

      // Type text
      fireEvent.change(input, { target: { value: 'Test task' } });

      // Verify input value is updated
      expect(input).toHaveValue('Test task');
    });

    test('should handle multiple typing events', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);

      // Type first character
      fireEvent.change(input, { target: { value: 'T' } });
      expect(input).toHaveValue('T');

      // Type second character
      fireEvent.change(input, { target: { value: 'Te' } });
      expect(input).toHaveValue('Te');

      // Type third character
      fireEvent.change(input, { target: { value: 'Tes' } });
      expect(input).toHaveValue('Tes');

      // Type fourth character
      fireEvent.change(input, { target: { value: 'Test' } });
      expect(input).toHaveValue('Test');
    });

    test('should handle text deletion', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);

      // Type text
      fireEvent.change(input, { target: { value: 'Test task' } });
      expect(input).toHaveValue('Test task');

      // Delete last character
      fireEvent.change(input, { target: { value: 'Test tas' } });
      expect(input).toHaveValue('Test tas');

      // Delete more characters
      fireEvent.change(input, { target: { value: 'Test ta' } });
      expect(input).toHaveValue('Test ta');
    });

    test('should handle text replacement', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);

      // Type text
      fireEvent.change(input, { target: { value: 'Test task' } });
      expect(input).toHaveValue('Test task');

      // Replace entire text
      fireEvent.change(input, { target: { value: 'New task' } });
      expect(input).toHaveValue('New task');
    });
  });

  describe('Error Clearing', () => {
    test('should clear error message when user starts typing', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i);

      // Type empty input and click Add to show error
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.click(addButton);

      // Verify error is displayed
      expect(screen.getByText(/please enter a task name/i)).toBeInTheDocument();

      // Start typing
      fireEvent.change(input, { target: { value: 'T' } });

      // Verify error is cleared
      expect(screen.queryByText(/please enter a task name/i)).not.toBeInTheDocument();
    });

    test('should clear error message when user types after whitespace-only submission', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i);

      // Type spaces and click Add to show error
      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.click(addButton);

      // Verify error is displayed
      expect(screen.getByText(/please enter a task name/i)).toBeInTheDocument();

      // Start typing
      fireEvent.change(input, { target: { value: 'T' } });

      // Verify error is cleared
      expect(screen.queryByText(/please enter a task name/i)).not.toBeInTheDocument();
    });

    test('should clear error message when pressing Escape', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i);

      // Type empty input and click Add to show error
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.click(addButton);

      // Verify error is displayed
      expect(screen.getByText(/please enter a task name/i)).toBeInTheDocument();

      // Press Escape
      fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });

      // Verify error is cleared
      expect(screen.queryByText(/please enter a task name/i)).not.toBeInTheDocument();
    });

    test('should clear error message when submitting valid task', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i);

      // Type empty input and click Add to show error
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.click(addButton);

      // Verify error is displayed
      expect(screen.getByText(/please enter a task name/i)).toBeInTheDocument();

      // Type valid task and submit
      fireEvent.change(input, { target: { value: 'Valid task' } });
      fireEvent.click(addButton);

      // Verify error is cleared
      expect(screen.queryByText(/please enter a task name/i)).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('should have aria-label on input', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);
      expect(input).toBeInTheDocument();
    });

    test('should have aria-label on Add button', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const button = screen.getByLabelText(/add task/i);
      expect(button).toBeInTheDocument();
    });

    test('should set aria-invalid to true when error is present', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i);

      // Type empty input and click Add to show error
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.click(addButton);

      // Verify aria-invalid is true
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    test('should set aria-invalid to false when no error is present', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);

      // Verify aria-invalid is false by default
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });

    test('should set aria-describedby when error is present', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i);

      // Type empty input and click Add to show error
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.click(addButton);

      // Verify aria-describedby is set
      expect(input).toHaveAttribute('aria-describedby', 'task-input-error');
    });

    test('should not set aria-describedby when no error is present', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);

      // Verify aria-describedby is not set
      expect(input).not.toHaveAttribute('aria-describedby');
    });

    test('should have error message with role="alert"', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i);

      // Type empty input and click Add to show error
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.click(addButton);

      // Verify error message has role="alert"
      const errorElement = screen.getByRole('alert');
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveTextContent('Please enter a task name');
    });

    test('should have correct input type', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);

      // Verify input type is text
      expect(input).toHaveAttribute('type', 'text');
    });

    test('should have correct placeholder text', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);

      // Verify placeholder is set
      expect(input).toHaveAttribute('placeholder', 'Enter a new task...');
    });

    test('should have correct button type', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const button = screen.getByLabelText(/add task/i);

      // Verify button type is button
      expect(button).toHaveAttribute('type', 'button');
    });

    test('should be keyboard accessible', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);

      // Verify input is focusable
      expect(input).toHaveAttribute('tabindex', '0');
    });
  });

  describe('Edge Cases', () => {
    test('should handle special characters in task text', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i);

      // Type special characters
      fireEvent.change(input, { target: { value: 'Task with special chars: @#$%^&*()' } });
      fireEvent.click(addButton);

      // Verify onAdd was called with special characters
      expect(mockOnAdd).toHaveBeenCalledTimes(1);
      expect(mockOnAdd).toHaveBeenCalledWith('Task with special chars: @#$%^&*()');
    });

    test('should handle Unicode characters in task text', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i);

      // Type Unicode characters
      fireEvent.change(input, { target: { value: '你好世界 🌍' } });
      fireEvent.click(addButton);

      // Verify onAdd was called with Unicode characters
      expect(mockOnAdd).toHaveBeenCalledTimes(1);
      expect(mockOnAdd).toHaveBeenCalledWith('你好世界 🌍');
    });

    test('should handle very long task text', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i);

      // Type very long text
      const longText = 'A'.repeat(10000);
      fireEvent.change(input, { target: { value: longText } });
      fireEvent.click(addButton);

      // Verify onAdd was called with the long text
      expect(mockOnAdd).toHaveBeenCalledTimes(1);
      expect(mockOnAdd).toHaveBeenCalledWith(longText);
    });

    test('should handle task text with leading/trailing newlines', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i);

      // Type text with newlines
      fireEvent.change(input, { target: { value: '\n\nTest task\n\n' } });
      fireEvent.click(addButton);

      // Verify onAdd was called with trimmed text
      expect(mockOnAdd).toHaveBeenCalledTimes(1);
      expect(mockOnAdd).toHaveBeenCalledWith('Test task');
    });

    test('should handle task text with mixed whitespace', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i);

      // Type text with mixed whitespace
      fireEvent.change(input, { target: { value: '  Test \t task  \n  ' } });
      fireEvent.click(addButton);

      // Verify onAdd was called with trimmed text
      expect(mockOnAdd).toHaveBeenCalledTimes(1);
      expect(mockOnAdd).toHaveBeenCalledWith('Test \t task');
    });

    test('should handle rapid typing and submission', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i);

      // Rapidly type and submit multiple times
      fireEvent.change(input, { target: { value: 'Task' } });
      fireEvent.click(addButton);
      expect(mockOnAdd).toHaveBeenCalledWith('Task');

      fireEvent.change(input, { target: { value: 'Task 1' } });
      fireEvent.click(addButton);
      expect(mockOnAdd).toHaveBeenCalledWith('Task 1');

      fireEvent.change(input, { target: { value: 'Task 2' } });
      fireEvent.click(addButton);
      expect(mockOnAdd).toHaveBeenCalledWith('Task 2');

      expect(mockOnAdd).toHaveBeenCalledTimes(3);
    });

    test('should handle pressing Enter multiple times without valid input', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);

      // Press Enter multiple times without typing
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      expect(mockOnAdd).not.toHaveBeenCalled();

      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      expect(mockOnAdd).not.toHaveBeenCalled();

      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      expect(mockOnAdd).not.toHaveBeenCalled();

      expect(mockOnAdd).not.toHaveBeenCalled();
    });

    test('should handle submitting after typing and clearing multiple times', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i);

      // Type and submit
      fireEvent.change(input, { target: { value: 'Task 1' } });
      fireEvent.click(addButton);
      expect(mockOnAdd).toHaveBeenCalledWith('Task 1');

      // Clear and submit again
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.click(addButton);
      expect(mockOnAdd).not.toHaveBeenCalled();

      // Type and submit again
      fireEvent.change(input, { target: { value: 'Task 2' } });
      fireEvent.click(addButton);
      expect(mockOnAdd).toHaveBeenCalledWith('Task 2');

      expect(mockOnAdd).toHaveBeenCalledTimes(2);
    });
  });

  describe('Error Handling - onAdd Callback', () => {
    test('should display error message when onAdd throws an error', () => {
      // Create a mock that throws an error
      const mockOnAddThrowing = jest.fn(() => {
        throw new Error('Failed to add task');
      });

      render(<TaskInput onAdd={mockOnAddThrowing} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i);

      // Type a valid task
      fireEvent.change(input, { target: { value: 'Test task' } });

      // Click Add button
      fireEvent.click(addButton);

      // Verify error message is displayed
      expect(screen.getByText(/failed to add task/i)).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent('Failed to add task. Please try again.');
    });

    test('should NOT clear input when onAdd throws an error', () => {
      // Create a mock that throws an error
      const mockOnAddThrowing = jest.fn(() => {
        throw new Error('Failed to add task');
      });

      render(<TaskInput onAdd={mockOnAddThrowing} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i);

      // Type a valid task
      fireEvent.change(input, { target: { value: 'Test task' } });

      // Verify input has value before submission
      expect(input).toHaveValue('Test task');

      // Click Add button
      fireEvent.click(addButton);

      // Verify input is NOT cleared after error
      expect(input).toHaveValue('Test task');
    });

    test('should call onAdd callback even when it throws an error', () => {
      // Create a mock that throws an error
      const mockOnAddThrowing = jest.fn(() => {
        throw new Error('Failed to add task');
      });

      render(<TaskInput onAdd={mockOnAddThrowing} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i');

      // Type a valid task
      fireEvent.change(input, { target: { value: 'Test task' } });

      // Click Add button
      fireEvent.click(addButton);

      // Verify onAdd was called
      expect(mockOnAddThrowing).toHaveBeenCalledTimes(1);
      expect(mockOnAddThrowing).toHaveBeenCalledWith('Test task');
    });

    test('should allow user to retry and successfully add a task after error', () => {
      // Create a mock that initially throws an error, then succeeds
      const mockOnAdd = jest.fn()
        .mockImplementationOnce(() => {
          throw new Error('Failed to add task');
        })
        .mockImplementationOnce(() => {
          // Second call succeeds
        });

      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i');

      // Type a valid task
      fireEvent.change(input, { target: { value: 'Test task' } });

      // Click Add button - first attempt fails
      fireEvent.click(addButton);

      // Verify error is displayed
      expect(screen.getByText(/failed to add task/i)).toBeInTheDocument();

      // Verify input still has value
      expect(input).toHaveValue('Test task');

      // Modify the input to make it different
      fireEvent.change(input, { target: { value: 'New task' } });

      // Click Add button again - second attempt succeeds
      fireEvent.click(addButton);

      // Verify no error is displayed
      expect(screen.queryByText(/failed to add task/i)).not.toBeInTheDocument();

      // Verify onAdd was called twice
      expect(mockOnAdd).toHaveBeenCalledTimes(2);
      expect(mockOnAdd).toHaveBeenNthCalledWith(1, 'Test task');
      expect(mockOnAdd).toHaveBeenNthCalledWith(2, 'New task');
    });

    test('should handle different error messages from onAdd callback', () => {
      // Create a mock that throws different errors
      const mockOnAddThrowing = jest.fn(() => {
        throw new Error('Network error');
      });

      render(<TaskInput onAdd={mockOnAddThrowing} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i');

      // Type a valid task
      fireEvent.change(input, { target: { value: 'Test task' } });

      // Click Add button
      fireEvent.click(addButton);

      // Verify the error message is generic (not the original error message)
      expect(screen.getByText(/failed to add task/i)).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent('Failed to add task. Please try again.');
    });

    test('should handle TypeError from onAdd callback', () => {
      // Create a mock that throws a TypeError
      const mockOnAddThrowing = jest.fn(() => {
        throw new TypeError('Invalid task text');
      });

      render(<TaskInput onAdd={mockOnAddThrowing} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i');

      // Type a valid task
      fireEvent.change(input, { target: { value: 'Test task' } });

      // Click Add button
      fireEvent.click(addButton);

      // Verify error message is displayed (generic error handling)
      expect(screen.getByText(/failed to add task/i)).toBeInTheDocument();
      expect(mockOnAddThrowing).toHaveBeenCalledTimes(1);
    });

    test('should clear error message after successful retry', () => {
      // Create a mock that initially throws an error, then succeeds
      const mockOnAdd = jest.fn()
        .mockImplementationOnce(() => {
          throw new Error('Failed to add task');
        })
        .mockImplementationOnce(() => {
          // Second call succeeds
        });

      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i');

      // Type a valid task
      fireEvent.change(input, { target: { value: 'Test task' } });

      // Click Add button - first attempt fails
      fireEvent.click(addButton);

      // Verify error is displayed
      expect(screen.getByText(/failed to add task/i)).toBeInTheDocument();

      // Modify the input to make it different
      fireEvent.change(input, { target: { value: 'New task' } });

      // Click Add button again - second attempt succeeds
      fireEvent.click(addButton);

      // Verify error is cleared
      expect(screen.queryByText(/failed to add task/i)).not.toBeInTheDocument();
    });
  });

  describe('Component Rendering', () => {
    test('should render input field', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);
      expect(input).toBeInTheDocument();
    });

    test('should render Add button', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const button = screen.getByLabelText(/add task/i);
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Add');
    });

    test('should not render error message initially', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const error = screen.queryByText(/please enter a task name/i);
      expect(error).not.toBeInTheDocument();
    });

    test('should render error message when error state is present', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i');

      // Type empty input and click Add to show error
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.click(addButton);

      const error = screen.getByText(/please enter a task name/i);
      expect(error).toBeInTheDocument();
    });

    test('should have correct className on input', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);
      expect(input).toHaveClass('task-input');
    });

    test('should have correct className on Add button', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const button = screen.getByLabelText(/add task/i);
      expect(button).toHaveClass('task-add-button');
    });

    test('should have correct className on error message', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i');

      // Type empty input and click Add to show error
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.click(addButton);

      const error = screen.getByText(/please enter a task name/i);
      expect(error).toHaveClass('task-input-error');
    });
  });
});

    test('should render Add button', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const button = screen.getByLabelText(/add task/i);
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Add');
    });

    test('should not render error message initially', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const error = screen.queryByText(/please enter a task name/i);
      expect(error).not.toBeInTheDocument();
    });

    test('should render error message when error state is present', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i);

      // Type empty input and click Add to show error
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.click(addButton);

      const error = screen.getByText(/please enter a task name/i);
      expect(error).toBeInTheDocument();
    });

    test('should have correct className on input', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);
      expect(input).toHaveClass('task-input');
    });

    test('should have correct className on Add button', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const button = screen.getByLabelText(/add task/i);
      expect(button).toHaveClass('task-add-button');
    });

    test('should have correct className on error message', () => {
      render(<TaskInput onAdd={mockOnAdd} />);

      const input = screen.getByLabelText(/new task input/i);
      const addButton = screen.getByLabelText(/add task/i);

      // Type empty input and click Add to show error
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.click(addButton);

      const error = screen.getByText(/please enter a task name/i);
      expect(error).toHaveClass('task-input-error');
    });
  });
});
