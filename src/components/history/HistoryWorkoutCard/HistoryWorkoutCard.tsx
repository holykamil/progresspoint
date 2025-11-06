import type { Workout } from '@/types/workout';
import './HistoryWorkoutCard.css';

interface HistoryWorkoutCardProps {
    workout: Workout;
    index: number;
    onClick: (workoutId: string) => void;
    isSelected?: boolean; // NEW: For repeat workout page selection
    isSelectMode?: boolean; // NEW: Changes behavior for selection vs detail view
}

export function HistoryWorkoutCard({
    workout,
    index,
    onClick,
    isSelected = false,
    isSelectMode = false
}: HistoryWorkoutCardProps) {
    // Format date to DD.MM.YYYY
    const formatDate = (isoDate: string): string => {
        const date = new Date(isoDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    // Get comma-separated exercise names
    const getExerciseNames = (): string => {
        return workout.workoutExercises
            .map(we => we.exercise.name)
            .join(', ');
    };

    const workoutNote = workout.note || 'Untitled Workout';

    const containerClass = `history-workout-container ${isSelected && isSelectMode ? 'selected' : ''
        }`;

    return (
        <div
            className={containerClass}
            onClick={() => onClick(workout.id)}
            style={{ animationDelay: `${index * 0.1}s` }}
        >
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
    );
}