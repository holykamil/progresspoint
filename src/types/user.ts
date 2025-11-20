// Basic user information
export interface User {
    id: string;
    email: string;
    username: string;
    createdAt: string;
}

// Favorite exercise details
export interface FavoriteExercise {
    id: string;
    name: string;
    category: string;
}

// Complete user data with stats (from /api/me)
export interface UserData {
    user: User;
    totalWorkouts: number;
    currentStreak: number;
    days: string[];
    lastWorkoutDate: string;
    totalVolume: number;
    totalExercisesUsed: number;
    totalSets: number;
    totalReps: number;
    totalDuration: number;
    heaviestWeight: number;
    favoriteExercise: FavoriteExercise | null;
}

// Settings page specific user data (simplified)
export interface SettingsUserData {
    user: User;
}