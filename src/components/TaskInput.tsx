import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../types/Task';

/**
 * Props interface for the TaskInput component.
 */
export interface TaskInputProps {
  /**
   * Callback when a new task is added.
   * @param task - The task object that was added.
   */
  onAdd: (task: Task) => void;
}

/**
 * TaskInput component captures user input for new tasks and triggers addition to the list.
 *
 * Features:
 * - Text input for entering task descriptions
 * - Add button to submit the task
 * - Keyboard support (Enter to submit, Escape to clear)
 * - Validation to prevent empty or whitespace-only tasks
 * - Proper ARIA labels for accessibility
 * - Focus management
 */
const TaskInput: React.FC<TaskInputProps> = ({ onAdd }) => {
  const [taskText, setTaskText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Focus the input when the component mounts.
   */
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  /**
   * Handle changes to the input field.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskText(e.target.value);
  };

  /**
   * Handle adding a new task.
   * Validates input and creates a new Task object with a unique ID.
   */
  const handleAdd = () => {
    const trimmedText = taskText.trim();

    // Prevent adding empty or whitespace-only tasks
    if (!trimmedText) {
      return;
    }

    // Create a new task object
    const newTask: Task = {
      id: uuidv4(),
      text: trimmedText,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Call the parent's onAdd callback
    onAdd(newTask);

    // Clear the input field
    setTaskText('');

    // Refocus the input for rapid entry
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  /**
   * Handle keyboard events in the input field.
   * Enter: Submit the task
   * Escape: Clear the input
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAdd();
    } else if (e.key === 'Escape') {
      setTaskText('');
    }
  };

  return (
    <div className="task-input-container">
      <input
        ref={inputRef}
        type="text"
        value={taskText}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Add a new task..."
        aria-label="New task input"
        className="task-input"
        data-testid="task-input"
      />
      <button
        onClick={handleAdd}
        aria-label="Add task"
        className="task-add-button"
        data-testid="task-add-button"
        type="button"
      >
        Add
      </button>
    </div>
  );
};

export default TaskInput;
