import { useState, useEffect } from 'react'
import TaskInput from './components/TaskInput'
import TaskList from './components/TaskList'
import { LocalStorageService } from './services/LocalStorageService'
import type { Task } from './types/Task'

const localStorageService = new LocalStorageService()

function App() {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    // Load tasks from localStorage on mount
    const savedTasks = localStorageService.loadTasks()
    setTasks(savedTasks)
  }, [])

  const handleAddTask = (task: Task) => {
    const updatedTasks = [...tasks, task]
    setTasks(updatedTasks)
    localStorageService.saveTasks(updatedTasks)
  }

  const handleToggleTask = (id: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    )
    setTasks(updatedTasks)
    localStorageService.saveTasks(updatedTasks)
  }

  const handleDeleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id)
    setTasks(updatedTasks)
    localStorageService.saveTasks(updatedTasks)
  }

  const handleEditTask = (id: string, text: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, text, updatedAt: new Date().toISOString() } : task
    )
    setTasks(updatedTasks)
    localStorageService.saveTasks(updatedTasks)
  }

  return (
    <div style={{ width: '100%', maxWidth: '600px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
        Todo App
      </h1>
      <TaskInput onAdd={handleAddTask} />
      <TaskList
        tasks={tasks}
        onToggle={handleToggleTask}
        onDelete={handleDeleteTask}
        onEdit={handleEditTask}
      />
    </div>
  )
}

export default App
