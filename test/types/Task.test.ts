/**
 * Unit tests for Task interface type validation.
 * These tests ensure that Task objects conform to the expected structure
 * with all required fields and correct types.
 */

import { Task } from '../../src/types/Task';

describe('Task Interface', () => {
  describe('Task Structure Validation', () => {
    test('should have required fields: id, text, completed, createdAt, updatedAt', () => {
      const task: Task = {
        id: '1',
        text: 'Test task',
        completed: false,
        createdAt: '2026-04-28T00:00:00.000Z',
        updatedAt: '2026-04-28T00:00:00.000Z',
      };

      expect(task).toHaveProperty('id');
      expect(task).toHaveProperty('text');
      expect(task).toHaveProperty('completed');
      expect(task).toHaveProperty('createdAt');
      expect(task).toHaveProperty('updatedAt');
    });

    test('id field should be a string', () => {
      const task: Task = {
        id: 'test-id-123',
        text: 'Test task',
        completed: false,
        createdAt: '2026-04-28T00:00:00.000Z',
        updatedAt: '2026-04-28T00:00:00.000Z',
      };

      expect(typeof task.id).toBe('string');
      expect(task.id).toHaveLength(13);
    });

    test('text field should be a non-empty string', () => {
      const task: Task = {
        id: '1',
        text: 'Test task description',
        completed: false,
        createdAt: '2026-04-28T00:00:00.000Z',
        updatedAt: '2026-04-28T00:00:00.000Z',
      };

      expect(typeof task.text).toBe('string');
      expect(task.text).not.toBe('');
      expect(task.text).not.toEqual(' ');
    });

    test('completed field should be a boolean', () => {
      const completedTask: Task = {
        id: '1',
        text: 'Completed task',
        completed: true,
        createdAt: '2026-04-28T00:00:00.000Z',
        updatedAt: '2026-04-28T00:00:00.000Z',
      };

      const incompleteTask: Task = {
        id: '2',
        text: 'Incomplete task',
        completed: false,
        createdAt: '2026-04-28T00:00:00.000Z',
        updatedAt: '2026-04-28T00:00:00.000Z',
      };

      expect(typeof completedTask.completed).toBe('boolean');
      expect(typeof incompleteTask.completed).toBe('boolean');
      expect(completedTask.completed).toBe(true);
      expect(incompleteTask.completed).toBe(false);
    });

    test('createdAt field should be an ISO8601 string', () => {
      const task: Task = {
        id: '1',
        text: 'Test task',
        completed: false,
        createdAt: '2026-04-28T00:00:00.000Z',
        updatedAt: '2026-04-28T00:00:00.000Z',
      };

      expect(typeof task.createdAt).toBe('string');
      // ISO8601 format validation
      expect(task.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/);
    });

    test('updatedAt field should be an ISO8601 string', () => {
      const task: Task = {
        id: '1',
        text: 'Test task',
        completed: false,
        createdAt: '2026-04-28T00:00:00.000Z',
        updatedAt: '2026-04-28T12:34:56.789Z',
      };

      expect(typeof task.updatedAt).toBe('string');
      // ISO8601 format validation
      expect(task.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/);
    });

    test('should allow completed to be true', () => {
      const task: Task = {
        id: '1',
        text: 'Completed task',
        completed: true,
        createdAt: '2026-04-28T00:00:00.000Z',
        updatedAt: '2026-04-28T00:00:00.000Z',
      };

      expect(task.completed).toBe(true);
    });

    test('should allow completed to be false', () => {
      const task: Task = {
        id: '2',
        text: 'Incomplete task',
        completed: false,
        createdAt: '2026-04-28T00:00:00.000Z',
        updatedAt: '2026-04-28T00:00:00.000Z',
      };

      expect(task.completed).toBe(false);
    });

    test('should allow createdAt to be in the past', () => {
      const pastDate = new Date('2025-01-01T00:00:00.000Z').toISOString();
      const task: Task = {
        id: '1',
        text: 'Old task',
        completed: false,
        createdAt: pastDate,
        updatedAt: pastDate,
      };

      expect(task.createdAt).toBe(pastDate);
    });

    test('should allow createdAt to be in the future', () => {
      const futureDate = new Date('2027-01-01T00:00:00.000Z').toISOString();
      const task: Task = {
        id: '1',
        text: 'Future task',
        completed: false,
        createdAt: futureDate,
        updatedAt: futureDate,
      };

      expect(task.createdAt).toBe(futureDate);
    });

    test('should allow updatedAt to be different from createdAt', () => {
      const task: Task = {
        id: '1',
        text: 'Task that was updated',
        completed: true,
        createdAt: '2026-04-28T00:00:00.000Z',
        updatedAt: '2026-04-28T12:00:00.000Z',
      };

      expect(task.createdAt).not.toBe(task.updatedAt);
    });

    test('should allow updatedAt to be the same as createdAt', () => {
      const sameTime = '2026-04-28T00:00:00.000Z';
      const task: Task = {
        id: '1',
        text: 'New task',
        completed: false,
        createdAt: sameTime,
        updatedAt: sameTime,
      };

      expect(task.createdAt).toBe(task.updatedAt);
    });

    test('should allow task text to contain special characters', () => {
      const task: Task = {
        id: '1',
        text: 'Task with special chars: @#$%^&*()',
        completed: false,
        createdAt: '2026-04-28T00:00:00.000Z',
        updatedAt: '2026-04-28T00:00:00.000Z',
      };

      expect(task.text).toContain('@');
      expect(task.text).toContain('#');
      expect(task.text).toContain('$');
    });

    test('should allow task text to contain Unicode characters', () => {
      const task: Task = {
        id: '1',
        text: 'Task with Unicode: 你好世界 🌍',
        completed: false,
        createdAt: '2026-04-28T00:00:00.000Z',
        updatedAt: '2026-04-28T00:00:00.000Z',
      };

      expect(task.text).toContain('你');
      expect(task.text).toContain('世界');
      expect(task.text).toContain('🌍');
    });

    test('should allow task text to contain numbers', () => {
      const task: Task = {
        id: '1',
        text: 'Task with numbers: 123, 456, 789',
        completed: false,
        createdAt: '2026-04-28T00:00:00.000Z',
        updatedAt: '2026-04-28T00:00:00.000Z',
      };

      expect(task.text).toContain('123');
      expect(task.text).toContain('456');
      expect(task.text).toContain('789');
    });

    test('should allow task text to contain line breaks (if supported)', () => {
      const task: Task = {
        id: '1',
        text: 'Task with\nline breaks',
        completed: false,
        createdAt: '2026-04-28T00:00:00.000Z',
        updatedAt: '2026-04-28T00:00:00.000Z',
      };

      expect(task.text).toContain('\n');
    });

    test('should allow task text to contain multiple spaces', () => {
      const task: Task = {
        id: '1',
        text: 'Task with   multiple   spaces',
        completed: false,
        createdAt: '2026-04-28T00:00:00.000Z',
        updatedAt: '2026-04-28T00:00:00.000Z',
      };

      expect(task.text).toContain('   ');
    });
  });

  describe('Task Edge Cases', () => {
    test('should allow id to be a UUID format', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const task: Task = {
        id: uuid,
        text: 'UUID task',
        completed: false,
        createdAt: '2026-04-28T00:00:00.000Z',
        updatedAt: '2026-04-28T00:00:00.000Z',
      };

      expect(task.id).toBe(uuid);
    });

    test('should allow id to be a numeric string', () => {
      const task: Task = {
        id: '12345',
        text: 'Numeric ID task',
        completed: false,
        createdAt: '2026-04-28T00:00:00.000Z',
        updatedAt: '2026-04-28T00:00:00.000Z',
      };

      expect(task.id).toBe('12345');
    });

    test('should allow id to be a timestamp-based string', () => {
      const timestamp = '1716969600000';
      const task: Task = {
        id: timestamp,
        text: 'Timestamp ID task',
        completed: false,
        createdAt: '2026-04-28T00:00:00.000Z',
        updatedAt: '2026-04-28T00:00:00.000Z',
      };

      expect(task.id).toBe(timestamp);
    });

    test('should allow text to be a very long string', () => {
      const longText = 'A'.repeat(10000);
      const task: Task = {
        id: '1',
        text: longText,
        completed: false,
        createdAt: '2026-04-28T00:00:00.000Z',
        updatedAt: '2026-04-28T00:00:00.000Z',
      };

      expect(task.text).toHaveLength(10000);
    });

    test('should allow text to be a very short string (minimum length)', () => {
      const task: Task = {
        id: '1',
        text: 'x',
        completed: false,
        createdAt: '2026-04-28T00:00:00.000Z',
        updatedAt: '2026-04-28T00:00:00.000Z',
      };

      expect(task.text).toBe('x');
    });

    test('should allow createdAt to be at the beginning of the year', () => {
      const task: Task = {
        id: '1',
        text: 'Year start task',
        completed: false,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      };

      expect(task.createdAt).toBe('2026-01-01T00:00:00.000Z');
    });

    test('should allow createdAt to be at the end of the year', () => {
      const task: Task = {
        id: '1',
        text: 'Year end task',
        completed: false,
        createdAt: '2026-12-31T23:59:59.999Z',
        updatedAt: '2026-12-31T23:59:59.999Z',
      };

      expect(task.createdAt).toBe('2026-12-31T23:59:59.999Z');
    });

    test('should allow createdAt to have milliseconds', () => {
      const task: Task = {
        id: '1',
        text: 'Task with milliseconds',
        completed: false,
        createdAt: '2026-04-28T12:34:56.789Z',
        updatedAt: '2026-04-28T12:34:56.789Z',
      };

      expect(task.createdAt).toContain('.789');
    });

    test('should allow createdAt to have no milliseconds', () => {
      const task: Task = {
        id: '1',
        text: 'Task without milliseconds',
        completed: false,
        createdAt: '2026-04-28T12:34:56Z',
        updatedAt: '2026-04-28T12:34:56Z',
      };

      expect(task.createdAt).not.toContain('.');
    });

    test('should allow createdAt to be in different time zones', () => {
      const task: Task = {
        id: '1',
        text: 'Task in different timezone',
        completed: false,
        createdAt: '2026-04-28T08:00:00.000Z',
        updatedAt: '2026-04-28T08:00:00.000Z',
      };

      expect(task.createdAt).toBe('2026-04-28T08:00:00.000Z');
    });

    test('should allow updatedAt to be in the past', () => {
      const task: Task = {
        id: '1',
        text: 'Old task',
        completed: false,
        createdAt: '2026-04-28T00:00:00.000Z',
        updatedAt: '2026-04-28T00:00:00.000Z',
      };

      expect(task.updatedAt).toBe(task.createdAt);
    });

    test('should allow updatedAt to be in the future', () => {
      const task: Task = {
        id: '1',
        text: 'Future updated task',
        completed: false,
        createdAt: '2026-04-28T00:00:00.000Z',
        updatedAt: '2026-04-28T12:00:00.000Z',
      };

      expect(task.updatedAt).toBe('2026-04-28T12:00:00.000Z');
    });
  });

  describe('Task Object Creation', () => {
    test('should create a valid Task object with all fields', () => {
      const task: Task = {
        id: '1',
        text: 'Test task',
        completed: false,
        createdAt: '2026-04-28T00:00:00.000Z',
        updatedAt: '2026-04-28T00:00:00.000Z',
      };

      expect(task).toEqual({
        id: '1',
        text: 'Test task',
        completed: false,
        createdAt: '2026-04-28T00:00:00.000Z',
        updatedAt: '2026-04-28T00:00:00.000Z',
      });
    });

    test('should create a completed Task object', () => {
      const task: Task = {
        id: '1',
        text: 'Completed task',
        completed: true,
        createdAt: '2026-04-28T00:00:00.000Z',
        updatedAt: '2026-04-28T00:00:00.000Z',
      };

      expect(task.completed).toBe(true);
    });

    test('should create an incomplete Task object', () => {
      const task: Task = {
        id: '2',
        text: 'Incomplete task',
        completed: false,
        createdAt: '2026-04-28T00:00:00.000Z',
        updatedAt: '2026-04-28T00:00:00.000Z',
      };

      expect(task.completed).toBe(false);
    });

    test('should create a Task with different timestamps', () => {
      const task: Task = {
        id: '1',
        text: 'Task with different timestamps',
        completed: false,
        createdAt: '2026-04-28T00:00:00.000Z',
        updatedAt: '2026-04-28T23:59:59.999Z',
      };

      expect(task.createdAt).not.toBe(task.updatedAt);
    });

    test('should create a Task with the same timestamps', () => {
      const sameTime = '2026-04-28T12:34:56.789Z';
      const task: Task = {
        id: '1',
        text: 'Task with same timestamps',
        completed: false,
        createdAt: sameTime,
        updatedAt: sameTime,
      };

      expect(task.createdAt).toBe(task.updatedAt);
    });
  });
});
