import { useEffect } from 'react';
import { RiCloseFill } from "react-icons/ri";
import type { Workout } from '@/types/workout';
import UserImage from '@/assets/images/account-logo.png';
import './WorkoutDetail.css';

interface WorkoutDetailProps {
    workout: Workout;
    isClosing: boolean;
    onClose: () => void;
}

export function WorkoutDetail({ workout, isClosing, onClose }: WorkoutDetailProps) {



    // Format date to DD.MM.YYYY
    const formatDate = (isoDate: string): string => {
        const date = new Date(isoDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    // Format sets as "weightxreps, weightxreps, ..."
    const formatSets = (sets: typeof workout.workoutExercises[0]['sets']): string => {
        return sets
            .map(set => `${set.weight}x${set.repetitions}`)
            .join(', ');
    };


    // Close on background click
    const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    const workoutNote = workout.note || 'Untitled Workout';
    const duration = workout.durationMinutes || 0;

    return (
        <>
            <div
                className={`popup-overlay ${isClosing ? 'closing' : ''}`}
                onClick={handleBackgroundClick}
            />
            <div className={`popup-container ${isClosing ? 'closing' : ''}`}>
                <div className="workout-detail-container">
                    <button className="close-popup-button" onClick={onClose}>
                        <RiCloseFill className="close-icon" />
                    </button>

                    <div className="workout-detail-header">
                        <div className="workout-detail-user-image-container">
                            <img src={UserImage} alt="User" />
                        </div>
                        <div className="workout-detail-header-general-info">
                            <p className="workout-detail-username">{workout.user.username}</p>
                            <p className="workout-detail-date">{formatDate(workout.createdAt)}</p>
                            <p className="workout-detail-note">{workoutNote}</p>
                            <p className="workout-detail-duration">{duration} minutes</p>
                        </div>
                    </div>

                    <div className="workout-detail-exercise-list">
                        {workout.workoutExercises
                            .sort((a, b) => a.order - b.order)
                            .map((workoutExercise) => (
                                <div key={workoutExercise.id} className="workout-detail-exercise-item">
                                    <div className="workout-detail-exercise-number">
                                        {workoutExercise.order}
                                    </div>
                                    <div className="workout-detail-exercise-info">
                                        <p className="workout-detail-exercise-name">
                                            {workoutExercise.exercise.name}
                                        </p>
                                        <p className="workout-detail-exercise-sets">
                                            {formatSets(workoutExercise.sets)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </>
    );
}