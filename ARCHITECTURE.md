# Sudoku Daily UI - Frontend Architecture

## Project Overview

A React-based Sudoku puzzle game featuring multiple board sizes (4x4, 6x6, 9x9), daily challenges, and game state persistence. Built with TypeScript, Vite, TanStack Query, and React Router.

## Folder Structure

```
src/
├── app/              # Application shell and routing
├── components/       # Reusable UI components
├── config/           # Environment configuration
├── context/          # React Context providers and state management
├── hooks/            # Custom hooks encapsulating domain logic
├── pages/            # Page-level components
├── services/         # API client and service layer
├── styles/           # Global styles and SCSS variables
├── types/            # TypeScript type definitions
└── utils/            # Utility functions and mappers
```

## Layer Responsibilities

### Components (`src/components/`)

Presentational UI elements. Components are **dumb** - they receive data via props and emit events. No business logic.

- `game/board/` - Sudoku board rendering
- `inputs/button/` - Reusable button component
- `layout/` - Header, sidebar, ad slots, logo
- `alert/` - Toast notification UI

### Hooks (`src/hooks/`)

**Domain logic encapsulation**. Each hook focuses on a specific feature:

- `useSudoku.ts` - Main game hook: loading games, submitting solutions, error handling
- `sudoku/queries.ts` - TanStack Query hooks for data fetching
- `sudoku/mutations.ts` - TanStack Query hooks for data submission

Hooks bridge components and services, handling side effects and state coordination.

### Context + Reducer (`src/context/`)

Global state management using React Context + useReducer:

- **GameContext** - Game state (board, selected cell, status) with `gameReducer`
- **SessionContext** - User session ID (simple context, no reducer)
- **AlertsContext** - Toast notification queue

Each context follows the pattern:
- `*Context.tsx` - Context creation + custom useHook
- `*Provider.tsx` - Provider component with state logic
- `*Reducer.ts` (game only) - State transitions

### Services (`src/services/`)

**API layer**. Thin wrappers around fetch:

- `api.ts` - Domain-specific API functions (fetchDailySudoku, submitSudokuSolve)
- `apiClient.ts` - Generic fetch wrapper with error handling, session management
- `errors.ts` - Custom error classes

### Pages (`src/pages/`)

Route-level components that compose hooks and components:

- `Play.tsx` - Game board view
- `PlayWrapper.tsx` - Route wrapper with GameProvider
- `Leaderboard.tsx`, `Login.tsx`, `Profile.tsx`, `About.tsx`

### Types (`src/types/`)

TypeScript definitions for the domain:

- `GameTypes.ts` - Game state, actions, board sizes
- `ApiTypes.ts` - API request/response types
- `BoardTypes.ts`, `PlayTypes.ts`, `AlertTypes.ts`

## Data Flow

```
User Action
    │
    ▼
Component (Play.tsx)
    │
    ▼
useSudoku hook
    │
    ├──▶ useDailySudoku (query) ──▶ fetchDailySudoku ──▶ apiClient ──▶ Backend
    │                                              │
    │◀─────────────────────────────────────────────┘
    │
    ▼ (on data)
dispatch(START_GAME)
    │
    ▼
gameReducer(GameState, action)
    │
    ▼
GameContext.Provider updates
    │
    ▼
Component re-renders with new state
```

## Context + Reducer Pattern

### GameContext (with Reducer)

```typescript
// State shape
type GameState = Partial<Record<BoardSize, GameData>>;

// Actions
type GameAction = 
  | { type: "LOADING_GAME"; size: BoardSize }
  | { type: "START_GAME"; size: BoardSize; payload: {...} }
  | { type: "SELECT_CELL"; ... }
  | { type: "SET_VALUE"; ... }
  | { type: "CLEAR_VALUE"; ... }
  | { type: "FINISH_GAME"; ... }

// Reducer handles all state transitions
function gameReducer(state, action) { ... }

// Provider wraps app with useReducer
<GameProvider> → <GameContext.Provider value={{state, dispatch}}>
```

### Why Reducer?

1. **Predictable state** - All state changes go through explicit actions
2. **Testable** - Reducer is a pure function, easy to unit test
3. **Undo/redo ready** - State history can be maintained
4. **Complex state** - Multiple game sizes tracked simultaneously

### SessionContext (Simple)

No reducer needed - just session ID management:

```typescript
<SessionProvider value={{ sessionID, setSessionID }}>
```

### AlertsContext (useState)

Simple queue - no reducer needed for basic push/remove:

```typescript
const [alerts, setAlerts] = useState<AlertItem[]>([]);
function pushAlert(message, variant) { ... }
function removeAlert(id) { ... }
```

## Hooks Encapsulating Domain Logic

### useSudoku

The main hook orchestrating game lifecycle:

1. **Fetches daily puzzle** via `useDailySudoku` query
2. **Dispatches START_GAME** when data arrives
3. **Provides loadGame()** to trigger new games
4. **Provides submit()** to send solution
5. **Handles errors** - shows alerts on query failures

```typescript
function useSudoku() {
  const { state, dispatch } = useGame();
  const dailyQuery = useDailySudoku(size);
  const submitMutation = useSubmitSudokuSolve();
  const { pushAlert } = useAlert();

  // Sync query data to game state
  useEffect(() => {
    if (dailyQuery.data) {
      dispatch({ type: "START_GAME", ... });
    }
  }, [dailyQuery.data]);

  // Error handling
  useEffect(() => {
    if (dailyQuery.isError) {
      pushAlert(getErrorMessage(dailyQuery.error), "error");
    }
  }, [dailyQuery.isError]);

  return { loading, loadGame, submit };
}
```

### TanStack Query Integration

- **queries.ts** - `useDailySudoku` with caching (staleTime: Infinity)
- **mutations.ts** - `useSubmitSudokuSolve` for submissions

Query keys: `["dailySudoku", size]` - enables size-specific caching.

## useEffect Usage

### GameProvider - Persistence

```typescript
useEffect(() => {
  if (state !== prevStateRef.current) {
    setGameState(state); // localStorage sync
  }
}, [state]);
```

### useSudoku - Data Sync & Errors

```typescript
// Sync API response to reducer state
useEffect(() => {
  if (dailyQuery.data) {
    dispatch({ type: "START_GAME", ... });
  }
}, [dailyQuery.data]);

// Error handling (with ref to prevent duplicate alerts)
useEffect(() => {
  if (dailyQuery.isError && !errorShownRef.current) {
    errorShownRef.current = true;
    pushAlert(getErrorMessage(dailyQuery.error), "error");
  }
}, [dailyQuery.isError]);
```

### Play.tsx - Timer

```typescript
useEffect(() => {
  if (!isStarted) return;
  const interval = setInterval(() => {
    setSeconds(calcSeconds(currentState.startTime));
  }, 1000);
  return () => clearInterval(interval);
}, [isStarted, currentState]);
```

## Key Architectural Conventions

### 1. Provider Nesting

```typescript
// main.tsx - providers wrap entire app
<AlertsProvider>
  <QueryClientProvider>
    <SessionProvider>
      <RouterProvider>
    </SessionProvider>
  </QueryClientProvider>
</AlertsProvider>
```

### 2. Feature-Scoped Providers

GameProvider is re-created per route in PlayWrapper:

```typescript
function PlayWrapper() {
  return (
    <GameProvider>
      <Play size={convertedSize} />
    </GameProvider>
  )
}
```

### 3. Type-Driven Actions

All actions are typed via discriminated unions:

```typescript
type GameAction = 
  | { type: "LOADING_GAME"; size: BoardSize }
  | { type: "START_GAME"; size: BoardSize; payload: {...} }
  // ...
```

### 4. Storage Abstraction

localStorage accessed via thin abstraction layer:

```typescript
// gameStorage.ts
export function getGameState() { ... }
export function setGameState(state) { ... }
```

### 5. Error Handling Pattern

Custom error classes + centralized error messages:

```typescript
// errors.ts
export class ApiError extends Error { ... }
export class NetworkError extends Error { ... }
export function getErrorMessage(error): string { ... }
```

### 6. CSS Organization

- Component-scoped SCSS files alongside components
- Global variables in `styles/_variables.scss`
- Global styles in `styles/global.scss`

### 7. Index Exports

Barrel exports for clean imports:

```typescript
// context/index.ts
export { GameProvider, useGame } from "./game";
export { SessionProvider, useSession } from "./session";
```

## Common Patterns

### Consuming Context

```typescript
// In any component
const { state, dispatch } = useGame();
```

### Dispatching Actions

```typescript
dispatch({ type: "SET_VALUE", size: 9, payload: { row: 0, col: 0, value: 5 } });
```

### Loading Game Data

```typescript
const { loadGame, submit, loading } = useSudoku();
loadGame(9); // Start 9x9 game
```
