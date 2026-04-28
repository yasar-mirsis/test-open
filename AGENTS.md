# AGENTS.md — test-open

This file describes the project for AI agents working on implementation issues.

## Project Context

## Stakeholders
- End Users: Individuals who will use the todo app to manage their tasks.
- Project Owner: The person requesting the development of the todo app.

## User Stories (include acceptance criteria for each)
- As a user, I want to add a new task to my todo list so that I can keep track of things I need to do.
  - Acceptance Criteria: Given the app is open, when the user enters a task name and clicks "Add", then the task appears in the list.
- As a user, I want to mark a task as complete so that I can track my progress.
  - Acceptance Criteria: Given a task exists, when the user clicks the checkbox next to the task, then the task is marked as completed with visual indication (e.g., strikethrough).
- As a user, I want to delete a task so that I can remove items I no longer need.
  - Acceptance Criteria: Given a task exists, when the user clicks the delete button, then the task is removed from the list.
- As a user, I want to view all my tasks so that I can see what I need to do.
  - Acceptance Criteria: Given tasks exist, when the app loads, then all tasks are displayed in the list.

## Functional Requirements
- Must: Allow users to add new tasks.
- Must: Allow users to mark tasks as complete/incomplete.
- Must: Allow users to delete tasks.
- Must: Persist tasks in the browser (e.g., using localStorage) so tasks remain after page refresh.
- Should: Support basic keyboard navigation (e.g., pressing Enter to add a task).
- Could: Allow editing of existing tasks.

## Non-Functional Requirements
- Must: Be responsive and usable on mobile devices.
- Must: Load quickly with minimal latency.
- Must: Be accessible (e.g., support screen readers, proper ARIA labels).
- Should: Have a clean and intuitive user interface.
- Could: Be themeable (e.g., light/dark mode).

## Edge Cases
- Adding a task with empty or whitespace-only text.
- Deleting a task when no tasks exist.
- Marking a task as complete when the list is empty.
- Exceeding localStorage limits (very large number of tasks).
- Using the app in private/incognito mode where localStorage may be restricted.
- Browser compatibility across modern browsers (Chrome, Firefox, Safari, Edge).

## Assumptions
- The app will run entirely in the browser with no backend services.
- Data persistence will be handled via browser localStorage.
- Users will use modern, standards-compliant browsers.
- No user authentication or data synchronization across devices is required.
- The app does not need to support offline functionality beyond localStorage persistence.

## Open Questions
- Should tasks have due dates or priorities?
- Should users be able to categorize or tag tasks?
- Is there a need to export or share the todo list?
- Are there specific design guidelines or branding requirements?
- Should the app support undo functionality for deletions?


## Architecture

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

- **Metho

[... truncated for brevity ...]

## Working Guidelines

- Read this file and README.md before starting any work
- Follow existing code patterns and conventions
- Write clean, production-quality code with proper error handling
- Create or update tests if a testing setup exists
- Do NOT run git commands — the pipeline handles commits and pushes
- Do NOT ask questions — you are running in an automated pipeline