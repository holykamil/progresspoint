import type { Workout } from '@/types/workout';
import AccountLogo from '@/assets/images/account-image.png';
import { formatDate } from '@/lib/date';
import './WorkoutCard.css';

interface WorkoutCardProps {
    workout: Workout;
    index: number;
    onClick: (workoutId: string) => void;
}

export function WorkoutCard({ workout, index, onClick }: WorkoutCardProps) {


    // Get comma-separated exercise names
    const getExerciseNames = (): string => {
        return workout.workoutExercises
            .map(we => we.exercise.name)
            .join(', ');
    };

    // Calculate total sets across all exercises
    const getTotalSets = (): number => {
        return workout.workoutExercises.reduce(
            (total, we) => total + we.sets.length,
            0
        );
    };

    const totalSets = getTotalSets();

    return (<>
        <div
            className="workout-minimal-container"
            onClick={() => onClick(workout.id)}
            style={{ animationDelay: `${index * 0.1}s` }}
        >

            <div className="workout-minimal-left-column">
                <div className="workout-minimal-account-logo-container">
                    <img src={AccountLogo} alt="Account Logo" />
                </div>
            </div>
            {/* Left Column - Main Content */}
            <div className="workout-minimal-right-column">
                <div className="workout-minimal-general-info">
                    <p className="workout-minimal-username">
                        {workout.user.username}
                    </p>
                    <p className="workout-minimal-date">
                        {formatDate(workout.createdAt)}
                    </p>
                </div>

                <div className="workout-minimal-note-row">
                    <p className="workout-minimal-note">{workout.note}</p>
                </div>

                <div className="workout-minimal-exercises-row">
                    <p className="workout-minimal-exercises">{getExerciseNames()}</p>
                </div>

                <div className="workout-minimal-sets-row">
                    <p className="workout-minimal-sets">{totalSets} sets</p>
                </div>
            </div>

            {/* Right Column - Account Logo */}

        </div>



    </>

    );
}