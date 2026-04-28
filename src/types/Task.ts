/**
 * Task interface representing a single todo item.
 * This interface defines the structure of task objects used throughout the application.
 */
export interface Task {
  /**
   * Unique identifier for the task (e.g., UUID or timestamp-based ID).
   */
  id: string;

  /**
   * The description or title of the task.
   */
  text: string;

  /**
   * Indicates whether the task has been completed.
   */
  completed: boolean;

  /**
   * ISO8601 timestamp when the task was created.
   */
  createdAt: string;

  /**
   * ISO8601 timestamp when the task was last modified.
   * Updated when the task is edited or its completion status changes.
   */
  updatedAt: string;
}
