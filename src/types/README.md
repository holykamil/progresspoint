# Types Documentation

This folder contains all TypeScript type definitions used across the application.

## Structure

### `exercise.ts`
Exercise-related types for the workout system.

- **`Exercise`** - Base exercise with id and name
- **`ExerciseResponse`** - API response format for exercises
- **`WorkoutSet`** - Individual set during workout (for UI state, with string values)
- **`PreviousSet`** - Historical set data (with number values)
- **`WorkoutExercise`** - Exercise with sets and optional previous workout data

### `user.ts`
User account and profile types.

- **`User`** - Basic user information (id, email, username, createdAt)
- **`FavoriteExercise`** - User's most performed exercise
- **`UserData`** - Complete user data including all stats from `/api/me` endpoint
- **`SettingsUserData`** - Simplified user data for settings page (just basic user info)

### `workout.ts`
Workout and workout history types.

- **`WorkoutSet`** - Set data from API (with number values)
- **`WorkoutExercise`** - Exercise within a workout from API
- **`WorkoutUser`** - Simplified user info attached to workouts
- **`Workout`** - Complete workout data from API
- **`WorkoutsResponse`** - Paginated list of workouts from API
- **`HistoryWorkoutCardProps`** - Props for HistoryWorkoutCard component
- **`SubmitWorkoutExercise`** - Exercise format for submitting new workouts

### `index.ts`
Central export file for convenient imports. Use it like:
```typescript
import { Exercise, UserData, Workout } from '@/types';
```

## Usage Guidelines

### Import Patterns

✅ **Recommended:**
```typescript
// Individual imports
import type { Exercise } from '@/types/exercise';
import type { UserData } from '@/types/user';
import type { Workout } from '@/types/workout';

// Or from index
import type { Exercise, UserData, Workout } from '@/types';
```

❌ **Avoid:**
```typescript
// Don't define duplicate types in component files
interface Exercise {
    id: string;
    name: string;
}
```

### Type Naming Conflicts

Note: There are two `WorkoutSet` types:
- **`exercise.ts`**: UI state version (string values for form inputs)
- **`workout.ts`**: API version (number values from backend)

Import explicitly when both are needed:
```typescript
import type { WorkoutSet as UIWorkoutSet } from '@/types/exercise';
import type { WorkoutSet as APIWorkoutSet } from '@/types/workout';
```

## Components Using These Types

### Exercise Types
- `AddExercises.tsx`
- `WorkoutPage.tsx`
- `StatsCard.tsx` (indirectly via UserData)

### User Types
- `HomePage.tsx`
- `UserPage.tsx`
- `SettingsPage.tsx`
- `SubmitWorkout.tsx`
- `userApi.ts`

### Workout Types
- `HomePage.tsx`
- `WorkoutPage.tsx`
- `HistoryWorkoutCard.tsx`
- `WorkoutCard.tsx`
- `WorkoutDetail.tsx`
- `RepeatWorkoutPage.tsx`
- `SubmitWorkout.tsx`

## Maintenance

When adding new types:
1. Add to the appropriate file (`exercise.ts`, `user.ts`, or `workout.ts`)
2. Export it from that file
3. Add re-export to `index.ts` if it will be widely used
4. Update this README
5. Remove any duplicate type definitions from component files
