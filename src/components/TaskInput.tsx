import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Task } from '../types/Task'

interface TaskInputProps {
  onAdd: (task: Task) => void
}

function TaskInput({ onAdd }: TaskInputProps) {
  const [text, setText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      const newTask: Task = {
        id: uuidv4(),
        text: text.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      }
      onAdd(newTask)
      setText('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setText('')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new task..."
          aria-label="New task input"
          style={{
            flex: 1,
            padding: '12px 16px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={!text.trim()}
          aria-label="Add task"
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: text.trim() ? 'pointer' : 'not-allowed',
            opacity: text.trim() ? 1 : 0.6,
          }}
        >
          Add
        </button>
      </div>
    </form>
  )
}

export default TaskInput
