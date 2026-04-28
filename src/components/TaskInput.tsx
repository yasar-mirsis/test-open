import React, { useState, KeyboardEvent } from 'react';

/**
 * Props interface for the TaskInput component.
 */
interface TaskInputProps {
  /**
   * Callback function invoked when a new task is submitted.
   * @param text - The trimmed text of the task to be added.
   */
  onAdd: (text: string) => void;
}

/**
 * TaskInput component for adding new tasks.
 *
 * This component provides an input field and an Add button for users to create new tasks.
 * It supports keyboard navigation (Enter to submit, Escape to clear) and validates input
 * to prevent empty or whitespace-only tasks.
 *
 * @param props - The component props including the onAdd callback.
 * @returns A React functional component.
 */
export const TaskInput: React.FC<TaskInputProps> = ({ onAdd }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [error, setError] = useState<string>('');

  /**
   * Handles the submission of a new task.
   * Validates the input, trims whitespace, and calls the onAdd callback if valid.
   */
  const handleSubmit = (): void => {
    const trimmedText = inputValue.trim();

    // Validate input: reject empty strings or whitespace-only text
    if (!trimmedText) {
      setError('Please enter a task name');
      return;
    }

    // Clear any existing error
    setError('');

    // Call the callback with the trimmed text
    try {
      onAdd(trimmedText);
      // Clear the input after successful submission
      setInputValue('');
    } catch (_error) {
      setError('Failed to add task. Please try again.');
    }
  };

  /**
   * Handles keyboard events for the input field.
   * - Enter: Submits the task
   * - Escape: Clears the input
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setInputValue('');
      setError('');
    }
  };

  /**
   * Handles changes to the input field.
   * Updates the controlled state and clears any error messages.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  return (
    <div className="task-input-container">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter a new task..."
        className="task-input"
        aria-label="New task input"
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? 'task-input-error' : undefined}
      />
      <button
        type="button"
        onClick={handleSubmit}
        className="task-add-button"
        aria-label="Add task"
      >
        Add
      </button>
      {error && (
        <span id="task-input-error" className="task-input-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
