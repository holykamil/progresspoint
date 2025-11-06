import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/lib/api';
import './SubmitWorkout.css';

interface WorkoutExercise {
    id: string;
    name: string;
    sets: {
        id: string;
        weight: string;
        reps: string;
    }[];
}

interface SubmitWorkoutProps {
    workoutExercises: WorkoutExercise[];
    durationMinutes: number;
    onClose: () => void;
    onSubmit: () => void;
}

interface UserData {
    user: {
        id: string;
        email: string;
        username: string;
        createdAt: string;
    };
}

export function SubmitWorkout({ workoutExercises, durationMinutes, onClose, onSubmit }: SubmitWorkoutProps) {
    const [workoutNote, setWorkoutNote] = useState('New workout');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        fetchUserId();
    }, []);

    async function fetchUserId() {
        try {
            const response = await fetchWithAuth('/api/me');
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            const data: UserData = await response.json();
            setUserId(data.user.id);
        } catch (err) {
            console.error('Error fetching user ID:', err);
            setError('Failed to load user data');
        }
    }

    async function handleSubmit() {
        if (!userId) {
            setError('User data not loaded');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Transform workout data to match API format
            const workoutData = {
                userId: userId,
                durationMinutes: durationMinutes,
                note: workoutNote,
                exercises: workoutExercises.map((exercise, index) => ({
                    exerciseId: exercise.id,
                    order: index + 1,
                    sets: exercise.sets
                        .filter(set => set.weight && set.reps) // Only include completed sets
                        .map((set, setIndex) => ({
                            setNumber: setIndex + 1,
                            repetitions: parseInt(set.reps),
                            weight: parseFloat(set.weight)
                        }))
                }))
                    .filter(exercise => exercise.sets.length > 0) // Only include exercises with sets
            };

            // Validate that there's at least one exercise with sets
            if (workoutData.exercises.length === 0) {
                setError('Please complete at least one set before submitting');
                setIsSubmitting(false);
                return;
            }

            const response = await fetchWithAuth('/api/workout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(workoutData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit workout');
            }

            // Success - call onSubmit to navigate
            onSubmit();
        } catch (err) {
            console.error('Error submitting workout:', err);
            setError(err instanceof Error ? err.message : 'Failed to submit workout');
            setIsSubmitting(false);
        }
    }

    const handleCancel = () => {
        onClose();
    };

    return (
        <>
            <div className="popup-overlay" onClick={handleCancel} />
            <div className="submit-workout-container">
                <div className="submit-workout-popup">
                    <h1 className="submit-workout-title">Submit workout</h1>

                    <div className="submit-workout-row">
                        <label className="submit-workout-label">Name</label>
                        <input
                            type="text"
                            className="submit-workout-input"
                            value={workoutNote}
                            onChange={(e) => setWorkoutNote(e.target.value)}
                            placeholder="Enter workout name"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="submit-workout-row">
                        <label className="submit-workout-label">Duration</label>
                        <div className="submit-workout-duration">
                            {durationMinutes} {durationMinutes === 1 ? 'minute' : 'minutes'}
                        </div>
                    </div>

                    {error && (
                        <div className="submit-workout-error">
                            {error}
                        </div>
                    )}

                    <div className="submit-workout-buttons">
                        <button
                            className="submit-workout-cancel-button"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            className="submit-workout-submit-button"
                            onClick={handleSubmit}
                            disabled={isSubmitting || !userId}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}