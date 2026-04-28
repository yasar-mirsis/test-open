import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { LocalStorageService } from '../src/services/LocalStorageService'

describe('LocalStorageService', () => {
  const service = new LocalStorageService()
  const STORAGE_KEY = 'todo-app-tasks'

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('loadTasks', () => {
    it('should return an empty array when localStorage is empty', () => {
      const tasks = service.loadTasks()
      expect(tasks).toEqual([])
    })

    it('should return tasks from localStorage', () => {
      const mockTasks = [
        {
          id: '1',
          text: 'Test task 1',
          completed: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          text: 'Test task 2',
          completed: true,
          createdAt: new Date().toISOString(),
        },
      ]

      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTasks))
      const tasks = service.loadTasks()

      expect(tasks).toEqual(mockTasks)
    })

    it('should handle corrupted JSON data gracefully', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid json')
      const tasks = service.loadTasks()

      expect(tasks).toEqual([])
    })

    it('should return empty array when localStorage throws an error', () => {
      // Mock localStorage.getItem to throw an error
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem')
      getItemSpy.mockImplementation(() => {
        throw new Error('Storage access denied')
      })

      const tasks = service.loadTasks()
      expect(tasks).toEqual([])
    })

    it('should handle null value from localStorage', () => {
      localStorage.setItem(STORAGE_KEY, 'null')
      const tasks = service.loadTasks()

      expect(tasks).toEqual([])
    })

    it('should parse and return tasks with updatedAt field', () => {
      const mockTasks = [
        {
          id: '1',
          text: 'Test task',
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]

      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTasks))
      const tasks = service.loadTasks()

      expect(tasks).toEqual(mockTasks)
    })

    it('should return tasks with updatedAt field as optional', () => {
      const mockTasks = [
        {
          id: '1',
          text: 'Test task',
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ]

      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTasks))
      const tasks = service.loadTasks()

      expect(tasks).toEqual(mockTasks)
    })
  })

  describe('saveTasks', () => {
    it('should save tasks to localStorage', () => {
      const mockTasks = [
        {
          id: '1',
          text: 'Test task 1',
          completed: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          text: 'Test task 2',
          completed: true,
          createdAt: new Date().toISOString(),
        },
      ]

      service.saveTasks(mockTasks)

      const stored = localStorage.getItem(STORAGE_KEY)
      expect(stored).not.toBeNull()
      expect(JSON.parse(stored!)).toEqual(mockTasks)
    })

    it('should handle localStorage quota exceeded error', () => {
      const mockTasks = Array(1000).fill({
        id: '1',
        text: 'Test task',
        completed: false,
        createdAt: new Date().toISOString(),
      })

      // Mock localStorage.setItem to throw quota exceeded error
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
      setItemSpy.mockImplementation(() => {
        throw new DOMException('QuotaExceededError', 'QuotaExceededError')
      })

      expect(() => {
        service.saveTasks(mockTasks)
      }).not.toThrow()
    })

    it('should handle generic localStorage errors', () => {
      const mockTasks = [
        {
          id: '1',
          text: 'Test task',
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ]

      // Mock localStorage.setItem to throw a generic error
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
      setItemSpy.mockImplementation(() => {
        throw new Error('Unknown error')
      })

      expect(() => {
        service.saveTasks(mockTasks)
      }).not.toThrow()
    })

    it('should save empty array', () => {
      service.saveTasks([])
      const stored = localStorage.getItem(STORAGE_KEY)
      expect(stored).not.toBeNull()
      expect(JSON.parse(stored!)).toEqual([])
    })

    it('should save tasks with all required fields', () => {
      const now = new Date().toISOString()
      const mockTasks = [
        {
          id: '1',
          text: 'Test task 1',
          completed: false,
          createdAt: now,
        },
        {
          id: '2',
          text: 'Test task 2',
          completed: true,
          createdAt: now,
        },
      ]

      service.saveTasks(mockTasks)

      const stored = localStorage.getItem(STORAGE_KEY)
      const parsed = JSON.parse(stored!)
      expect(parsed).toHaveLength(2)
      expect(parsed[0]).toEqual(mockTasks[0])
      expect(parsed[1]).toEqual(mockTasks[1])
    })

    it('should handle special characters in task text', () => {
      const mockTasks = [
        {
          id: '1',
          text: 'Test with "quotes" and \'apostrophes\' and special chars: !@#$%^&*()',
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ]

      service.saveTasks(mockTasks)

      const stored = localStorage.getItem(STORAGE_KEY)
      const parsed = JSON.parse(stored!)
      expect(parsed).toEqual(mockTasks)
    })
  })

  describe('localStorage restrictions', () => {
    it('should handle localStorage disabled in private/incognito mode', () => {
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem')
      getItemSpy.mockImplementation(() => {
        throw new DOMException('SecurityError', 'SecurityError')
      })

      const tasks = service.loadTasks()
      expect(tasks).toEqual([])
    })

    it('should handle localStorage quota exceeded during load', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
      setItemSpy.mockImplementation(() => {
        throw new DOMException('QuotaExceededError', 'QuotaExceededError')
      })

      const mockTasks = Array(1000).fill({
        id: '1',
        text: 'Test task',
        completed: false,
        createdAt: new Date().toISOString(),
      })

      service.saveTasks(mockTasks)
      const tasks = service.loadTasks()
      expect(tasks).toEqual([])
    })
  })
})
