import type { Task } from '../types/Task'

const STORAGE_KEY = 'todo-app-tasks'

export class LocalStorageService {
  loadTasks(): Task[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const tasks = JSON.parse(stored) as Task[]
        return tasks
      }
      return []
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error)
      return []
    }
  }

  saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error)
    }
  }
}
