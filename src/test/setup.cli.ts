import { setupServer } from 'msw/node'
import { handlers } from './mocks/handlers'
import { afterAll, afterEach, beforeAll } from 'vitest'
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';

export const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => {
	cleanup();
	server.resetHandlers()
})
afterAll(() => server.close())