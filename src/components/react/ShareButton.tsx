// src/components/ShareButton.tsx
import { useState } from 'react';
import styles from './ShareButton.module.css';

interface ShareButtonProps {
    url: string;
    title: string;
    description: string;
}

export const ShareButton = ({ url, title, description }: ShareButtonProps) => {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text: description,
                    url,
                });
                console.log('Shared successfully!');
            } catch (error) {
                console.error('Error sharing:', error);
            }
            return;
        }

        if (navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(url);
                setIsAnimating(true);
                setTimeout(() => setIsAnimating(false), 1000);
            } catch (error) {
                console.error('Failed to copy text:', error);
            }
        }
    };

    return (
        <button
            className={`${styles.container} ${isAnimating ? styles.successAnimation : ''}`}
            onClick={handleShare}
            title="Click to share"
            type="button"
            aria-label="Share content"
        >
            <svg
                className={styles.icon}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                <polyline points="16 6 12 2 8 6"/>
                <line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
        </button>
    );
};