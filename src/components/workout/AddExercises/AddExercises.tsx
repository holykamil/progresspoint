import { PiPulse } from "react-icons/pi";
import { useState, useEffect } from 'react';
import { RiCloseFill } from "react-icons/ri";
import { fetchWithAuth } from '@/lib/api';
import './AddExercises.css';

interface Exercise {
    id: string;
    name: string;
}

interface AddExercisesProps {
    onAddExercise: (exercise: Exercise) => void;
    onClose: () => void;
    alreadyAddedExerciseIds: string[]; // NEW: List of already added exercise IDs
}

export function AddExercises({ onAddExercise, onClose, alreadyAddedExerciseIds }: AddExercisesProps) {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchExercises();
    }, []);

    async function fetchExercises() {
        try {
            setLoading(true);
            setError(null);

            const response = await fetchWithAuth('/api/exercises');

            if (!response.ok) {
                throw new Error('Failed to fetch exercises');
            }

            const data: Exercise[] = await response.json();

            // Remove duplicates by name (keep first occurrence)
            const uniqueExercises = data.reduce((acc: Exercise[], current) => {
                const exists = acc.find(ex => ex.name === current.name);
                if (!exists) {
                    acc.push(current);
                }
                return acc;
            }, []);

            setExercises(uniqueExercises);
        } catch (err) {
            console.error('Error fetching exercises:', err);
            setError('Failed to load exercises. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    const handleAddExercise = (exercise: Exercise) => {
        onAddExercise(exercise);
    };

    // Filter out already added exercises
    const availableExercises = exercises.filter(
        exercise => !alreadyAddedExerciseIds.includes(exercise.id)
    );

    return (
        <div className='add-exercise-container'>
            <button className="close-popup-button" onClick={onClose}>
                <RiCloseFill className="close-icon" />
            </button>
            <div className='add-exercise-container-header'>Add an exercise</div>

            {loading && (
                <div className="exercises-loading">
                    <div className="exercises-loading-spinner"></div>
                    <p>Loading exercises...</p>
                </div>
            )}

            {error && (
                <div className="exercises-error">
                    <p>{error}</p>
                    <button onClick={fetchExercises} className="retry-button">
                        Retry
                    </button>
                </div>
            )}

            {!loading && !error && availableExercises.length === 0 && (
                <div className="exercises-empty">
                    <p>All exercises have been added</p>
                    <small>You've added all available exercises to your workout</small>
                </div>
            )}

            {!loading && !error && availableExercises.map((exercise) => (
                <div key={exercise.id} className='exercise-container'>
                    <PiPulse className="exercise-icon" />
                    <p className='exercise-name'>{exercise.name}</p>
                    <button
                        className='add-exercise-button'
                        onClick={() => handleAddExercise(exercise)}
                    >
                        +
                    </button>
                </div>
            ))}
        </div>
    );
}