/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',  // Change to jsdom instead of happy-dom
        globals: true,
        setupFiles: './tests/setup.ts',
        include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

        pool: 'threads',
        poolOptions: {
          threads: {
            minThreads: 1,
            maxThreads: 4
          }
        }

    },
});