// src/components/ShareButton.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShareButton } from './ShareButton';

function mockNavigatorShare(implementation?: () => Promise<void>) {
    const share = implementation || (() => Promise.resolve());
    Object.defineProperty(global.navigator, 'share', {
        configurable: true,
        value: vi.fn().mockImplementation(share),
        writable: true
    });
}

function removeNavigatorShare() {
    Object.defineProperty(global.navigator, 'share', {
        configurable: true,
        value: undefined,
        writable: true
    });
}

function mockNavigatorClipboard(implementation?: { writeText: () => Promise<void> }) {
    const clipboard = implementation || {
        writeText: () => Promise.resolve()
    };
    Object.defineProperty(global.navigator, 'clipboard', {
        configurable: true,
        value: {
            writeText: vi.fn().mockImplementation(clipboard.writeText)
        },
        writable: true
    });
}

describe('ShareButton', () => {
    const mockProps = {
        url: 'https://example.com/blog/post-1',
        title: 'Test Post',
        description: 'Test Description',
    };

    beforeEach(() => {
        vi.clearAllMocks();
        removeNavigatorShare(); // Start with no share API
    });

    it('renders correctly', () => {
        render(<ShareButton {...mockProps} />);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('aria-label', 'Share content');
    });

    it('uses Web Share API when available', async () => {
        const shareMock = vi.fn().mockResolvedValue(undefined);
        mockNavigatorShare(() => shareMock(mockProps));

        render(<ShareButton {...mockProps} />);
        const button = screen.getByRole('button');
        await act(async () => {
            await userEvent.click(button);
        });

        expect(shareMock).toHaveBeenCalledWith({
            title: mockProps.title,
            description: mockProps.description,
            url: mockProps.url,
        });
    });

    it('falls back to clipboard API when Web Share API is not available', async () => {
        const clipboardMock = vi.fn().mockResolvedValue(undefined);
        mockNavigatorClipboard({
            writeText: () => clipboardMock(mockProps.url)
        });

        render(<ShareButton {...mockProps} />);
        const button = screen.getByRole('button');
        await act(async () => {
            await userEvent.click(button);
        });

        expect(clipboardMock).toHaveBeenCalledWith(mockProps.url);
    });

    it('adds and removes success animation class', async () => {
        render(<ShareButton {...mockProps} />);
        const button = screen.getByRole('button');

        await act(async () => {
            await userEvent.click(button);
        });

        // Wait for the success state
        await vi.waitFor(() => {
            expect(button).toHaveAttribute('data-is-animating', 'true');
        });

        // Wait for the success state to be removed
        await vi.waitFor(() => {
            expect(button).not.toHaveAttribute('data-is-animating');
        });
    });


    it('handles Web Share API errors', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        mockNavigatorShare(() => Promise.reject(new Error('Share failed')));

        render(<ShareButton {...mockProps} />);
        const button = screen.getByRole('button');
        await act(async () => {
            await userEvent.click(button);
        });

        expect(consoleSpy).toHaveBeenCalledWith('Error sharing:', expect.any(Error));
        consoleSpy.mockRestore();
    });

    it('handles Clipboard API errors', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        mockNavigatorClipboard({
            writeText: () => Promise.reject(new Error('Clipboard failed'))
        });

        render(<ShareButton {...mockProps} />);
        const button = screen.getByRole('button');
        await act(async () => {
            await userEvent.click(button);
        });

        expect(consoleSpy).toHaveBeenCalledWith('Failed to copy text:', expect.any(Error));
        consoleSpy.mockRestore();
    });
});