import React from 'react';
import { Task } from '../types/Task';
import TaskItem from './TaskItem';

/**
 * Props interface for the TaskList component.
 */
export interface TaskListProps {
  /**
   * The list of tasks to display.
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
   * Callback when a task's text is edited.
   * @param id - The ID of the task to edit.
   * @param text - The new text for the task.
   */
  onEdit: (id: string, text: string) => void;
}

/**
 * TaskList component displays all tasks and orchestrates user interactions.
 *
 * Features:
 * - Renders a list of TaskItem components
 * - Displays empty state message when no tasks exist
 * - Proper ARIA labels for accessibility
 * - Responsive design
 */
const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggle,
  onDelete,
  onEdit,
}) => {
  return (
    <div className="task-list-container">
      {tasks.length === 0 ? (
        <p className="task-list-empty" data-testid="task-list-empty">
          No tasks yet. Add one above to get started!
        </p>
      ) : (
        <ul className="task-list" data-testid="task-list" role="list">
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
      )}
    </div>
  );
};

export default TaskList;
