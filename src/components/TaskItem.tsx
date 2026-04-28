import { useState } from 'react'
import type { Task } from '../types/Task'

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, text: string) => void
}

function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(task.text)

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onEdit(task.id, editText.trim())
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setEditText(task.text)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        marginBottom: '8px',
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '4px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      }}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        aria-label={`Mark task as ${task.completed ? 'incomplete' : 'complete'}`}
        style={{
          marginRight: '12px',
          width: '18px',
          height: '18px',
          cursor: 'pointer',
        }}
      />

      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSaveEdit}
          autoFocus
          aria-label="Edit task"
          style={{
            flex: 1,
            padding: '8px',
            fontSize: '16px',
            border: '1px solid #007bff',
            borderRadius: '4px',
            outline: 'none',
          }}
        />
      ) : (
        <span
          style={{
            flex: 1,
            fontSize: '16px',
            textDecoration: task.completed ? 'line-through' : 'none',
            color: task.completed ? '#999' : '#333',
          }}
        >
          {task.text}
        </span>
      )}

      <div style={{ display: 'flex', gap: '8px', marginLeft: '12px' }}>
        {isEditing ? (
          <>
            <button
              onClick={handleSaveEdit}
              aria-label="Save edit"
              style={{
                padding: '6px 12px',
                fontSize: '14px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              aria-label="Cancel edit"
              style={{
                padding: '6px 12px',
                fontSize: '14px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              aria-label="Edit task"
              style={{
                padding: '6px 12px',
                fontSize: '14px',
                backgroundColor: '#ffc107',
                color: '#333',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task.id)}
              aria-label="Delete task"
              style={{
                padding: '6px 12px',
                fontSize: '14px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </li>
  )
}

export default TaskItem
