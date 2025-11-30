import type { HistoryWorkoutCardProps } from '@/types/workout';
import { formatDate } from '@/lib/date';
import { FaTrashAlt } from "react-icons/fa";
import { fetchWithAuth } from '@/lib/api';
import { useState } from 'react';
import { DeleteWorkoutPopup } from '../DeleteWorkoutPopup/DeleteWorkoutPopup';
import './HistoryWorkoutCard.css';

export function HistoryWorkoutCard({
    workout,
    index,
    onClick,
    isSelected = false,
    isSelectMode = false,
    onDelete
}: HistoryWorkoutCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);

    // Get comma-separated exercise names
    const getExerciseNames = (): string => {
        return workout.workoutExercises
            .map(we => we.exercise.name)
            .join(', ');
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click
        setShowDeletePopup(true);
    };

    const handleCancelDelete = () => {
        setShowDeletePopup(false);
    };

    const handleConfirmDelete = async () => {
        if (isDeleting) return;

        setIsDeleting(true);
        try {
            const response = await fetchWithAuth('/api/workout', {
                method: 'DELETE',
                body: JSON.stringify({ workoutId: workout.id })
            });

            if (!response.ok) {
                throw new Error('Failed to delete workout');
            }

            // Call parent callback to update the list
            if (onDelete) {
                onDelete(workout.id);
            }

            setShowDeletePopup(false);
        } catch (error) {
            console.error('Error deleting workout:', error);
            alert('Failed to delete workout. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const workoutNote = workout.note || 'Untitled Workout';

    const containerClass = `history-workout-container ${isSelected && isSelectMode ? 'selected' : ''
        }`;

    return (
        <>
            <div
                className={containerClass}
                onClick={() => onClick(workout.id)}
                style={{ animationDelay: `${index * 0.1}s` }}
            >
                <div className="history-workout-info">
                    <div className="history-workout-note">
                        {workoutNote}
                    </div>
                    <div className="history-workout-date">
                        {formatDate(workout.createdAt)}
                    </div>
                    <div className="history-workout-exercises">
                        {getExerciseNames()}
                    </div>
                </div>
                <button
                    className="delete-workout-button"
                    onClick={handleDeleteClick}
                    disabled={isDeleting}
                    aria-label="Delete workout"
                >
                    <FaTrashAlt />
                </button>
            </div>

            {showDeletePopup && (
                <DeleteWorkoutPopup
                    workoutNote={workoutNote}
                    onCancel={handleCancelDelete}
                    onDelete={handleConfirmDelete}
                    isDeleting={isDeleting}
                />
            )}
        </>
    );
}