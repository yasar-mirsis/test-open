import TaskItem from './TaskItem'
import type { Task } from '../types/Task'

interface TaskListProps {
  tasks: Task[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, text: string) => void
}

function TaskList({ tasks, onToggle, onDelete, onEdit }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '2rem',
          color: '#666',
          fontStyle: 'italic',
        }}
      >
        No tasks yet. Add one above!
      </div>
    )
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  )
}

export default TaskList
