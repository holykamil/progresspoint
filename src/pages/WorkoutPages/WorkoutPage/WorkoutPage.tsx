import { Header } from "@/components/Header/Header"
import { AddExercises } from "@/components/workout/AddExercises/AddExercises"
import { SubmitWorkout } from "@/components/workout/SubmitWorkout/SubmitWorkout"
import { ExitWarningPopup } from "@/components/workout/ExitWarningPopup/ExitWarningPopup"
import { useState, useEffect, useRef } from "react"
import { useNavigate, useBlocker, useLocation } from "react-router-dom"
import { MdOutlineTimer } from "react-icons/md";
import './WorkoutPage.css'
import type { Workout } from "@/types/workout"

interface Exercise {
    id: string;
    name: string;
}

interface WorkoutExercise extends Exercise {
    sets: Set[];
    previousSets?: Array<{ weight: number; reps: number }>;
}

interface Set {
    id: string;
    weight: string;
    reps: string;
}

export function WorkoutPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const repeatWorkout = location.state?.repeatWorkout as Workout | undefined;

    const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
    const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false);
    const [isSubmitWorkoutOpen, setIsSubmitWorkoutOpen] = useState(false);
    const [isExitWarningOpen, setIsExitWarningOpen] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(true);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
    const [isWorkoutSubmitted, setIsWorkoutSubmitted] = useState(false);

    // Initialize workout from repeat data
    useEffect(() => {
        if (repeatWorkout && repeatWorkout.workoutExercises) {
            const initialExercises: WorkoutExercise[] = repeatWorkout.workoutExercises
                .sort((a, b) => a.order - b.order)
                .map(workoutExercise => {
                    // Create first empty set
                    const firstSet: Set = {
                        id: `${workoutExercise.exerciseId}-set-${Date.now()}-0`,
                        weight: '',
                        reps: ''
                    };

                    return {
                        id: workoutExercise.exerciseId,
                        name: workoutExercise.exercise.name,
                        sets: [firstSet], // Auto-add first set
                        previousSets: workoutExercise.sets.map(set => ({
                            weight: set.weight,
                            reps: set.repetitions
                        }))
                    };
                });
            setWorkoutExercises(initialExercises);
        }
    }, [repeatWorkout]);

    // Block navigation when there are exercises
    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            workoutExercises.length > 0 &&
            !isWorkoutSubmitted &&
            currentLocation.pathname !== nextLocation.pathname
    );

    // Handle blocked navigation
    useEffect(() => {
        if (blocker.state === "blocked") {
            setIsExitWarningOpen(true);
            setPendingNavigation(blocker.location?.pathname || null);
        }
    }, [blocker]);

    // Timer effect
    useEffect(() => {
        if (isTimerRunning) {
            timerRef.current = setInterval(() => {
                setElapsedSeconds(prev => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isTimerRunning]);

    // Format time as MM:SS
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAddExercise = (exercise: Exercise) => {
        // Create first empty set automatically
        const firstSet: Set = {
            id: `${exercise.id}-set-${Date.now()}-0`,
            weight: '',
            reps: ''
        };

        const newWorkoutExercise: WorkoutExercise = {
            ...exercise,
            sets: [firstSet] // Auto-add first set
        };
        setWorkoutExercises([...workoutExercises, newWorkoutExercise]);
        setIsAddExerciseOpen(false);
    };

    const handleAddSet = (exerciseId: string) => {
        setWorkoutExercises(workoutExercises.map(exercise => {
            if (exercise.id === exerciseId) {
                const newSet: Set = {
                    id: `${exerciseId}-set-${Date.now()}-${exercise.sets.length}`,
                    weight: '',
                    reps: ''
                };
                return {
                    ...exercise,
                    sets: [...exercise.sets, newSet]
                };
            }
            return exercise;
        }));
    };

    const handleSetChange = (exerciseId: string, setId: string, field: 'weight' | 'reps', value: string) => {
        setWorkoutExercises(workoutExercises.map(exercise => {
            if (exercise.id === exerciseId) {
                return {
                    ...exercise,
                    sets: exercise.sets.map(set =>
                        set.id === setId ? { ...set, [field]: value } : set
                    )
                };
            }
            return exercise;
        }));
    };

    const handleRemoveSet = (exerciseId: string, setId: string) => {
        setWorkoutExercises(workoutExercises.map(exercise => {
            if (exercise.id === exerciseId) {
                return {
                    ...exercise,
                    sets: exercise.sets.filter(set => set.id !== setId)
                };
            }
            return exercise;
        }));
    };

    const handleFinishWorkout = () => {
        setIsTimerRunning(false);
        setIsSubmitWorkoutOpen(true);
    };

    const handleExitWarningCancel = () => {
        setIsExitWarningOpen(false);
        setPendingNavigation(null);
        if (blocker.state === "blocked") {
            blocker.reset();
        }
    };

    const handleExitWarningDiscard = () => {
        setIsExitWarningOpen(false);
        setIsWorkoutSubmitted(true);
        setWorkoutExercises([]);

        setTimeout(() => {
            if (blocker.state === "blocked") {
                blocker.proceed();
            } else {
                navigate(pendingNavigation || '/home');
            }
        }, 0);
    };

    const handleWorkoutSubmitted = async () => {
        setIsWorkoutSubmitted(true);
        setWorkoutExercises([]);
        setElapsedSeconds(0);

        await new Promise(resolve => setTimeout(resolve, 10));
        navigate(pendingNavigation || '/home');
    };

    // Get previous set info for a specific set index
    const getPreviousSetInfo = (exerciseId: string, currentSetIndex: number): string => {
        const exercise = workoutExercises.find(ex => ex.id === exerciseId);
        if (!exercise) return '-';

        // If repeating workout, show historical data from previousSets
        if (exercise.previousSets && exercise.previousSets[currentSetIndex]) {
            const prevSet = exercise.previousSets[currentSetIndex];
            return `${prevSet.weight}x${prevSet.reps}`;
        }

        return '-';
    };

    // Get list of already added exercise IDs
    const addedExerciseIds = workoutExercises.map(ex => ex.id);

    return (
        <main className="workout-page">
            <Header />
            <div className="workout-page-content">
                <div className='current-workout'>
                    <div className="current-workout-header">
                        <div className="header-left">
                            <h1 className="workout-title">New workout</h1>
                            <p className="workout-subtitle">Add more exercises or finish workout</p>
                        </div>
                        <div className="header-right">
                            <div className="workout-timer">
                                <MdOutlineTimer className="timer-icon" />
                                <span className="timer-text">{formatTime(elapsedSeconds)}</span>
                            </div>
                            <button
                                className="finish-workout-button"
                                disabled={workoutExercises.length === 0}
                                onClick={handleFinishWorkout}
                            >
                                FINISH
                            </button>
                        </div>
                    </div>

                    {workoutExercises.length === 0 ? (
                        <div className="empty-workout-message">
                            <p>No exercises added yet</p>
                            <p className="empty-workout-subtitle">Click the button below to add your first exercise</p>
                        </div>
                    ) : (
                        <div className="workout-exercises-list">
                            {workoutExercises.map((exercise) => (
                                <div key={exercise.id} className="workout-exercise-card">
                                    <div className="workout-exercise-header">
                                        <h2 className="workout-exercise-name">{exercise.name}</h2>
                                    </div>

                                    {exercise.sets.length > 0 && (
                                        <div className="sets-container">
                                            <div className="sets-header">
                                                <span className="set-label">SET</span>
                                                <span className="previous-label">PREVIOUSLY</span>
                                                <span className="weight-label">KG</span>
                                                <span className="reps-label">REPS</span>
                                                <span className="actions-label"></span>
                                            </div>
                                            {exercise.sets.map((set, index) => (
                                                <div key={set.id} className="set-row">
                                                    <span className="set-number">{index + 1}</span>
                                                    <span className="previous-set">
                                                        {getPreviousSetInfo(exercise.id, index)}
                                                    </span>
                                                    <input
                                                        type="number"
                                                        className="weight-input"
                                                        placeholder="0"
                                                        value={set.weight}
                                                        onChange={(e) => handleSetChange(exercise.id, set.id, 'weight', e.target.value)}
                                                    />
                                                    <input
                                                        type="number"
                                                        className="reps-input"
                                                        placeholder="0"
                                                        value={set.reps}
                                                        onChange={(e) => handleSetChange(exercise.id, set.id, 'reps', e.target.value)}
                                                    />
                                                    <button
                                                        className="remove-set-button"
                                                        onClick={() => handleRemoveSet(exercise.id, set.id)}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <button
                                        className="add-set-button"
                                        onClick={() => handleAddSet(exercise.id)}
                                    >
                                        +
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        className="add-exercise-main-button"
                        onClick={() => setIsAddExerciseOpen(true)}
                    >
                        + Add an exercise
                    </button>
                </div>
            </div>

            {isAddExerciseOpen && (
                <>
                    <div
                        className="popup-overlay"
                        onClick={() => setIsAddExerciseOpen(false)}
                    />
                    <div className="popup-container">
                        <AddExercises
                            onAddExercise={handleAddExercise}
                            onClose={() => setIsAddExerciseOpen(false)}
                            alreadyAddedExerciseIds={addedExerciseIds}
                        />
                    </div>
                </>
            )}

            {isSubmitWorkoutOpen && (
                <SubmitWorkout
                    workoutExercises={workoutExercises}
                    durationMinutes={Math.floor(elapsedSeconds / 60)}
                    onClose={() => {
                        setIsSubmitWorkoutOpen(false);
                        setIsTimerRunning(true);
                    }}
                    onSubmit={handleWorkoutSubmitted}
                />
            )}

            {isExitWarningOpen && (
                <ExitWarningPopup
                    onCancel={handleExitWarningCancel}
                    onDiscard={handleExitWarningDiscard}
                />
            )}
        </main>
    )
}