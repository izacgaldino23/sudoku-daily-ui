import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { worker } from './mocks/browser'
import { afterEach, beforeEach } from 'vitest'

await worker.start()
beforeEach(() => worker.resetHandlers())
afterEach(() => {
	cleanup()
	worker.resetHandlers()
})