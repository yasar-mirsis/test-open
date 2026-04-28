# Architecture

## System Overview

The system is a single-page application (SPA) designed to manage personal tasks. It runs entirely in the user's browser with no backend dependency. Tasks are created, read, updated, and deleted (CRUD) through a simple user interface and persisted locally using the browser's localStorage API. The architecture emphasizes simplicity, responsiveness, and accessibility, enabling users to manage their to-dos efficiently across devices without requiring authentication or cloud storage. The application loads quickly, provides immediate feedback on user actions, and maintains state across page refreshes.

## Components

- **TaskInput**
  - *Responsibility*: Captures user input for new tasks and triggers addition to the list.
  - *Interfaces*: 
    - `onAdd(task: Task): void` - Callback when a new task is submitted.
    - Accepts keyboard events (Enter to submit, Escape to clear).

- **TaskList**
  - *Responsibility*: Displays all tasks and orchestrates user interactions.
  - *Interfaces*:
    - `tasks: Task[]` - List of tasks to render.
    - `onToggle(id: string): void` - Callback when a task’s completion status is changed.
    - `onDelete(id: string): void` - Callback when a task is deleted.
    - `onEdit(id: string, text: string): void` - Optional callback for task editing.

- **TaskItem**
  - *Responsibility*: Represents an individual task with controls for completion, editing, and deletion.
  - *Interfaces*:
    - `task: Task` - The task object to display.
    - Emits events for toggle, delete, and edit actions.

- **LocalStorageService**
  - *Responsibility*: Handles persistence of tasks using browser localStorage.
  - *Interfaces*:
    - `loadTasks(): Task[]` - Retrieves tasks from localStorage.
    - `saveTasks(tasks: Task[]): void` - Persists tasks array to localStorage.

- **App**
  - *Responsibility*: Root component that composes all UI elements and manages global state.
  - *Interfaces*:
    - Coordinates data flow between UI components and LocalStorageService.
    - Initializes task state on startup.

## Data Model

### Entities

- **Task**
  - `id: string` - Unique identifier for the task (generated using UUID or timestamp).
  - `text: string` - The description or title of the task.
  - `completed: boolean` - Indicates whether the task has been completed.
  - `createdAt: ISO8601` - Timestamp when the task was created.
  - `updatedAt: ISO8601` - Timestamp when the task was last modified (optional, for edit support).

### Relationships

There are no relational entities beyond the Task itself. All tasks exist in a flat list with no hierarchical or categorical grouping. The App component maintains a collection of Task objects as state, which is passed down to TaskList and rendered as individual TaskItem components.

## API Contracts

This application does not expose external APIs as it is a client-side only app. However, the internal module interfaces are defined as follows:

### LocalStorageService

- **Method**: `loadTasks`
  - **Request**: None (synchronous)
  - **Response**: `Task[]`
  - **Behavior**: Reads from `localStorage.tasks` and parses JSON. Returns empty array if no data or on error.

- **Method**: `saveTasks`
  - **Request**: `tasks: Task[]`
  - **Response**: `void`
  - **Behavior**: Serializes tasks array to JSON and stores in `localStorage.tasks`. Throws if quota exceeded.

### App Component Events

- **Event**: `taskAdded`
  - **Payload**: `Task`
  - **Triggered**: When a new task is added via TaskInput.

- **Event**: `taskToggled`
  - **Payload**: `{ id: string, completed: boolean }`
  - **Triggered**: When a task's checkbox is clicked.

- **Event**: `taskDeleted`
  - **Payload**: `id: string`
  - **Triggered**: When delete button is clicked.

- **Event**: `taskEdited`
  - **Payload**: `{ id: string, text: string }`
  - **Triggered**: When a task's text is edited (if implemented).

## Technology Stack

- **Framework**: React
  - *Justification*: React provides a component-based architecture ideal for building interactive UIs like a todo app. Its declarative nature simplifies state management and DOM updates. React’s ecosystem also supports accessibility and testing tools, aligning with non-functional requirements.

- **Language**: TypeScript
  - *Justification*: Adds static typing to catch errors during development, especially important for maintaining data consistency across components and the Task model. Improves code quality and developer experience in larger implementations.

- **State Management**: React Hooks (useState, useEffect)
  - *Justification*: Sufficient for this application's scope. No need for external libraries like Redux given the single source of truth (App component) and limited state complexity.

- **Persistence**: Browser localStorage
  - *Justification*: Meets the requirement for client-side persistence without a backend. Data remains after page refresh and is widely supported across modern browsers.

- **Styling**: CSS Modules or Tailwind CSS
  - *Justification*: CSS Modules prevent naming conflicts and scope styles locally. Alternatively, Tailwind enables rapid, responsive UI development with utility-first classes—ideal for mobile-friendly design.

- **Build Tool**: Vite
  - *Justification*: Fast development server and build process with excellent React and TypeScript support. Enables quick iteration and small production bundles for fast loading.

- **Testing**: Jest + React Testing Library
  - *Justification*: Industry standard for unit and component testing in React apps. Ensures functionality (e.g., add, complete, delete) works as expected and supports accessibility checks.

## Data Flow

### User Adds a Task
1. User types into the TaskInput field and presses Enter or clicks Add.
2. TaskInput validates input (non-empty, trimmed text).
3. App generates a new Task object with unique ID and default `completed: false`.
4. App updates its internal state with the new task.
5. App triggers `saveTasks` via LocalStorageService to persist updated list.
6. TaskList re-renders to include the new task.

### User Marks Task as Complete
1. User clicks checkbox in a TaskItem.
2. TaskItem emits `onToggle` event with task ID.
3. App handles event, toggles `completed` flag in state.
4. App triggers `saveTasks` to persist changes.
5. TaskItem re-renders with strikethrough style.

### User Deletes a Task
1. User clicks delete button on a TaskItem.
2. TaskItem emits `onDelete` event with task ID.
3. App filters out the task from state.
4. App triggers `saveTasks` to persist remaining tasks.
5. TaskList re-renders without the deleted item.

### Application Load
1. On initial load, App calls `LocalStorageService.loadTasks()`.
2. If tasks exist in localStorage, they are parsed and set as initial state.
3. If no tasks or on error, App initializes with empty task list.
4. TaskList renders all tasks from state.

## Security Considerations

- **Client-Side Only Data**: All data is stored locally in the user’s browser using localStorage. No data is transmitted over the network, eliminating risks of interception or server-side breaches.

- **No Authentication**: Since there is no user account system or cloud sync, there are no credentials to protect. Each user’s data is isolated to their browser instance.

- **XSS Prevention**: The app must avoid using `dangerouslySetInnerHTML` or evaluating user input as code. Task text should be rendered as plain text to prevent script injection.

- **Input Sanitization**: While not strictly necessary for localStorage, task input should be trimmed and validated to prevent empty or whitespace-only entries, improving data quality and UX.

- **Storage Quota Handling**: The app should gracefully handle cases where localStorage is full (e.g., show a warning) rather than failing silently.

- **Private Browsing Mode**: In environments where localStorage is disabled (e.g., private/incognito mode), the app should fall back to in-memory storage so functionality remains, though persistence is lost on refresh.

## Scalability Notes

- **Horizontal Scalability**: Not applicable — the app runs entirely in the client browser with no backend services to scale.

- **Vertical Scalability (Client-Side)**: The app is designed for personal use with a moderate number of tasks (hundreds, not thousands). Performance may degrade with very large task lists due to re-renders; virtualization could be added later if needed.

- **State Management**: Current use of React state is sufficient for the expected scale. For larger datasets, pagination or infinite scroll with virtualized rendering (e.g., react-window) can be implemented.

- **Bundle Size**: The use of Vite and code splitting ensures minimal bundle size, contributing to fast load times even on low-end devices or slow networks.

- **Extensibility**: The component-based architecture allows for easy addition of features like due dates, priorities, filtering, or search without disrupting existing functionality.

- **Future Enhancements**: If multi-device sync or backups are required, the LocalStorageService can be abstracted behind an interface and replaced with a cloud-based adapter (e.g., Firebase, Supabase) without changing UI components.