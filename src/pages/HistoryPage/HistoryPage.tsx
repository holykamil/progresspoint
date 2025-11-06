import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../lib/api';
import type { WorkoutsResponse, Workout } from '@/types/workout';
import { Header } from '@/components/Header/Header';
import { HistoryWorkoutCard } from '@/components/history/HistoryWorkoutCard/HistoryWorkoutCard';
import { WorkoutDetail } from '@/components/workout/WorkoutDetail/WorkoutDetail';
import './HistoryPage.css';

export function HistoryPage() {
    const [workouts, setWorkouts] = useState<WorkoutsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        fetchWorkouts();
    }, []);

    async function fetchWorkouts() {
        try {
            setLoading(true);
            setError(null);

            const response = await fetchWithAuth('/api/workout');

            if (!response.ok) {
                throw new Error('Failed to fetch workouts');
            }

            const data: WorkoutsResponse = await response.json();
            setWorkouts(data);
        } catch (err) {
            console.error('Error fetching workouts:', err);
            setError('Failed to load workout history. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    function handleWorkoutClick(workoutId: string) {
        const workout = workouts?.workouts.find(w => w.id === workoutId);
        if (workout) {
            setSelectedWorkout(workout);
            setIsClosing(false);
        }
    }

    function handleCloseDetail() {
        setIsClosing(true);
        setTimeout(() => {
            setSelectedWorkout(null);
            setIsClosing(false);
        }, 300);
    }

    return (
        <main className="history-page">
            <Header />
            <div className="history-page-content">
                <div className="history-page-header">
                    Workout history
                </div>

                <div className="history-workouts-list">
                    {loading && (
                        <div className="history-list-loading">
                            <div className="history-list-loading-spinner"></div>
                            <p>Loading workout history...</p>
                        </div>
                    )}

                    {error && (
                        <div className="history-list-error">
                            <p>{error}</p>
                            <button onClick={fetchWorkouts} className="retry-button">
                                Retry
                            </button>
                        </div>
                    )}

                    {!loading && !error && workouts?.workouts.length === 0 && (
                        <div className="history-list-empty">
                            <p>No workout history yet</p>
                            <small>Complete your first workout to see it here!</small>
                        </div>
                    )}

                    {!loading && !error && workouts && workouts.workouts.length > 0 && (
                        <>
                            {workouts.workouts.map((workout, index) => (
                                <HistoryWorkoutCard
                                    key={workout.id}
                                    workout={workout}
                                    index={index}
                                    onClick={handleWorkoutClick}
                                />
                            ))}
                        </>
                    )}
                </div>

                {/* Workout Detail Popup */}
                {selectedWorkout && (
                    <WorkoutDetail
                        workout={selectedWorkout}
                        isClosing={isClosing}
                        onClose={handleCloseDetail}
                    />
                )}
            </div>
        </main>
    );
}