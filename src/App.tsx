import { useState, useEffect } from 'react';
import { Task } from './types/Task';
import { LocalStorageService } from './services/LocalStorageService';
import { TaskInput } from './components/TaskInput';
import { TaskList } from './components/TaskList';

const localStorageService = new LocalStorageService();

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loadedTasks = localStorageService.loadTasks();
    setTasks(loadedTasks);
  }, []);

  useEffect(() => {
    localStorageService.saveTasks(tasks);
  }, [tasks]);

  const handleAdd = (task: Task) => {
    setTasks((prev) => [...prev, task]);
  };

  const handleToggle = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div>
      <h1>Todo App</h1>
      <TaskInput onAdd={handleAdd} />
      <TaskList tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} />
    </div>
  );
}

export default App;
