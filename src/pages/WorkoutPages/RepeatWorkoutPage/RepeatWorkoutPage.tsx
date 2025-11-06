import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header/Header"
import { HistoryWorkoutCard } from '@/components/history/HistoryWorkoutCard/HistoryWorkoutCard';
import { WorkoutDetail } from "@/components/workout/WorkoutDetail/WorkoutDetail";
import { fetchWithAuth } from "@/lib/api";
import type { WorkoutsResponse, Workout } from "@/types/workout";
import './RepeatWorkoutPage.css'

export function RepeatWorkoutPage() {
    const navigate = useNavigate();
    const [workouts, setWorkouts] = useState<WorkoutsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);
    const [detailWorkout, setDetailWorkout] = useState<Workout | null>(null);
    const [isClosing, setIsClosing] = useState(false);
    const [displayCount, setDisplayCount] = useState(4); // Show 4 workouts initially

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
        // If clicking the same workout, deselect it
        if (selectedWorkoutId === workoutId) {
            setSelectedWorkoutId(null);
        } else {
            setSelectedWorkoutId(workoutId);
        }
    }



    function handleCloseDetail() {
        setIsClosing(true);
        setTimeout(() => {
            setDetailWorkout(null);
            setIsClosing(false);
        }, 300);
    }

    function handleStartWorkout() {
        if (selectedWorkoutId) {
            const workout = workouts?.workouts.find(w => w.id === selectedWorkoutId);
            if (workout) {
                // Navigate to WorkoutPage with workout data
                navigate('/workout', {
                    state: { repeatWorkout: workout }
                });
            }
        }
    }

    function handleLoadMore() {
        setDisplayCount(prev => prev + 4);
    }

    const displayedWorkouts = workouts?.workouts.slice(0, displayCount) || [];
    const hasMore = (workouts?.workouts.length || 0) > displayCount;

    return (
        <div className='repeat-workout-page'>
            <Header />
            <div className='repeat-workout-page-content'>
                <h1 className='repeat-workout-header'>Repeat workout</h1>

                <div className="repeat-workouts-list">
                    {loading && (
                        <div className="repeat-workout-list-loading">
                            <div className="repeat-workout-list-loading-spinner"></div>
                            <p>Loading workout history...</p>
                        </div>
                    )}

                    {error && (
                        <div className="repeat-workout-list-error">
                            <p>{error}</p>
                            <button onClick={fetchWorkouts} className="retry-button">
                                Retry
                            </button>
                        </div>
                    )}

                    {!loading && !error && workouts?.workouts.length === 0 && (
                        <div className="repeat-workout-list-empty">
                            <p>No workout history yet</p>
                            <small>Complete your first workout to see it here!</small>
                        </div>
                    )}

                    {!loading && !error && displayedWorkouts.length > 0 && (
                        <>
                            {displayedWorkouts.map((workout, index) => (
                                <HistoryWorkoutCard
                                    key={workout.id}
                                    workout={workout}
                                    index={index}
                                    onClick={handleWorkoutClick}
                                    isSelected={selectedWorkoutId === workout.id}
                                    isSelectMode={true}
                                />
                            ))}
                        </>
                    )}
                </div>

                <div className="repeat-workout-actions">
                    {hasMore && !loading && (
                        <button
                            className='load-more-history-button'
                            onClick={handleLoadMore}
                        >
                            Load More
                        </button>
                    )}

                    <button
                        className={`start-repeat-workout-button ${selectedWorkoutId ? 'active' : 'disabled'}`}
                        onClick={handleStartWorkout}
                        disabled={!selectedWorkoutId}
                    >
                        START
                    </button>
                </div>

                {/* Workout Detail Popup */}
                {detailWorkout && (
                    <WorkoutDetail
                        workout={detailWorkout}
                        isClosing={isClosing}
                        onClose={handleCloseDetail}
                    />
                )}
            </div>
        </div>
    )
}