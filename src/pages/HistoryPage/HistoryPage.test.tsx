/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HistoryPage } from './HistoryPage';
import * as api from '@/lib/api';

vi.mock('@/lib/api');
vi.mock('@/components/Header/Header', () => ({
    Header: () => <div data-testid="mock-header">Header</div>
}));
vi.mock('@/components/history/HistoryWorkoutCard/HistoryWorkoutCard', () => ({
    HistoryWorkoutCard: ({ workout, onClick }: any) => (
        <div data-testid="workout-card" onClick={() => onClick(workout.id)}>
            {workout.note}
        </div>
    )
}));
vi.mock('@/components/workout/WorkoutDetail/WorkoutDetail', () => ({
    WorkoutDetail: ({ workout, onClose }: any) => (
        <div data-testid="workout-detail">
            <button onClick={onClose}>Close</button>
            {workout.note}
        </div>
    )
}));

describe('HistoryPage', () => {
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

    const renderHistoryPage = () => {
        return render(
            <BrowserRouter>
                <HistoryPage />
            </BrowserRouter>
        );
    };

    it('renders the history page', () => {
        vi.spyOn(api, 'fetchWithAuth').mockResolvedValue({
            ok: true,
            json: async () => mockWorkoutsResponse
        } as Response);

        renderHistoryPage();
        expect(screen.getByTestId('mock-header')).toBeInTheDocument();
        const historyTexts = screen.getAllByText(/Workout history/i);
        expect(historyTexts.length).toBeGreaterThan(0);
    });

    it('displays loading state initially', () => {
        vi.spyOn(api, 'fetchWithAuth').mockImplementation(() => new Promise(() => { }));

        renderHistoryPage();
        expect(screen.getByText(/Loading workout history/i)).toBeInTheDocument();
    });

    it('fetches and displays workout history', async () => {
        vi.spyOn(api, 'fetchWithAuth').mockResolvedValue({
            ok: true,
            json: async () => mockWorkoutsResponse
        } as Response);

        renderHistoryPage();

        await waitFor(() => {
            const workoutCards = screen.getAllByTestId('workout-card');
            expect(workoutCards).toHaveLength(2);
        });
    });

    it('displays empty state when no workouts exist', async () => {
        vi.spyOn(api, 'fetchWithAuth').mockResolvedValue({
            ok: true,
            json: async () => ({ ...mockWorkoutsResponse, workouts: [] })
        } as Response);

        renderHistoryPage();

        await waitFor(() => {
            expect(screen.getByText(/No workout history yet/i)).toBeInTheDocument();
        });
    });

    it('handles fetch error gracefully', async () => {
        vi.spyOn(api, 'fetchWithAuth').mockResolvedValue({
            ok: false,
            json: async () => ({})
        } as Response);

        renderHistoryPage();

        await waitFor(() => {
            expect(screen.getByText(/Failed to load workout history/i)).toBeInTheDocument();
        });
    });

    it('displays retry button on error', async () => {
        vi.spyOn(api, 'fetchWithAuth').mockResolvedValue({
            ok: false,
            json: async () => ({})
        } as Response);

        renderHistoryPage();

        await waitFor(() => {
            const retryButton = screen.getByRole('button', { name: /retry/i });
            expect(retryButton).toBeInTheDocument();
        });
    });

    it('opens workout detail when card is clicked', async () => {
        vi.spyOn(api, 'fetchWithAuth').mockResolvedValue({
            ok: true,
            json: async () => mockWorkoutsResponse
        } as Response);

        renderHistoryPage();

        await waitFor(() => {
            const workoutCards = screen.getAllByTestId('workout-card');
            fireEvent.click(workoutCards[0]);
        });

        await waitFor(() => {
            expect(screen.getByTestId('workout-detail')).toBeInTheDocument();
        });
    });

    it('closes workout detail when close button is clicked', async () => {
        vi.spyOn(api, 'fetchWithAuth').mockResolvedValue({
            ok: true,
            json: async () => mockWorkoutsResponse
        } as Response);

        renderHistoryPage();

        await waitFor(() => {
            const workoutCards = screen.getAllByTestId('workout-card');
            fireEvent.click(workoutCards[0]);
        });

        await waitFor(() => {
            const closeButton = screen.getByRole('button', { name: /close/i });
            fireEvent.click(closeButton);
        });

        await waitFor(() => {
            expect(screen.queryByTestId('workout-detail')).not.toBeInTheDocument();
        }, { timeout: 500 });
    });
});
