export interface UserData {
    user: {
        id: string;
        email: string;
        username: string;
        createdAt: string;
    };
    totalWorkouts: number;
    currentStreak: number;
    days: string[];
    lastWorkoutDate: string;
}