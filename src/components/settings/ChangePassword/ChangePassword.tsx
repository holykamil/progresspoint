import { useState } from 'react';
import { fetchWithAuth } from '@/lib/api';
import './ChangePassword.css';

interface ChangePasswordProps {
    onClose: () => void;
    onSuccess: () => void;
}

export function ChangePassword({ onClose, onSuccess }: ChangePasswordProps) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function validate(): string | null {
        if (!oldPassword) {
            return 'Please enter your current password';
        }
        if (!newPassword) {
            return 'Please enter a new password';
        }
        if (newPassword.length < 6) {
            return 'New password must be at least 6 characters';
        }
        if (!confirmPassword) {
            return 'Please confirm your new password';
        }
        if (newPassword !== confirmPassword) {
            return 'New passwords do not match';
        }
        if (oldPassword === newPassword) {
            return 'New password must be different from current password';
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
            const response = await fetchWithAuth('/api/user/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    oldPassword: oldPassword,
                    newPassword: newPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Failed to change password');
                setIsSubmitting(false);
                return;
            }

            // Success
            onSuccess();
        } catch (err) {
            console.error('Error changing password:', err);
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
            <div className="change-password-overlay" onClick={handleBackgroundClick} />
            <div className="change-password-container">
                <div className="change-password-popup">
                    <h2 className="change-password-title">Change password</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="change-password-input-group">
                            <label className="change-password-label">Current password</label>
                            <input
                                type="password"
                                className="change-password-input"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                placeholder="Enter current password"
                                disabled={isSubmitting}
                                autoFocus
                            />
                        </div>

                        <div className="change-password-input-group">
                            <label className="change-password-label">New password</label>
                            <input
                                type="password"
                                className="change-password-input"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="change-password-input-group">
                            <label className="change-password-label">Confirm new password</label>
                            <input
                                type="password"
                                className="change-password-input"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                disabled={isSubmitting}
                            />
                        </div>

                        {error && (
                            <div className="form-error change-password-error">
                                {error}
                            </div>
                        )}

                        <div className="change-password-buttons">
                            <button
                                type="button"
                                className="change-password-cancel-button"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="change-password-submit-button"
                                disabled={isSubmitting || !oldPassword || !newPassword || !confirmPassword}
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