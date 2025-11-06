import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/lib/api';
import type { WorkoutsResponse, Workout } from '@/types/workout';
import type { UserData } from '@/types/user';

import { Header } from '@/components/Header/Header';
import { WorkoutCard } from '@/components/workout/WorkoutCard/WorkoutCard';
import { WorkoutDetail } from '@/components/workout/WorkoutDetail/WorkoutDetail';
import './HomePage.css';

export function HomePage() {
    const [workouts, setWorkouts] = useState<WorkoutsResponse | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
    const [isClosing, setIsClosing] = useState(false);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);


    useEffect(() => {
        fetchUserData();
        fetchWorkouts();
    }, []);


    // Typing animation effect
    useEffect(() => {
        if (!userData) return;

        const fullText = `Hello ${userData.user.username}, what are we training today?`;
        setIsTyping(true);
        setDisplayedText('');

        let currentIndex = 0;
        const typingSpeed = 50; // milliseconds per character

        const typingInterval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setDisplayedText(fullText.slice(0, currentIndex));
                currentIndex++;
            } else {
                setIsTyping(false);
                clearInterval(typingInterval);
            }
        }, typingSpeed);

        return () => clearInterval(typingInterval);
    }, [userData]);

    async function fetchUserData() {
        try {
            const response = await fetchWithAuth('/api/me');

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const data: UserData = await response.json();
            setUserData(data);
        } catch (err) {
            console.error('Error fetching user data:', err);
            // Don't set error here, let workouts error handling show
        }
    }

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
            setError('Failed to load workouts. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    function handleWorkoutClick(workoutId: string) {
        const workout = workouts?.workouts.find(w => w.id === workoutId);
        if (workout) {
            setSelectedWorkout(workout);
            setIsClosing(false); // Reset closing state when opening

        }
    }

    function handleCloseDetail() {
        setIsClosing(true);
        // Wait for animation to complete before unmounting
        setTimeout(() => {
            setSelectedWorkout(null);
            setIsClosing(false);
        }, 300); // Match the animation duration (0.3s)
    }

    const shouldRenderWorkoutDetail = selectedWorkout || isClosing;

    return (
        <main className="home-page">
            <Header />
            <div className="home-page-content">

                <div className='home-page-header'>
                    {displayedText}
                    {isTyping && <span className="typing-cursor">|</span>}
                </div>

                <div className="recent-workouts-list">
                    {loading && (
                        <div className="workout-list-loading">
                            <div className="workout-list-loading-spinner"></div>
                            <p>Loading workouts...</p>
                        </div>
                    )}

                    {error && (
                        <div className="workout-list-error">
                            <p>{error}</p>
                            <button onClick={fetchWorkouts} className="retry-button">
                                Retry
                            </button>
                        </div>
                    )}

                    {!loading && !error && workouts?.workouts.length === 0 && (
                        <div className="workout-list-empty">
                            <p>No workouts yet</p>
                            <small>Start tracking your first workout!</small>
                        </div>
                    )}

                    {!loading && !error && workouts && workouts.workouts.length > 0 && (
                        <>
                            {workouts.workouts.map((workout, index) => (
                                <WorkoutCard
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
                {shouldRenderWorkoutDetail && selectedWorkout && (
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