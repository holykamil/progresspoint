import { useState } from 'react';
import { fetchWithAuth } from '@/lib/api';
import './ProfilePictureDelete.css';

interface ProfilePictureDeleteProps {
    onClose: () => void;
    onSuccess: () => void;
}

export function ProfilePictureDelete({ onClose, onSuccess }: ProfilePictureDeleteProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        setIsDeleting(true);
        setError(null);

        try {
            const response = await fetchWithAuth('/api/user/picture', {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete profile picture');
            }

            onSuccess();
        } catch (err) {
            console.error('Error deleting profile picture:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete profile picture');
            setIsDeleting(false);
        }
    };

    return (
        <>
            <div className="profile-picture-delete-overlay" onClick={onClose} />
            <div className="profile-picture-delete-container">
                <h2 className="profile-picture-delete-title">
                    Are you sure you want to delete your profile picture?
                </h2>

                {error && (
                    <div className="profile-picture-delete-error">
                        {error}
                    </div>
                )}

                <div className="profile-picture-delete-actions">
                    <button
                        className="profile-picture-delete-cancel-button"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>
                    <button
                        className="profile-picture-delete-confirm-button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </>
    );
}