import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { RepeatWorkoutPage } from './RepeatWorkoutPage';
import * as api from '@/lib/api';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('@/lib/api');
vi.mock('@/components/Header/Header', () => ({
    Header: () => <div data-testid="mock-header">Header</div>
}));
vi.mock('@/components/history/HistoryWorkoutCard/HistoryWorkoutCard', () => ({
    HistoryWorkoutCard: ({ workout, onClick, isSelected }: { workout: any; onClick: (id: string) => void; isSelected: boolean }) => (
        <div
            data-testid="workout-card"
            onClick={() => onClick(workout.id)}
            className={isSelected ? 'selected' : ''}
        >
            {workout.note}
        </div>
    )
}));
vi.mock('@/components/workout/WorkoutDetail/WorkoutDetail', () => ({
    WorkoutDetail: ({ workout, onClose }: { workout: any; onClose: () => void }) => (
        <div data-testid="workout-detail">
            <button onClick={onClose}>Close</button>
            {workout.note}
        </div>
    )
}));

describe('RepeatWorkoutPage', () => {
    const mockWorkoutsResponse = {
        workouts: [
            {
                id: '1',
                userId: '1',
                startedAt: '2024-11-20T10:00:00Z',
                durationMinutes: 45,
                note: 'Morning workout',
                isTemplate: false,
                createdAt: '2024-11-20T10:00:00Z',
                user: { id: '1', username: 'testuser' },
                workoutExercises: []
            },
            {
                id: '2',
                userId: '1',
                startedAt: '2024-11-19T10:00:00Z',
                durationMinutes: 30,
                note: 'Evening workout',
                isTemplate: false,
                createdAt: '2024-11-19T10:00:00Z',
                user: { id: '1', username: 'testuser' },
                workoutExercises: []
            }
        ],
        pagination: {
            currentPage: 1,
            totalPages: 1,
            totalWorkouts: 2,
            limit: 10,
            hasNextPage: false,
            hasPreviousPage: false
        }
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderRepeatWorkoutPage = () => {
        return render(
            <BrowserRouter>
                <RepeatWorkoutPage />
            </BrowserRouter>
        );
    };

    it('renders the repeat workout page', () => {
        vi.spyOn(api, 'fetchWithAuth').mockResolvedValue({
            ok: true,
            json: async () => mockWorkoutsResponse
        } as Response);

        renderRepeatWorkoutPage();
        expect(screen.getByTestId('mock-header')).toBeInTheDocument();
        expect(screen.getByText(/Repeat workout/i)).toBeInTheDocument();
    });

    it('displays loading state initially', () => {
        vi.spyOn(api, 'fetchWithAuth').mockImplementation(() => new Promise(() => { }));

        renderRepeatWorkoutPage();
        expect(screen.getByText(/Loading workout history/i)).toBeInTheDocument();
    });

    it('fetches and displays workouts', async () => {
        vi.spyOn(api, 'fetchWithAuth').mockResolvedValue({
            ok: true,
            json: async () => mockWorkoutsResponse
        } as Response);

        renderRepeatWorkoutPage();

        await waitFor(() => {
            const workoutCards = screen.getAllByTestId('workout-card');
            expect(workoutCards).toHaveLength(2);
        });
    });

    it('selects workout when clicked', async () => {
        vi.spyOn(api, 'fetchWithAuth').mockResolvedValue({
            ok: true,
            json: async () => mockWorkoutsResponse
        } as Response);

        renderRepeatWorkoutPage();

        await waitFor(() => {
            const workoutCards = screen.getAllByTestId('workout-card');
            fireEvent.click(workoutCards[0]);
        });

        await waitFor(() => {
            const workoutCards = screen.getAllByTestId('workout-card');
            expect(workoutCards[0]).toHaveClass('selected');
        });
    });

    it('deselects workout when clicked again', async () => {
        vi.spyOn(api, 'fetchWithAuth').mockResolvedValue({
            ok: true,
            json: async () => mockWorkoutsResponse
        } as Response);

        renderRepeatWorkoutPage();

        await waitFor(() => {
            const workoutCards = screen.getAllByTestId('workout-card');
            fireEvent.click(workoutCards[0]);
            fireEvent.click(workoutCards[0]);
        });

        await waitFor(() => {
            const workoutCards = screen.getAllByTestId('workout-card');
            expect(workoutCards[0]).not.toHaveClass('selected');
        });
    });

    it('enables START button when workout is selected', async () => {
        vi.spyOn(api, 'fetchWithAuth').mockResolvedValue({
            ok: true,
            json: async () => mockWorkoutsResponse
        } as Response);

        renderRepeatWorkoutPage();

        await waitFor(() => {
            const workoutCards = screen.getAllByTestId('workout-card');
            fireEvent.click(workoutCards[0]);
        });

        await waitFor(() => {
            const startButton = screen.getByRole('button', { name: /START/i });
            expect(startButton).not.toBeDisabled();
        });
    });

    it('disables START button when no workout is selected', async () => {
        vi.spyOn(api, 'fetchWithAuth').mockResolvedValue({
            ok: true,
            json: async () => mockWorkoutsResponse
        } as Response);

        renderRepeatWorkoutPage();

        await waitFor(() => {
            const startButton = screen.getByRole('button', { name: /START/i });
            expect(startButton).toBeDisabled();
        });
    });

    it('navigates to workout page with selected workout', async () => {
        vi.spyOn(api, 'fetchWithAuth').mockResolvedValue({
            ok: true,
            json: async () => mockWorkoutsResponse
        } as Response);

        renderRepeatWorkoutPage();

        await waitFor(() => {
            const workoutCards = screen.getAllByTestId('workout-card');
            fireEvent.click(workoutCards[0]);
        });

        const startButton = screen.getByRole('button', { name: /START/i });
        fireEvent.click(startButton);

        expect(mockNavigate).toHaveBeenCalledWith('/workout', expect.any(Object));
    });

    it('displays empty state when no workouts', async () => {
        vi.spyOn(api, 'fetchWithAuth').mockResolvedValue({
            ok: true,
            json: async () => ({ ...mockWorkoutsResponse, workouts: [] })
        } as Response);

        renderRepeatWorkoutPage();

        await waitFor(() => {
            expect(screen.getByText(/No workout history yet/i)).toBeInTheDocument();
        });
    });

    it('handles fetch error', async () => {
        vi.spyOn(api, 'fetchWithAuth').mockResolvedValue({
            ok: false,
            json: async () => ({})
        } as Response);

        renderRepeatWorkoutPage();

        await waitFor(() => {
            expect(screen.getByText(/Failed to load workout history/i)).toBeInTheDocument();
        });
    });

    it('shows load more button when there are more workouts', async () => {
        const manyWorkouts = {
            workouts: Array.from({ length: 10 }, (_, i) => ({
                id: `${i + 1}`,
                userId: '1',
                startedAt: '2024-11-20T10:00:00Z',
                durationMinutes: 45,
                note: `Workout ${i + 1}`,
                isTemplate: false,
                createdAt: '2024-11-20T10:00:00Z',
                user: { id: '1', username: 'testuser' },
                workoutExercises: []
            })),
            pagination: mockWorkoutsResponse.pagination
        };

        vi.spyOn(api, 'fetchWithAuth').mockResolvedValue({
            ok: true,
            json: async () => manyWorkouts
        } as Response);

        renderRepeatWorkoutPage();

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Load More/i })).toBeInTheDocument();
        });
    });

    it('loads more workouts when load more is clicked', async () => {
        const manyWorkouts = {
            workouts: Array.from({ length: 10 }, (_, i) => ({
                id: `${i + 1}`,
                userId: '1',
                startedAt: '2024-11-20T10:00:00Z',
                durationMinutes: 45,
                note: `Workout ${i + 1}`,
                isTemplate: false,
                createdAt: '2024-11-20T10:00:00Z',
                user: { id: '1', username: 'testuser' },
                workoutExercises: []
            })),
            pagination: mockWorkoutsResponse.pagination
        };

        vi.spyOn(api, 'fetchWithAuth').mockResolvedValue({
            ok: true,
            json: async () => manyWorkouts
        } as Response);

        renderRepeatWorkoutPage();

        await waitFor(() => {
            const workoutCards = screen.getAllByTestId('workout-card');
            expect(workoutCards).toHaveLength(4);
        });

        const loadMoreButton = screen.getByRole('button', { name: /Load More/i });
        fireEvent.click(loadMoreButton);

        await waitFor(() => {
            const workoutCards = screen.getAllByTestId('workout-card');
            expect(workoutCards).toHaveLength(8);
        });
    });
});
