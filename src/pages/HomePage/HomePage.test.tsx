import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from './HomePage';
import * as userApi from '@/lib/userApi';
import * as api from '@/lib/api';

vi.mock('@/lib/userApi');
vi.mock('@/lib/api');
vi.mock('@/components/Header/Header', () => ({
    Header: () => <div data-testid="mock-header">Header</div>
}));

describe('HomePage', () => {
    const mockUserData = {
        user: {
            id: '1',
            email: 'test@example.com',
            username: 'testuser',
            createdAt: '2024-01-01'
        },
        totalWorkouts: 10,
        currentStreak: 5,
        days: [],
        lastWorkoutDate: '2024-11-20',
        totalVolume: 1000,
        totalExercisesUsed: 15,
        totalSets: 50,
        totalReps: 500,
        totalDuration: 300,
        heaviestWeight: 100,
        favoriteExercise: null
    };

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
            }
        ],
        pagination: {
            currentPage: 1,
            totalPages: 1,
            totalWorkouts: 1,
            limit: 10,
            hasNextPage: false,
            hasPreviousPage: false
        }
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(userApi, 'fetchUserData').mockResolvedValue(mockUserData);
        vi.spyOn(api, 'fetchWithAuth').mockResolvedValue({
            ok: true,
            json: async () => mockWorkoutsResponse
        } as Response);
    });

    const renderHomePage = () => {
        return render(
            <BrowserRouter>
                <HomePage />
            </BrowserRouter>
        );
    };

    it('renders the home page', () => {
        renderHomePage();
        expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    });

    it('displays loading state for workouts', () => {
        renderHomePage();
        expect(screen.getByText(/loading workouts/i)).toBeInTheDocument();
    });

    it('fetches and displays user data', async () => {
        renderHomePage();

        await waitFor(() => {
            expect(userApi.fetchUserData).toHaveBeenCalled();
        });
    });

    it('displays greeting with username', async () => {
        renderHomePage();

        await waitFor(() => {
            expect(screen.getByText(/Hello testuser/i)).toBeInTheDocument();
        });
    });

    it('displays stats cards when user data is loaded', async () => {
        renderHomePage();

        await waitFor(() => {
            expect(screen.getByText(/Some of your stats/i)).toBeInTheDocument();
        });
    });

    it('displays recent workouts section', async () => {
        renderHomePage();

        await waitFor(() => {
            expect(screen.getByText(/Recent workouts/i)).toBeInTheDocument();
        });
    });

    it('shows empty state when no workouts exist', async () => {
        vi.spyOn(api, 'fetchWithAuth').mockResolvedValue({
            ok: true,
            json: async () => ({ ...mockWorkoutsResponse, workouts: [] })
        } as Response);

        renderHomePage();

        await waitFor(() => {
            expect(screen.getByText(/No workouts yet/i)).toBeInTheDocument();
        });
    });

    it('handles workout fetch error', async () => {
        vi.spyOn(api, 'fetchWithAuth').mockResolvedValue({
            ok: false,
            json: async () => ({})
        } as Response);

        renderHomePage();

        await waitFor(() => {
            expect(screen.getByText(/Failed to load workouts/i)).toBeInTheDocument();
        });
    });

    it('displays retry button on error', async () => {
        vi.spyOn(api, 'fetchWithAuth').mockResolvedValue({
            ok: false,
            json: async () => ({})
        } as Response);

        renderHomePage();

        await waitFor(() => {
            const retryButton = screen.getByRole('button', { name: /retry/i });
            expect(retryButton).toBeInTheDocument();
        });
    });
});
