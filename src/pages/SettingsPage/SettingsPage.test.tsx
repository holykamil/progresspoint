/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SettingsPage } from './SettingsPage';
import * as userApi from '@/lib/userApi';

vi.mock('@/lib/userApi');
vi.mock('@/components/Header/Header', () => ({
    Header: () => <div data-testid="mock-header">Header</div>
}));
vi.mock('@/components/settings/ChangeUsername/ChangeUsername', () => ({
    ChangeUsername: ({ onClose, onSuccess }: any) => (
        <div data-testid="change-username-modal">
            <button onClick={() => onSuccess('newusername')}>Save</button>
            <button onClick={onClose}>Cancel</button>
        </div>
    )
}));
vi.mock('@/components/settings/ChangePassword/ChangePassword', () => ({
    ChangePassword: ({ onClose, onSuccess }: any) => (
        <div data-testid="change-password-modal">
            <button onClick={onSuccess}>Save</button>
            <button onClick={onClose}>Cancel</button>
        </div>
    )
}));
vi.mock('@/components/settings/ProfilePicture/ProfilePictureUpload', () => ({
    ProfilePictureUpload: ({ onClose, onSuccess }: any) => (
        <div data-testid="upload-picture-modal">
            <button onClick={() => onSuccess('http://example.com/pic.jpg')}>Upload</button>
            <button onClick={onClose}>Cancel</button>
        </div>
    )
}));
vi.mock('@/components/settings/ProfilePicture/ProfilePictureDelete', () => ({
    ProfilePictureDelete: ({ onClose, onSuccess }: any) => (
        <div data-testid="delete-picture-modal">
            <button onClick={onSuccess}>Delete</button>
            <button onClick={onClose}>Cancel</button>
        </div>
    )
}));

describe('SettingsPage', () => {
    const mockUserData = {
        user: {
            id: '1',
            email: 'test@example.com',
            username: 'testuser',
            createdAt: '2024-01-01',
            profileImageUrl: null
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

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(userApi, 'fetchUserData').mockResolvedValue(mockUserData);
        vi.spyOn(userApi, 'fetchProfilePicture').mockResolvedValue(null);
    });

    const renderSettingsPage = () => {
        return render(
            <BrowserRouter>
                <SettingsPage />
            </BrowserRouter>
        );
    };

    it('renders the settings page', () => {
        renderSettingsPage();
        expect(screen.getByTestId('mock-header')).toBeInTheDocument();
        expect(screen.getByText(/Settings/i)).toBeInTheDocument();
    });

    it('displays user information', async () => {
        renderSettingsPage();

        await waitFor(() => {
            expect(screen.getByText('testuser')).toBeInTheDocument();
            expect(screen.getByText('test@example.com')).toBeInTheDocument();
        });
    });

    it('displays profile picture section', async () => {
        renderSettingsPage();

        await waitFor(() => {
            expect(screen.getByText(/Profile picture/i)).toBeInTheDocument();
            expect(screen.getByText(/PNG, JPG under 3MB/i)).toBeInTheDocument();
        });
    });

    it('opens change username modal when change button is clicked', async () => {
        renderSettingsPage();

        await waitFor(() => {
            const changeButton = screen.getAllByRole('button', { name: /change/i })[0];
            fireEvent.click(changeButton);
        });

        expect(screen.getByTestId('change-username-modal')).toBeInTheDocument();
    });

    it('updates username when successfully changed', async () => {
        renderSettingsPage();

        await waitFor(() => {
            const changeButton = screen.getAllByRole('button', { name: /change/i })[0];
            fireEvent.click(changeButton);
        });

        const saveButton = screen.getByRole('button', { name: /save/i });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(screen.getByText(/Username changed successfully/i)).toBeInTheDocument();
        });
    });

    it('opens change password modal', async () => {
        renderSettingsPage();

        await waitFor(() => {
            const changeButtons = screen.getAllByRole('button', { name: /change/i });
            const passwordButton = changeButtons[1];
            fireEvent.click(passwordButton);
        });

        expect(screen.getByTestId('change-password-modal')).toBeInTheDocument();
    });

    it('shows success message when password is changed', async () => {
        renderSettingsPage();

        await waitFor(() => {
            const changeButtons = screen.getAllByRole('button', { name: /change/i });
            fireEvent.click(changeButtons[1]);
        });

        const saveButton = screen.getByRole('button', { name: /save/i });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(screen.getByText(/Password changed successfully/i)).toBeInTheDocument();
        });
    });

    it('opens upload picture modal', async () => {
        renderSettingsPage();

        await waitFor(() => {
            const uploadButton = screen.getByRole('button', { name: /Upload new picture/i });
            fireEvent.click(uploadButton);
        });

        expect(screen.getByTestId('upload-picture-modal')).toBeInTheDocument();
    });

    it('displays delete button as disabled when no profile picture', async () => {
        renderSettingsPage();

        await waitFor(() => {
            const deleteButton = screen.getByRole('button', { name: /delete/i });
            expect(deleteButton).toBeDisabled();
        });
    });

    it('enables delete button when profile picture exists', async () => {
        vi.spyOn(userApi, 'fetchProfilePicture').mockResolvedValue('http://example.com/pic.jpg');

        renderSettingsPage();

        await waitFor(() => {
            const deleteButton = screen.getByRole('button', { name: /delete/i });
            expect(deleteButton).not.toBeDisabled();
        });
    });

    it('displays loading state initially', () => {
        renderSettingsPage();
        const loadingTexts = screen.getAllByText(/Loading.../i);
        expect(loadingTexts.length).toBeGreaterThan(0);
    });

    it('has exit button linking to user page', () => {
        renderSettingsPage();
        const exitButton = screen.getByRole('link');
        expect(exitButton).toHaveAttribute('href', '/user');
    });
});
