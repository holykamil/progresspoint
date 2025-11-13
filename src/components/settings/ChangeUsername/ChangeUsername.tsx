import { useState } from 'react';
import { fetchWithAuth } from '@/lib/api';
import './ChangeUsername.css';

interface ChangeUsernameProps {
    currentUsername: string;
    onClose: () => void;
    onSuccess: (newUsername: string) => void;
}

export function ChangeUsername({ currentUsername, onClose, onSuccess }: ChangeUsernameProps) {
    const [newUsername, setNewUsername] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function validate(): string | null {
        if (!newUsername.trim()) {
            return 'Username cannot be empty';
        }
        if (newUsername.length < 3) {
            return 'Username must be at least 3 characters';
        }
        if (newUsername.length > 20) {
            return 'Username must be less than 20 characters';
        }
        if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
            return 'Username can only contain letters, numbers, and underscores';
        }
        if (newUsername === currentUsername) {
            return 'New username must be different from current username';
        }
        return null;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetchWithAuth('/api/user/username', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newUsername: newUsername.trim() })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Failed to change username');
                setIsSubmitting(false);
                return;
            }

            // Success
            onSuccess(newUsername.trim());
        } catch (err) {
            console.error('Error changing username:', err);
            setError('Network error. Please try again.');
            setIsSubmitting(false);
        }
    }

    const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <>
            <div className="change-username-overlay" onClick={handleBackgroundClick} />
            <div className="change-username-container">
                <div className="change-username-popup">
                    <h2 className="change-username-title">Change username</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="change-username-input-group">
                            <label className="change-username-label">Current username</label>
                            <input
                                type="text"
                                className="change-username-input disabled"
                                value={currentUsername}
                                disabled
                            />
                        </div>

                        <div className="change-username-input-group">
                            <label className="change-username-label">New username</label>
                            <input
                                type="text"
                                className="change-username-input"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                placeholder="Enter new username"
                                disabled={isSubmitting}
                                autoFocus
                            />
                        </div>

                        {error && (
                            <div className="form-error change-username-error">
                                {error}
                            </div>
                        )}

                        <div className="change-username-buttons">
                            <button
                                type="button"
                                className="change-username-cancel-button"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="change-username-submit-button"
                                disabled={isSubmitting || !newUsername.trim()}
                            >
                                {isSubmitting ? 'Changing...' : 'Change'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}