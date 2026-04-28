# Sudoku Daily UI

React 19 + TypeScript + Vite + Vitest + Sass

## Commands

```
bun run dev       # Start dev server
bun run build     # Build production
bun run lint      # Lint code
bun run test      # Run tests (unit and cli)
bun run test:ui   # Run tests (browser)
bun run test:cli  # Run tests (cli)
bun run test:unit # Run unit tests
```

## Tech Stack

- **React 19** with TypeScript
- **Vite** for bundling
- **Vitest** for testing (3 projects: cli/browser/unit)
- **Sass** for styling
- **Zustand** for state management
- **TanStack React Query** for data fetching
- **React Router** for routing
- **MSW** for API mocking in tests

## Project Structure

```
src/
├── app/           # App layout, routes
├── components/    # Reusable components (form, layout)
├── hooks/         # Custom hooks + React Query (queries.ts, mutations.ts)
├── pages/         # Page components (login, play, leaderboard, profile)
├── types/         # TypeScript types (api, game, ui)
└── utils/         # Utility functions
```

## Conventions

- React Query hooks: `hooks/{feature}/queries.ts` and `hooks/{feature}/mutations.ts`
- Routing: `src/app/routes.tsx`
- Zustand stores: typically in hooks or stores directories
- Styling: Component-specific `.scss` files alongside components

## Testing

- **cli**: Run in Node environment (fastest)
- **browser**: Run in browser with Playwright
- **unit**: Unit tests with testing-library
- MSW handlers defined in test setup for API mocking

---

**Note**: Keep this file updated when project configuration, dependencies, or conventions change.