/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UserPage } from './UserPage';
import * as userApi from '@/lib/userApi';

vi.mock('@/lib/userApi');
vi.mock('@/components/Header/Header', () => ({
    Header: () => <div data-testid="mock-header">Header</div>
}));
vi.mock('@/components/stats/StatsCard/StatsCard', () => ({
    StatsCard: ({ label, value }: any) => (
        <div data-testid="stats-card">
            {label}: {value}
        </div>
    )
}));

describe('UserPage', () => {
    const mockUserData = {
        user: {
            id: '1',
            email: 'test@example.com',
            username: 'testuser',
            createdAt: '2024-01-01T00:00:00Z',
            profileImageUrl: null

        },
        totalWorkouts: 10,
        currentStreak: 5,
        days: [],
        lastWorkoutDate: '2024-11-20T00:00:00Z',
        totalVolume: 1000,
        totalExercisesUsed: 15,
        totalSets: 50,
        totalReps: 500,
        totalDuration: 300,
        heaviestWeight: 100,
        favoriteExercise: {
            id: '1',
            name: 'Bench Press',
            category: 'Chest'
        }
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(userApi, 'fetchUserData').mockResolvedValue(mockUserData);
        vi.spyOn(userApi, 'fetchProfilePicture').mockResolvedValue(null);
    });

    const renderUserPage = () => {
        return render(
            <BrowserRouter>
                <UserPage />
            </BrowserRouter>
        );
    };

    it('renders the user page', () => {
        renderUserPage();
        expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    });

    it('fetches and displays user data', async () => {
        renderUserPage();

        await waitFor(() => {
            expect(userApi.fetchUserData).toHaveBeenCalled();
        });
    });

    it('displays username', async () => {
        renderUserPage();

        await waitFor(() => {
            expect(screen.getByText('testuser')).toBeInTheDocument();
        });
    });

    it('displays joined date', async () => {
        renderUserPage();

        await waitFor(() => {
            expect(screen.getByText(/Joined/i)).toBeInTheDocument();
        });
    });

    it('displays last workout date', async () => {
        renderUserPage();

        await waitFor(() => {
            expect(screen.getByText(/Last workout/i)).toBeInTheDocument();
        });
    });

    it('displays streak information', async () => {
        renderUserPage();

        await waitFor(() => {
            expect(screen.getByText(/5 days/i)).toBeInTheDocument();
        });
    });

    it('displays total workouts', async () => {
        renderUserPage();

        await waitFor(() => {
            expect(screen.getByText(/Total workouts/i)).toBeInTheDocument();
        });
    });

    it('renders stats section', async () => {
        renderUserPage();

        await waitFor(() => {
            expect(screen.getByText(/Stats/i)).toBeInTheDocument();
        });
    });

    it('renders all stat cards', async () => {
        renderUserPage();

        await waitFor(() => {
            const statCards = screen.getAllByTestId('stats-card');
            expect(statCards.length).toBeGreaterThan(0);
        });
    });

    it('displays favorite exercise', async () => {
        renderUserPage();

        await waitFor(() => {
            expect(screen.getByText(/Bench Press/i)).toBeInTheDocument();
        });
    });

    it('displays N/A when no favorite exercise', async () => {
        vi.spyOn(userApi, 'fetchUserData').mockResolvedValue({
            ...mockUserData,
            favoriteExercise: null
        });

        renderUserPage();

        await waitFor(() => {
            expect(screen.getByText(/N\/A/i)).toBeInTheDocument();
        });
    });

    it('has settings link', () => {
        renderUserPage();
        const settingsLink = screen.getByRole('link');
        expect(settingsLink).toHaveAttribute('href', '/settings');
    });

    it('displays profile picture when available', async () => {
        vi.spyOn(userApi, 'fetchProfilePicture').mockResolvedValue('http://example.com/pic.jpg');

        renderUserPage();

        await waitFor(() => {
            const img = screen.getByAltText(/User profile/i);
            expect(img).toHaveAttribute('src', 'http://example.com/pic.jpg');
        });
    });

    it('displays default image when no profile picture', async () => {
        renderUserPage();

        await waitFor(() => {
            const img = screen.getByAltText(/User profile/i);
            expect(img).toHaveAttribute('src');
        });
    });

    it('displays all dashboard rows', async () => {
        renderUserPage();

        await waitFor(() => {
            expect(screen.getByText(/Last workout/i)).toBeInTheDocument();
            expect(screen.getByText(/Streak/i)).toBeInTheDocument();
            expect(screen.getByText(/Total workouts/i)).toBeInTheDocument();
        });
    });
});
