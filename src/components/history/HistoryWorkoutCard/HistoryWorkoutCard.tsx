import type { HistoryWorkoutCardProps } from '@/types/workout';
import { formatDate } from '@/lib/date';
import './HistoryWorkoutCard.css';

export function HistoryWorkoutCard({
    workout,
    index,
    onClick,
    isSelected = false,
    isSelectMode = false
}: HistoryWorkoutCardProps) {
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