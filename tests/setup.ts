import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
    cleanup();
});

// Mock window.navigator
Object.defineProperty(window, 'navigator', {
    value: {
        share: undefined,
        clipboard: {
            writeText: vi.fn(),
        },
    },
    writable: true,
    configurable: true,
});