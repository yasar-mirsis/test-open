import { v4 as uuidv4 } from 'uuid';
import { Task } from '../types/Task';

interface TaskInputProps {
  onAdd: (task: Task) => void;
}

export function TaskInput({ onAdd }: TaskInputProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem('taskInput') as HTMLInputElement;
    const text = input.value.trim();

    if (text) {
      const newTask: Task = {
        id: uuidv4(),
        text,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      onAdd(newTask);
      input.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Add new task">
      <input
        type="text"
        name="taskInput"
        placeholder="Add a new task..."
        aria-label="Task description"
      />
      <button type="submit">Add</button>
    </form>
  );
}
