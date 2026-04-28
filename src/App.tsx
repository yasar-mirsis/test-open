import React, { useState, useEffect } from 'react';
import { Task } from './types/Task';
import { LocalStorageService } from './services/LocalStorageService';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';

/**
 * App is the root component that composes all UI elements and manages global state.
 * It coordinates data flow between UI components and LocalStorageService.
 */
function App() {
  /**
   * State for the list of tasks.
   * Initialized from localStorage on component mount.
   */
  const [tasks, setTasks] = useState<Task[]>([]);

  /**
   * Load tasks from localStorage when the component mounts.
   */
  useEffect(() => {
    const loadedTasks = LocalStorageService.loadTasks();
    setTasks(loadedTasks);
  }, []);

  /**
   * Save tasks to localStorage whenever the tasks state changes.
   */
  useEffect(() => {
    if (tasks.length > 0 || localStorage.getItem('tasks')) {
      LocalStorageService.saveTasks(tasks);
    }
  }, [tasks]);

  /**
   * Handle adding a new task.
   * @param task - The task to add to the list.
   */
  const handleAddTask = (task: Task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  /**
   * Handle toggling a task's completion status.
   * @param id - The ID of the task to toggle.
   */
  const handleToggleTask = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
  };

  /**
   * Handle deleting a task.
   * @param id - The ID of the task to delete.
   */
  const handleDeleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  /**
   * Handle editing a task's text.
   * @param id - The ID of the task to edit.
   * @param text - The new text for the task.
   */
  const handleEditTask = (id: string, text: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              text,
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
  };

  return (
    <div className="app">
      <h1>Todo App</h1>
      <TaskInput onAdd={handleAddTask} />
      <TaskList
        tasks={tasks}
        onToggle={handleToggleTask}
        onDelete={handleDeleteTask}
        onEdit={handleEditTask}
      />
    </div>
  );
}

export default App;
