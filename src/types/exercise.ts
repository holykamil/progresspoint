// Base Exercise type
export interface Exercise {
    id: string;
    name: string;
}

// Exercise response from API
export interface ExerciseResponse {
    id: string;
    name: string;
}

// Workout page specific types
export interface WorkoutSet {
    id: string;
    weight: string;
    reps: string;
}

export interface PreviousSet {
    weight: number;
    reps: number;
}

export interface WorkoutExercise extends Exercise {
    sets: WorkoutSet[];
    previousSets?: PreviousSet[];
}