// Workout type definitions
export interface WorkoutSet {
    id: string;
    workoutExerciseId: string;
    setNumber: number;
    repetitions: number;
    weight: number;
}

export interface Exercise {
    id: string;
    name: string
}

export interface WorkoutExercise {
    id: string;
    workoutId: string;
    exerciseId: string;
    order: number;
    exercise: Exercise;
    sets: WorkoutSet[];
}

export interface WorkoutUser {
    id: string;
    username: string;
}

export interface Workout {
    id: string;
    userId: string;
    startedAt: string;
    durationMinutes: number;
    note: string;
    isTemplate: boolean;
    createdAt: string;
    user: WorkoutUser;
    workoutExercises: WorkoutExercise[];
}

export interface WorkoutsResponse {
    workouts: Workout[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalWorkouts: number;
        limit: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

export interface HistoryWorkoutCardProps {
    workout: Workout;
    index: number;
    onClick: (workoutId: string) => void;
}