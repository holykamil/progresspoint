import './DeleteWorkoutPopup.css';

interface DeleteWorkoutPopupProps {
    workoutNote: string;
    onCancel: () => void;
    onDelete: () => void;
    isDeleting: boolean;
}

export function DeleteWorkoutPopup({ workoutNote, onCancel, onDelete, isDeleting }: DeleteWorkoutPopupProps) {
    return (
        <>
            <div className="delete-workout-overlay" onClick={onCancel} />
            <div className="delete-workout-container">
                <div className="delete-workout-popup">
                    <h2 className="delete-workout-title">Delete Workout?</h2>
                    <p className="delete-workout-message">
                        Are you sure you want to delete "<strong>{workoutNote}</strong>"? This action cannot be undone.
                    </p>

                    <div className="delete-workout-buttons">
                        <button
                            className="delete-workout-cancel-button"
                            onClick={onCancel}
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>
                        <button
                            className="delete-workout-confirm-button"
                            onClick={onDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
