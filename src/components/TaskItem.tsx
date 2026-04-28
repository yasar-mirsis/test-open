import React, { useState, useRef, useEffect } from 'react';
import { Task } from '../types/Task';

/**
 * Props interface for the TaskItem component.
 */
export interface TaskItemProps {
  /**
   * The task object to display.
   */
  task: Task;

  /**
   * Callback when the task's completion status is toggled.
   * @param id - The ID of the task to toggle.
   */
  onToggle: (id: string) => void;

  /**
   * Callback when the task is deleted.
   * @param id - The ID of the task to delete.
   */
  onDelete: (id: string) => void;

  /**
   * Callback when the task text is edited.
   * @param id - The ID of the task to edit.
   * @param text - The new text for the task.
   */
  onEdit: (id: string, text: string) => void;
}

/**
 * TaskItem component displays a single task with controls for completion, editing, and deletion.
 *
 * Features:
 * - Checkbox to toggle task completion
 * - Task text with strikethrough when completed
 * - Inline editing via double-click or edit button
 * - Delete button to remove the task
 * - Proper ARIA labels for accessibility
 * - Keyboard navigation support
 */
export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Focus the input when editing mode is activated.
   */
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  /**
   * Handle changes to the edit input.
   */
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  /**
   * Handle saving the edited text.
   * Only saves if the text is not empty or whitespace-only.
   */
  const handleSave = () => {
    const trimmedText = editText.trim();
    if (trimmedText) {
      onEdit(task.id, trimmedText);
    } else {
      // Revert to original text if empty
      setEditText(task.text);
    }
    setIsEditing(false);
  };

  /**
   * Handle keyboard events in edit mode.
   * Enter: Save and exit edit mode
   * Escape: Cancel editing and revert to original text
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditText(task.text);
      setIsEditing(false);
    }
  };

  /**
   * Handle blur event to save when clicking outside.
   */
  const handleBlur = () => {
    handleSave();
  };

  /**
   * Handle double-click on task text to enter edit mode.
   */
  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditText(task.text);
  };

  /**
   * Handle click on edit button to enter edit mode.
   */
  const handleEditClick = () => {
    setIsEditing(true);
    setEditText(task.text);
  };

  return (
    <li
      className="task-item"
      data-testid={`task-item-${task.id}`}
      aria-label={`Task: ${task.text}`}
    >
      <div className="task-item-content">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          aria-label={`Mark task "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`}
          className="task-checkbox"
          data-testid={`task-checkbox-${task.id}`}
        />

        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={handleEditChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            aria-label="Edit task text"
            className="task-edit-input"
            data-testid={`task-edit-input-${task.id}`}
          />
        ) : (
          <span
            className={`task-text ${task.completed ? 'task-text-completed' : ''}`}
            onDoubleClick={handleDoubleClick}
            aria-label={`Task text: ${task.text}${task.completed ? ', completed' : ', not completed'}`}
            data-testid={`task-text-${task.id}`}
            role="text"
            tabIndex={0}
          >
            {task.text}
          </span>
        )}

        <div className="task-actions">
          {!isEditing && (
            <button
              onClick={handleEditClick}
              aria-label={`Edit task "${task.text}"`}
              className="task-edit-button"
              data-testid={`task-edit-button-${task.id}`}
              type="button"
            >
              Edit
            </button>
          )}

          <button
            onClick={() => onDelete(task.id)}
            aria-label={`Delete task "${task.text}"`}
            className="task-delete-button"
            data-testid={`task-delete-button-${task.id}`}
            type="button"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
};
