import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { StartWorkoutPage } from './StartWorkoutPage';

vi.mock('@/components/Header/Header', () => ({
    Header: () => <div data-testid="mock-header">Header</div>
}));

describe('StartWorkoutPage', () => {
    const renderStartWorkoutPage = () => {
        return render(
            <BrowserRouter>
                <StartWorkoutPage />
            </BrowserRouter>
        );
    };

    it('renders the start workout page', () => {
        renderStartWorkoutPage();
        expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    });

    it('displays workout launcher header', () => {
        renderStartWorkoutPage();
        expect(screen.getByText(/Workout Launcher/i)).toBeInTheDocument();
    });

    it('displays repeat workout option', () => {
        renderStartWorkoutPage();
        expect(screen.getByText(/Repeat a workout/i)).toBeInTheDocument();
        expect(screen.getByText(/Do one of your previous workouts/i)).toBeInTheDocument();
    });

    it('displays create new workout option', () => {
        renderStartWorkoutPage();
        expect(screen.getByText(/Create a new workout/i)).toBeInTheDocument();
        expect(screen.getByText(/Compose your new workout blueprint/i)).toBeInTheDocument();
    });

    it('has repeat workout start button linking to repeat workout page', () => {
        renderStartWorkoutPage();
        const repeatButton = screen.getAllByRole('link')[0];
        expect(repeatButton).toHaveTextContent(/start/i);
        expect(repeatButton).toHaveAttribute('href', '/repeatworkout');
    });

    it('has create workout start button linking to workout page', () => {
        renderStartWorkoutPage();
        const createButton = screen.getAllByRole('link')[1];
        expect(createButton).toHaveTextContent(/start/i);
        expect(createButton).toHaveAttribute('href', '/workout');
    });

    it('renders both workout options', () => {
        renderStartWorkoutPage();
        const links = screen.getAllByRole('link');
        expect(links).toHaveLength(2);
    });

    it('displays repeat workout icon', () => {
        renderStartWorkoutPage();
        const container = screen.getByText(/Repeat a workout/i).closest('.repeat-workout-container');
        expect(container).toBeInTheDocument();
    });

    it('displays create workout icon', () => {
        renderStartWorkoutPage();
        const container = screen.getByText(/Create a new workout/i).closest('.create-workout-container');
        expect(container).toBeInTheDocument();
    });
});
