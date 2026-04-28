import React from 'react';
import { Task } from '../types/Task';
import { TaskItem } from './TaskItem';

/**
 * Props interface for the TaskList component.
 */
export interface TaskListProps {
  /**
   * List of tasks to render.
   */
  tasks: Task[];

  /**
   * Callback when a task's completion status is toggled.
   * @param id - The ID of the task to toggle.
   */
  onToggle: (id: string) => void;

  /**
   * Callback when a task is deleted.
   * @param id - The ID of the task to delete.
   */
  onDelete: (id: string) => void;

  /**
   * Callback when a task text is edited.
   * @param id - The ID of the task to edit.
   * @param text - The new text for the task.
   */
  onEdit: (id: string, text: string) => void;
}

/**
 * TaskList component displays all tasks and orchestrates user interactions.
 *
 * This component acts as a container that:
 * - Renders a list of TaskItem components
 * - Displays a friendly message when no tasks exist
 * - Forwards callback events to the parent component
 * - Does not manage any internal state
 *
 * Features:
 * - Responsive design with clean spacing
 * - Accessible list structure with proper ARIA labels
 * - Empty state with helpful message
 * - Proper keyboard navigation support through TaskItem components
 */
export const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle, onDelete, onEdit }) => {
  /**
   * Render the empty state message when no tasks exist.
   */
  if (tasks.length === 0) {
    return (
      <div
        className="task-list-empty"
        data-testid="task-list-empty"
        role="status"
        aria-live="polite"
      >
        <p className="task-list-empty-message">No tasks yet! Add one above.</p>
      </div>
    );
  }

  return (
    <ul
      className="task-list"
      data-testid="task-list"
      role="list"
      aria-label="Task list"
    >
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
};
