import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import { preview } from '@vitest/browser-preview'

const alias = {
  '@': path.resolve(__dirname, './src'),
  '@assets': path.resolve(__dirname, './src/assets'),
}

export default defineConfig({
	plugins: [ react() ],
	resolve: { alias },
	test: {
		projects: [
			{
				resolve: { alias },
				test: {
					name: 'cli',
					globals: true,
					environment: 'jsdom',
					logHeapUsage: false,
					setupFiles: './src/test/setup.cli.ts',
					env: {
						VITE_API_URL: 'http://localhost:3000',
					},
				},
			},
			{
				resolve: { alias },
				test: {
					name: 'browser',
					globals: true,
					environment: 'jsdom',
					logHeapUsage: false,
					setupFiles: './src/test/setup.browser.ts',
					env: {
						VITE_API_URL: 'http://localhost:3000',
					},
					browser: {
						enabled: true,
						provider: preview(),
						instances: [
							{
								browser: 'chromium',
							}
						]
					},
				}
			}
		],
	},
})