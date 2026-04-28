/**
 * Unit tests for LocalStorageService.
 * Tests cover loadTasks() and saveTasks() methods with various scenarios:
 * - Happy path (successful load/save)
 * - Empty storage
 * - Invalid JSON
 * - Non-array data
 * - localStorage access errors
 * - Quota exceeded errors
 */

import { LocalStorageService } from '../../src/services/LocalStorageService';

// Mock localStorage before importing the module
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

global.localStorage = mockLocalStorage as any;

describe('LocalStorageService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Clear localStorage
    mockLocalStorage.getItem.mockReturnValue(null);
    mockLocalStorage.setItem.mockReturnValue(undefined);
  });

  describe('loadTasks()', () => {
    describe('Happy Path', () => {
      test('should return empty array when localStorage has no tasks', () => {
        mockLocalStorage.getItem.mockReturnValue(null);

        const result = LocalStorageService.loadTasks();

        expect(result).toEqual([]);
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith('tasks');
      });

      test('should return empty array when localStorage key is empty string', () => {
        mockLocalStorage.getItem.mockReturnValue('');

        const result = LocalStorageService.loadTasks();

        expect(result).toEqual([]);
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith('tasks');
      });

      test('should return an array of Task objects when localStorage contains valid tasks', () => {
        const mockTasks = [
          {
            id: '1',
            text: 'Task 1',
            completed: false,
            createdAt: '2026-04-28T00:00:00.000Z',
            updatedAt: '2026-04-28T00:00:00.000Z',
          },
          {
            id: '2',
            text: 'Task 2',
            completed: true,
            createdAt: '2026-04-28T00:00:00.000Z',
            updatedAt: '2026-04-28T00:00:00.000Z',
          },
        ];

        mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));

        const result = LocalStorageService.loadTasks();

        expect(result).toEqual(mockTasks);
        expect(result).toHaveLength(2);
        expect(result[0].text).toBe('Task 1');
        expect(result[1].completed).toBe(true);
      });

      test('should return a single Task object when localStorage contains one task', () => {
        const mockTask = {
          id: '1',
          text: 'Single task',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        };

        mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockTask));

        const result = LocalStorageService.loadTasks();

        expect(result).toEqual([mockTask]);
        expect(result).toHaveLength(1);
        expect(result[0].text).toBe('Single task');
      });

      test('should handle tasks with empty text', () => {
        const mockTasks = [
          {
            id: '1',
            text: '',
            completed: false,
            createdAt: '2026-04-28T00:00:00.000Z',
            updatedAt: '2026-04-28T00:00:00.000Z',
          },
        ];

        mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));

        const result = LocalStorageService.loadTasks();

        expect(result).toEqual(mockTasks);
        expect(result[0].text).toBe('');
      });

      test('should handle tasks with only whitespace text', () => {
        const mockTasks = [
          {
            id: '1',
            text: '   ',
            completed: false,
            createdAt: '2026-04-28T00:00:00.000Z',
            updatedAt: '2026-04-28T00:00:00.000Z',
          },
        ];

        mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));

        const result = LocalStorageService.loadTasks();

        expect(result).toEqual(mockTasks);
        expect(result[0].text).toBe('   ');
      });

      test('should handle tasks with completed: true', () => {
        const mockTasks = [
          {
            id: '1',
            text: 'Completed task',
            completed: true,
            createdAt: '2026-04-28T00:00:00.000Z',
            updatedAt: '2026-04-28T00:00:00.000Z',
          },
        ];

        mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));

        const result = LocalStorageService.loadTasks();

        expect(result[0].completed).toBe(true);
      });

      test('should handle tasks with completed: false', () => {
        const mockTasks = [
          {
            id: '1',
            text: 'Incomplete task',
            completed: false,
            createdAt: '2026-04-28T00:00:00.000Z',
            updatedAt: '2026-04-28T00:00:00.000Z',
          },
        ];

        mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));

        const result = LocalStorageService.loadTasks();

        expect(result[0].completed).toBe(false);
      });
    });

    describe('Empty Storage', () => {
      test('should return empty array when localStorage.getItem returns null', () => {
        mockLocalStorage.getItem.mockReturnValue(null);

        const result = LocalStorageService.loadTasks();

        expect(result).toEqual([]);
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith('tasks');
      });

      test('should return empty array when localStorage.getItem returns undefined', () => {
        mockLocalStorage.getItem.mockReturnValue(undefined);

        const result = LocalStorageService.loadTasks();

        expect(result).toEqual([]);
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith('tasks');
      });

      test('should return empty array when localStorage.getItem returns empty string', () => {
        mockLocalStorage.getItem.mockReturnValue('');

        const result = LocalStorageService.loadTasks();

        expect(result).toEqual([]);
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith('tasks');
      });

      test('should return empty array when localStorage.getItem returns "null" string', () => {
        mockLocalStorage.getItem.mockReturnValue('null');

        const result = LocalStorageService.loadTasks();

        expect(result).toEqual([]);
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith('tasks');
      });
    });

    describe('Invalid JSON', () => {
      test('should return empty array when localStorage contains invalid JSON', () => {
        mockLocalStorage.getItem.mockReturnValue('invalid json {{{');

        const result = LocalStorageService.loadTasks();

        expect(result).toEqual([]);
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith('tasks');
      });

      test('should return empty array when localStorage contains malformed JSON', () => {
        mockLocalStorage.getItem.mockReturnValue('{"key": "value"');

        const result = LocalStorageService.loadTasks();

        expect(result).toEqual([]);
      });

      test('should return empty array when localStorage contains unclosed string', () => {
        mockLocalStorage.getItem.mockReturnValue('"unclosed string');

        const result = LocalStorageService.loadTasks();

        expect(result).toEqual([]);
      });

      test('should return empty array when localStorage contains unclosed object', () => {
        mockLocalStorage.getItem.mockReturnValue('{"unclosed":');

        const result = LocalStorageService.loadTasks();

        expect(result).toEqual([]);
      });

      test('should return empty array when localStorage contains only whitespace', () => {
        mockLocalStorage.getItem.mockReturnValue('   \t\n   ');

        const result = LocalStorageService.loadTasks();

        expect(result).toEqual([]);
      });

      test('should return empty array when localStorage contains only special characters', () => {
        mockLocalStorage.getItem.mockReturnValue('!@#$%^&*()');

        const result = LocalStorageService.loadTasks();

        expect(result).toEqual([]);
      });

      test('should return empty array when localStorage contains HTML tags', () => {
        mockLocalStorage.getItem.mockReturnValue('<div>test</div>');

        const result = LocalStorageService.loadTasks();

        expect(result).toEqual([]);
      });
    });

    describe('Non-Array Data', () => {
      test('should return empty array when localStorage contains a number', () => {
        mockLocalStorage.getItem.mockReturnValue('42');

        const result = LocalStorageService.loadTasks();

        expect(result).toEqual([]);
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith('tasks');
      });

      test('should return empty array when localStorage contains a boolean', () => {
        mockLocalStorage.getItem.mockReturnValue('true');

        const result = LocalStorageService.loadTasks();

        expect(result).toEqual([]);
      });

      test('should return empty array when localStorage contains an object', () => {
        const mockObject = { id: '1', text: 'test' };
        mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockObject));

        const result = LocalStorageService.loadTasks();

        expect(result).toEqual([]);
      });

      test('should return empty array when localStorage contains null (as string)', () => {
        mockLocalStorage.getItem.mockReturnValue('null');

        const result = LocalStorageService.loadTasks();

        expect(result).toEqual([]);
      });

      test('should return empty array when localStorage contains undefined (as string)', () => {
        mockLocalStorage.getItem.mockReturnValue('undefined');

        const result = LocalStorageService.loadTasks();

        expect(result).toEqual([]);
      });

      test('should return empty array when localStorage contains an empty object', () => {
        mockLocalStorage.getItem.mockReturnValue('{}');

        const result = LocalStorageService.loadTasks();

        expect(result).toEqual([]);
      });

      test('should return empty array when localStorage contains an array with one non-Task object', () => {
        mockLocalStorage.getItem.mockReturnValue('[{"notATask": true}]');

        const result = LocalStorageService.loadTasks();

        expect(result).toEqual([]);
      });

      test('should return empty array when localStorage contains a nested object instead of array', () => {
        mockLocalStorage.getItem.mockReturnValue('{"tasks": []}');

        const result = LocalStorageService.loadTasks();

        expect(result).toEqual([]);
      });
    });

    describe('localStorage Access Errors', () => {
      test('should return empty array when localStorage.getItem throws an error', () => {
        mockLocalStorage.getItem.mockImplementation(() => {
          throw new Error('localStorage is disabled');
        });

        const result = LocalStorageService.loadTasks();

        expect(result).toEqual([]);
      });

      test('should return empty array when localStorage.getItem throws a TypeError', () => {
        mockLocalStorage.getItem.mockImplementation(() => {
          throw new TypeError('Cannot read property of undefined');
        });

        const result = LocalStorageService.loadTasks();

        expect(result).toEqual([]);
      });

      test('should handle SyntaxError from JSON.parse gracefully', () => {
        mockLocalStorage.getItem.mockReturnValue('{"invalid": }');

        const result = LocalStorageService.loadTasks();

        expect(result).toEqual([]);
      });

      test('should handle generic errors from JSON.parse gracefully', () => {
        mockLocalStorage.getItem.mockReturnValue('some invalid json {{{');

        const result = LocalStorageService.loadTasks();

        expect(result).toEqual([]);
      });

      test('should return empty array when localStorage is not available', () => {
        // Simulate localStorage being disabled
        const originalLocalStorage = global.localStorage;
        delete (global as any).localStorage;
        mockLocalStorage.getItem = jest.fn(() => {
          throw new Error('localStorage is not defined');
        });

        const result = LocalStorageService.loadTasks();

        // Restore localStorage
        (global as any).localStorage = originalLocalStorage;

        expect(result).toEqual([]);
      });
    });

    describe('Edge Cases', () => {
      test('should handle very large arrays', () => {
        const largeArray = Array.from({ length: 10000 }, (_, i) => ({
          id: `${i}`,
          text: `Task ${i}`,
          completed: i % 2 === 0,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        }));

        mockLocalStorage.getItem.mockReturnValue(JSON.stringify(largeArray));

        const result = LocalStorageService.loadTasks();

        expect(result).toHaveLength(10000);
        expect(result[0].text).toBe('Task 0');
        expect(result[9999].text).toBe('Task 9999');
      });

      test('should handle array with mixed completed statuses', () => {
        const mixedArray = [
          { id: '1', text: 'Task 1', completed: true, createdAt: '2026-04-28T00:00:00.000Z', updatedAt: '2026-04-28T00:00:00.000Z' },
          { id: '2', text: 'Task 2', completed: false, createdAt: '2026-04-28T00:00:00.000Z', updatedAt: '2026-04-28T00:00:00.000Z' },
          { id: '3', text: 'Task 3', completed: true, createdAt: '2026-04-28T00:00:00.000Z', updatedAt: '2026-04-28T00:00:00.000Z' },
        ];

        mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mixedArray));

        const result = LocalStorageService.loadTasks();

        expect(result).toHaveLength(3);
        expect(result[0].completed).toBe(true);
        expect(result[1].completed).toBe(false);
        expect(result[2].completed).toBe(true);
      });

      test('should handle array with very long task text', () => {
        const longTextTask = {
          id: '1',
          text: 'A'.repeat(10000),
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        };

        mockLocalStorage.getItem.mockReturnValue(JSON.stringify(longTextTask));

        const result = LocalStorageService.loadTasks();

        expect(result[0].text).toHaveLength(10000);
      });

      test('should handle array with Unicode characters in task text', () => {
        const unicodeTask = {
          id: '1',
          text: '你好世界 🌍',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        };

        mockLocalStorage.getItem.mockReturnValue(JSON.stringify(unicodeTask));

        const result = LocalStorageService.loadTasks();

        expect(result[0].text).toContain('你好');
        expect(result[0].text).toContain('世界');
        expect(result[0].text).toContain('🌍');
      });

      test('should handle array with different ISO8601 timestamp formats', () => {
        const tasksWithDifferentFormats = [
          {
            id: '1',
            text: 'Task 1',
            completed: false,
            createdAt: '2026-04-28T00:00:00.000Z',
            updatedAt: '2026-04-28T00:00:00.000Z',
          },
          {
            id: '2',
            text: 'Task 2',
            completed: false,
            createdAt: '2026-04-28T00:00:00Z',
            updatedAt: '2026-04-28T00:00:00Z',
          },
          {
            id: '3',
            text: 'Task 3',
            completed: false,
            createdAt: '2026-04-28T12:34:56.789Z',
            updatedAt: '2026-04-28T12:34:56.789Z',
          },
        ];

        mockLocalStorage.getItem.mockReturnValue(JSON.stringify(tasksWithDifferentFormats));

        const result = LocalStorageService.loadTasks();

        expect(result).toHaveLength(3);
        expect(result[0].createdAt).toContain('.000');
        expect(result[1].createdAt).not.toContain('.');
        expect(result[2].createdAt).toContain('.789');
      });
    });
  });

  describe('saveTasks()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockLocalStorage.setItem.mockReturnValue(undefined);
    });

    describe('Happy Path', () => {
      test('should save an array of tasks to localStorage successfully', () => {
        const tasks = [
          {
            id: '1',
            text: 'Task 1',
            completed: false,
            createdAt: '2026-04-28T00:00:00.000Z',
            updatedAt: '2026-04-28T00:00:00.000Z',
          },
          {
            id: '2',
            text: 'Task 2',
            completed: true,
            createdAt: '2026-04-28T00:00:00.000Z',
            updatedAt: '2026-04-28T00:00:00.000Z',
          },
        ];

        LocalStorageService.saveTasks(tasks);

        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('tasks', JSON.stringify(tasks));
      });

      test('should save a single task to localStorage successfully', () => {
        const task = {
          id: '1',
          text: 'Single task',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        };

        LocalStorageService.saveTasks(task);

        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('tasks', JSON.stringify(task));
      });

      test('should save an empty array to localStorage', () => {
        LocalStorageService.saveTasks([]);

        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('tasks', '[]');
      });

      test('should save tasks with empty text', () => {
        const tasks = [
          {
            id: '1',
            text: '',
            completed: false,
            createdAt: '2026-04-28T00:00:00.000Z',
            updatedAt: '2026-04-28T00:00:00.000Z',
          },
        ];

        LocalStorageService.saveTasks(tasks);

        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('tasks', JSON.stringify(tasks));
      });

      test('should save tasks with only whitespace text', () => {
        const tasks = [
          {
            id: '1',
            text: '   ',
            completed: false,
            createdAt: '2026-04-28T00:00:00.000Z',
            updatedAt: '2026-04-28T00:00:00.000Z',
          },
        ];

        LocalStorageService.saveTasks(tasks);

        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('tasks', JSON.stringify(tasks));
      });

      test('should save tasks with completed: true', () => {
        const tasks = [
          {
            id: '1',
            text: 'Completed task',
            completed: true,
            createdAt: '2026-04-28T00:00:00.000Z',
            updatedAt: '2026-04-28T00:00:00.000Z',
          },
        ];

        LocalStorageService.saveTasks(tasks);

        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('tasks', JSON.stringify(tasks));
        expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(1);
      });

      test('should save tasks with completed: false', () => {
        const tasks = [
          {
            id: '1',
            text: 'Incomplete task',
            completed: false,
            createdAt: '2026-04-28T00:00:00.000Z',
            updatedAt: '2026-04-28T00:00:00.000Z',
          },
        ];

        LocalStorageService.saveTasks(tasks);

        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('tasks', JSON.stringify(tasks));
      });
    });

    describe('Quota Exceeded Errors', () => {
      test('should throw Error when localStorage quota is exceeded', () => {
        const largeTask = {
          id: '1',
          text: 'A'.repeat(1000000), // Very large text
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        };

        mockLocalStorage.setItem.mockImplementation(() => {
          throw new DOMException('QuotaExceededError', 'QuotaExceededError');
        });

        expect(() => {
          LocalStorageService.saveTasks([largeTask]);
        }).toThrow('localStorage quota exceeded');

        expect(mockLocalStorage.setItem).toHaveBeenCalled();
      });

      test('should throw Error with specific message when quota exceeded', () => {
        mockLocalStorage.setItem.mockImplementation(() => {
          throw new DOMException('QuotaExceededError', 'QuotaExceededError');
        });

        expect(() => {
          LocalStorageService.saveTasks([{ id: '1', text: 'test', completed: false, createdAt: '2026-04-28T00:00:00.000Z', updatedAt: '2026-04-28T00:00:00.000Z' }]);
        }).toThrow('LocalStorageService: localStorage quota exceeded. Unable to save tasks.');
      });

      test('should handle quota exceeded for empty array', () => {
        mockLocalStorage.setItem.mockImplementation(() => {
          throw new DOMException('QuotaExceededError', 'QuotaExceededError');
        });

        expect(() => {
          LocalStorageService.saveTasks([]);
        }).toThrow('localStorage quota exceeded');
      });

      test('should handle quota exceeded for single task', () => {
        const largeTask = {
          id: '1',
          text: 'A'.repeat(1000000),
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        };

        mockLocalStorage.setItem.mockImplementation(() => {
          throw new DOMException('QuotaExceededError', 'QuotaExceededError');
        });

        expect(() => {
          LocalStorageService.saveTasks(largeTask);
        }).toThrow('localStorage quota exceeded');
      });

      test('should handle quota exceeded for large array', () => {
        const largeArray = Array.from({ length: 1000 }, (_, i) => ({
          id: `${i}`,
          text: 'A'.repeat(1000),
          completed: i % 2 === 0,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        }));

        mockLocalStorage.setItem.mockImplementation(() => {
          throw new DOMException('QuotaExceededError', 'QuotaExceededError');
        });

        expect(() => {
          LocalStorageService.saveTasks(largeArray);
        }).toThrow('localStorage quota exceeded');
      });
    });

    describe('Other localStorage Errors', () => {
      test('should throw Error when localStorage.setItem throws a generic error', () => {
        mockLocalStorage.setItem.mockImplementation(() => {
          throw new Error('Generic localStorage error');
        });

        expect(() => {
          LocalStorageService.saveTasks([{ id: '1', text: 'test', completed: false, createdAt: '2026-04-28T00:00:00.000Z', updatedAt: '2026-04-28T00:00:00.000Z' }]);
        }).toThrow('LocalStorageService: Failed to save tasks to localStorage');
      });

      test('should throw Error when localStorage.setItem throws a TypeError', () => {
        mockLocalStorage.setItem.mockImplementation(() => {
          throw new TypeError('Cannot set property x of undefined');
        });

        expect(() => {
          LocalStorageService.saveTasks([{ id: '1', text: 'test', completed: false, createdAt: '2026-04-28T00:00:00.000Z', updatedAt: '2026-04-28T00:00:00.000Z' }]);
        }).toThrow('LocalStorageService: Failed to save tasks to localStorage');
      });

      test('should throw Error when localStorage.setItem throws a DOMException with different name', () => {
        mockLocalStorage.setItem.mockImplementation(() => {
          throw new DOMException('SecurityError', 'SecurityError');
        });

        expect(() => {
          LocalStorageService.saveTasks([{ id: '1', text: 'test', completed: false, createdAt: '2026-04-28T00:00:00.000Z', updatedAt: '2026-04-28T00:00:00.000Z' }]);
        }).toThrow('LocalStorageService: Failed to save tasks to localStorage');
      });

      test('should throw Error when localStorage.setItem throws a generic SyntaxError', () => {
        mockLocalStorage.setItem.mockImplementation(() => {
          throw new SyntaxError('Invalid JSON');
        });

        expect(() => {
          LocalStorageService.saveTasks([{ id: '1', text: 'test', completed: false, createdAt: '2026-04-28T00:00:00.000Z', updatedAt: '2026-04-28T00:00:00.000Z' }]);
        }).toThrow('LocalStorageService: Failed to save tasks to localStorage');
      });

      test('should throw Error when localStorage is not available', () => {
        const originalLocalStorage = global.localStorage;
        delete (global as any).localStorage;
        mockLocalStorage.setItem = jest.fn(() => {
          throw new Error('localStorage is not defined');
        });

        expect(() => {
          LocalStorageService.saveTasks([{ id: '1', text: 'test', completed: false, createdAt: '2026-04-28T00:00:00.000Z', updatedAt: '2026-04-28T00:00:00.000Z' }]);
        }).toThrow('LocalStorageService: Failed to save tasks to localStorage');

        // Restore localStorage
        (global as any).localStorage = originalLocalStorage;
      });

      test('should throw Error with descriptive message for generic errors', () => {
        mockLocalStorage.setItem.mockImplementation(() => {
          throw new Error('Something went wrong');
        });

        expect(() => {
          LocalStorageService.saveTasks([{ id: '1', text: 'test', completed: false, createdAt: '2026-04-28T00:00:00.000Z', updatedAt: '2026-04-28T00:00:00.000Z' }]);
        }).toThrow('LocalStorageService: Failed to save tasks to localStorage');
      });
    });

    describe('Edge Cases', () => {
      test('should save array with very long text strings', () => {
        const tasks = [
          {
            id: '1',
            text: 'A'.repeat(10000),
            completed: false,
            createdAt: '2026-04-28T00:00:00.000Z',
            updatedAt: '2026-04-28T00:00:00.000Z',
          },
        ];

        LocalStorageService.saveTasks(tasks);

        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('tasks', expect.stringContaining('A'.repeat(10000)));
      });

      test('should save array with Unicode characters', () => {
        const tasks = [
          {
            id: '1',
            text: '你好世界 🌍',
            completed: false,
            createdAt: '2026-04-28T00:00:00.000Z',
            updatedAt: '2026-04-28T00:00:00.000Z',
          },
        ];

        LocalStorageService.saveTasks(tasks);

        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('tasks', JSON.stringify(tasks));
      });

      test('should save array with different ISO8601 timestamp formats', () => {
        const tasks = [
          {
            id: '1',
            text: 'Task 1',
            completed: false,
            createdAt: '2026-04-28T00:00:00.000Z',
            updatedAt: '2026-04-28T00:00:00.000Z',
          },
          {
            id: '2',
            text: 'Task 2',
            completed: false,
            createdAt: '2026-04-28T00:00:00Z',
            updatedAt: '2026-04-28T00:00:00Z',
          },
        ];

        LocalStorageService.saveTasks(tasks);

        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('tasks', JSON.stringify(tasks));
      });

      test('should save array with mixed completed statuses', () => {
        const tasks = [
          {
            id: '1',
            text: 'Task 1',
            completed: true,
            createdAt: '2026-04-28T00:00:00.000Z',
            updatedAt: '2026-04-28T00:00:00.000Z',
          },
          {
            id: '2',
            text: 'Task 2',
            completed: false,
            createdAt: '2026-04-28T00:00:00.000Z',
            updatedAt: '2026-04-28T00:00:00.000Z',
          },
          {
            id: '3',
            text: 'Task 3',
            completed: true,
            createdAt: '2026-04-28T00:00:00.000Z',
            updatedAt: '2026-04-28T00:00:00.000Z',
          },
        ];

        LocalStorageService.saveTasks(tasks);

        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('tasks', JSON.stringify(tasks));
      });

      test('should save array with zero tasks (empty array)', () => {
        LocalStorageService.saveTasks([]);

        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('tasks', '[]');
      });

      test('should save array with one task', () => {
        const task = {
          id: '1',
          text: 'Single task',
          completed: false,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        };

        LocalStorageService.saveTasks(task);

        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('tasks', JSON.stringify(task));
      });

      test('should save array with many tasks', () => {
        const tasks = Array.from({ length: 100 }, (_, i) => ({
          id: `${i}`,
          text: `Task ${i}`,
          completed: i % 2 === 0,
          createdAt: '2026-04-28T00:00:00.000Z',
          updatedAt: '2026-04-28T00:00:00.000Z',
        }));

        LocalStorageService.saveTasks(tasks);

        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('tasks', JSON.stringify(tasks));
      });

      test('should save array with tasks having different timestamps', () => {
        const tasks = [
          {
            id: '1',
            text: 'Task 1',
            completed: false,
            createdAt: '2026-04-28T00:00:00.000Z',
            updatedAt: '2026-04-28T00:00:00.000Z',
          },
          {
            id: '2',
            text: 'Task 2',
            completed: false,
            createdAt: '2026-04-28T12:00:00.000Z',
            updatedAt: '2026-04-28T12:00:00.000Z',
          },
          {
            id: '3',
            text: 'Task 3',
            completed: false,
            createdAt: '2026-04-28T23:59:59.999Z',
            updatedAt: '2026-04-28T23:59:59.999Z',
          },
        ];

        LocalStorageService.saveTasks(tasks);

        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('tasks', JSON.stringify(tasks));
      });
    });
  });
});
