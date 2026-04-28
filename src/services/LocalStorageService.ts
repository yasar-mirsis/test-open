import { Task } from '../types/Task';

/**
 * LocalStorageService handles persistence of tasks using browser localStorage.
 * This service provides static methods for loading and saving tasks with proper error handling.
 */
export class LocalStorageService {
  /**
   * The key used to store tasks in localStorage.
   */
  private static readonly STORAGE_KEY = 'tasks';

  /**
   * Retrieves tasks from localStorage.
   * @returns An array of Task objects, or an empty array if no tasks are found or an error occurs.
   */
  public static loadTasks(): Task[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);

      // Return empty array if no tasks are stored
      if (!stored) {
        return [];
      }

      // Parse and validate the stored JSON
      const tasks = JSON.parse(stored) as Task[];

      // Validate that the parsed result is an array
      if (!Array.isArray(tasks)) {
        console.warn('LocalStorageService: Stored data is not an array, returning empty array');
        return [];
      }

      return tasks;
    } catch (error) {
      // Handle JSON parse errors or other localStorage access errors
      if (error instanceof SyntaxError) {
        console.error('LocalStorageService: Failed to parse stored tasks as JSON', error);
      } else {
        console.error('LocalStorageService: Failed to load tasks from localStorage', error);
      }
      return [];
    }
  }

  /**
   * Persists an array of tasks to localStorage.
   * @param tasks - The array of Task objects to save.
   * @throws Error if saving fails due to quota exceeded or other localStorage errors.
   */
  public static saveTasks(tasks: Task[]): void {
    try {
      // Serialize tasks to JSON string
      const serialized = JSON.stringify(tasks);

      // Save to localStorage
      localStorage.setItem(this.STORAGE_KEY, serialized);
    } catch (error) {
      // Handle quota exceeded errors specifically
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        const errorMessage = 'LocalStorageService: localStorage quota exceeded. Unable to save tasks.';
        console.error(errorMessage, error);
        throw new Error(errorMessage);
      }

      // Handle other localStorage errors
      const errorMessage = 'LocalStorageService: Failed to save tasks to localStorage';
      console.error(errorMessage, error);
      throw new Error(errorMessage);
    }
  }
}
