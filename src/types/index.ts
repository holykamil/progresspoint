// Central export file for all types
// This allows for cleaner imports like: import { Exercise, Workout, UserData } from '@/types'

// Exercise types
export type {
    Exercise,
    ExerciseResponse,
    WorkoutSet,
    PreviousSet,
    WorkoutExercise
} from './exercise';

// User types
export type {
    User,
    FavoriteExercise,
    UserData,
    SettingsUserData
} from './user';

// Workout types
export type {
    WorkoutSet as APIWorkoutSet,
    WorkoutExercise as APIWorkoutExercise,
    WorkoutUser,
    Workout,
    WorkoutsResponse,
    HistoryWorkoutCardProps,
    SubmitWorkoutExercise
} from './workout';
