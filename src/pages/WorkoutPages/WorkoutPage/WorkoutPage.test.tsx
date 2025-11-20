/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { WorkoutPage } from './WorkoutPage';

// Mock Header component
vi.mock('@/components/Header/Header', () => ({
    Header: () => <div data-testid="mock-header">Header</div>
}));

// Mock AddExercises component
vi.mock('@/components/workout/AddExercises/AddExercises', () => ({
    AddExercises: ({ onAddExercise, onClose }: any) => (
        <div data-testid="add-exercises-modal">
            <button onClick={() => onAddExercise({
                id: 'exercise-1',
                name: 'Bench Press',
                category: 'Chest'
            })}>Add Exercise</button>
            <button onClick={onClose}>Close</button>
        </div>
    )
}));

// Mock SubmitWorkout component
vi.mock('@/components/workout/SubmitWorkout/SubmitWorkout', () => ({
    SubmitWorkout: ({ onClose, onSubmit }: any) => (
        <div data-testid="submit-workout-modal">
            <button onClick={onClose}>Cancel</button>
            <button onClick={onSubmit}>Submit</button>
        </div>
    )
}));

// Mock ExitWarningPopup component
vi.mock('@/components/workout/ExitWarningPopup/ExitWarningPopup', () => ({
    ExitWarningPopup: ({ onCancel, onDiscard }: any) => (
        <div data-testid="exit-warning-popup">
            <button onClick={onCancel}>Stay</button>
            <button onClick={onDiscard}>Discard</button>
        </div>
    )
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    const mockUseBlocker = vi.fn(() => ({ state: 'unblocked' }));
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useBlocker: mockUseBlocker,
        useLocation: () => ({ state: null })
    };
});

describe('WorkoutPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllTimers();
    });

    const renderComponent = () => {
        return render(
            <BrowserRouter>
                <WorkoutPage />
            </BrowserRouter>
        );
    };

    describe('Initial Render', () => {
        it('renders the workout page with header', () => {
            renderComponent();
            expect(screen.getByTestId('mock-header')).toBeInTheDocument();
        });

        it('renders workout title and subtitle', () => {
            renderComponent();
            expect(screen.getByText('New workout')).toBeInTheDocument();
            expect(screen.getByText('Add more exercises or finish workout')).toBeInTheDocument();
        });

        it('renders timer with initial value', () => {
            renderComponent();
            expect(screen.getByText('01:00')).toBeInTheDocument();
        });

        it('renders finish button (disabled initially)', () => {
            renderComponent();
            const finishButton = screen.getByText('FINISH');
            expect(finishButton).toBeInTheDocument();
            expect(finishButton).toBeDisabled();
        });

        it('shows empty workout message', () => {
            renderComponent();
            expect(screen.getByText('No exercises added yet')).toBeInTheDocument();
            expect(screen.getByText('Click the button below to add your first exercise')).toBeInTheDocument();
        });

        it('renders add exercise button', () => {
            renderComponent();
            expect(screen.getByText('+ Add an exercise')).toBeInTheDocument();
        });
    });

    describe('Timer Functionality', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.runOnlyPendingTimers();
            vi.useRealTimers();
        });

        it('timer increments every second', () => {
            renderComponent();
            expect(screen.getByText('01:00')).toBeInTheDocument();

            act(() => {
                vi.advanceTimersByTime(1000);
            });
            expect(screen.getByText('01:01')).toBeInTheDocument();

            act(() => {
                vi.advanceTimersByTime(59000);
            });
            expect(screen.getByText('02:00')).toBeInTheDocument();
        });

        it('timer formats time correctly', () => {
            renderComponent();
            act(() => {
                vi.advanceTimersByTime(125000); // 2 minutes 5 seconds
            });
            expect(screen.getByText('03:05')).toBeInTheDocument();
        });
    });

    describe('Adding Exercises', () => {
        it('opens add exercise modal when button clicked', async () => {
            const user = userEvent.setup();
            renderComponent();

            const addButton = screen.getByText('+ Add an exercise');
            await user.click(addButton);

            await waitFor(() => {
                expect(screen.getByTestId('add-exercises-modal')).toBeInTheDocument();
            });
        });

        it('closes add exercise modal when close button clicked', async () => {
            const user = userEvent.setup();
            renderComponent();

            await user.click(screen.getByText('+ Add an exercise'));
            await waitFor(() => {
                expect(screen.getByTestId('add-exercises-modal')).toBeInTheDocument();
            });

            await user.click(screen.getByText('Close'));
            await waitFor(() => {
                expect(screen.queryByTestId('add-exercises-modal')).not.toBeInTheDocument();
            });
        });

        it('adds exercise to workout', async () => {
            const user = userEvent.setup();
            renderComponent();

            await user.click(screen.getByText('+ Add an exercise'));
            await user.click(screen.getByText('Add Exercise'));

            await waitFor(() => {
                expect(screen.getByText('Bench Press')).toBeInTheDocument();
                expect(screen.queryByText('No exercises added yet')).not.toBeInTheDocument();
            });
        });

        it('enables finish button after adding exercise', async () => {
            const user = userEvent.setup();
            renderComponent();

            const finishButton = screen.getByText('FINISH');
            expect(finishButton).toBeDisabled();

            await user.click(screen.getByText('+ Add an exercise'));
            await user.click(screen.getByText('Add Exercise'));

            await waitFor(() => {
                expect(finishButton).not.toBeDisabled();
            });
        });
    });

    describe('Set Management', () => {
        it('adds first set automatically when exercise added', async () => {
            const user = userEvent.setup();
            renderComponent();

            await user.click(screen.getByText('+ Add an exercise'));
            await user.click(screen.getByText('Add Exercise'));

            await waitFor(() => {
                expect(screen.getByText('1')).toBeInTheDocument(); // Set number
            });
        });

        it('adds additional sets when + button clicked', async () => {
            const user = userEvent.setup();
            renderComponent();

            await user.click(screen.getByText('+ Add an exercise'));
            await user.click(screen.getByText('Add Exercise'));

            await waitFor(() => {
                expect(screen.getByText('1')).toBeInTheDocument();
            });

            const addSetButton = screen.getByText('+');
            await user.click(addSetButton);

            await waitFor(() => {
                expect(screen.getByText('2')).toBeInTheDocument();
            });
        });

        it('updates set weight value', async () => {
            const user = userEvent.setup();
            renderComponent();

            await user.click(screen.getByText('+ Add an exercise'));
            await user.click(screen.getByText('Add Exercise'));

            await waitFor(() => {
                expect(screen.getByText('1')).toBeInTheDocument();
            });

            const weightInput = screen.getAllByPlaceholderText('0')[0];
            await user.type(weightInput, '100');

            await waitFor(() => {
                expect(weightInput).toHaveValue(100);
            });
        });

        it('updates set reps value', async () => {
            const user = userEvent.setup();
            renderComponent();

            await user.click(screen.getByText('+ Add an exercise'));
            await user.click(screen.getByText('Add Exercise'));

            await waitFor(() => {
                expect(screen.getByText('1')).toBeInTheDocument();
            });

            const repsInput = screen.getAllByPlaceholderText('0')[1];
            await user.type(repsInput, '10');

            await waitFor(() => {
                expect(repsInput).toHaveValue(10);
            });
        });

        it('removes set when × button clicked', async () => {
            const user = userEvent.setup();
            renderComponent();

            await user.click(screen.getByText('+ Add an exercise'));
            await user.click(screen.getByText('Add Exercise'));

            await waitFor(() => {
                expect(screen.getByText('1')).toBeInTheDocument();
            });

            await user.click(screen.getByText('+'));

            await waitFor(() => {
                expect(screen.getByText('2')).toBeInTheDocument();
            });

            const removeButtons = screen.getAllByText('×');
            await user.click(removeButtons[1]);

            await waitFor(() => {
                expect(screen.queryByText('2')).not.toBeInTheDocument();
            });
        });
    });

    describe('Workout Submission', () => {
        it('opens submit modal when finish button clicked', async () => {
            const user = userEvent.setup();
            renderComponent();

            await user.click(screen.getByText('+ Add an exercise'));
            await user.click(screen.getByText('Add Exercise'));

            await waitFor(() => {
                expect(screen.getByText('1')).toBeInTheDocument();
            });

            await user.click(screen.getByText('FINISH'));

            await waitFor(() => {
                expect(screen.getByTestId('submit-workout-modal')).toBeInTheDocument();
            });
        });

        it('closes submit modal when cancel clicked', async () => {
            const user = userEvent.setup();
            renderComponent();

            await user.click(screen.getByText('+ Add an exercise'));
            await user.click(screen.getByText('Add Exercise'));

            await waitFor(() => {
                expect(screen.getByText('1')).toBeInTheDocument();
            });

            await user.click(screen.getByText('FINISH'));

            await waitFor(() => {
                expect(screen.getByTestId('submit-workout-modal')).toBeInTheDocument();
            });

            await user.click(screen.getByText('Cancel'));

            await waitFor(() => {
                expect(screen.queryByTestId('submit-workout-modal')).not.toBeInTheDocument();
            });
        });

        it('navigates to home after workout submission', async () => {
            const user = userEvent.setup();
            renderComponent();

            await user.click(screen.getByText('+ Add an exercise'));
            await user.click(screen.getByText('Add Exercise'));

            await waitFor(() => {
                expect(screen.getByText('1')).toBeInTheDocument();
            });

            await user.click(screen.getByText('FINISH'));

            await waitFor(() => {
                expect(screen.getByTestId('submit-workout-modal')).toBeInTheDocument();
            });

            await user.click(screen.getByText('Submit'));

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/home');
            });
        });

        it('stops timer when finish button clicked', async () => {
            const user = userEvent.setup();
            renderComponent();

            // Add exercise to enable finish button
            await user.click(screen.getByText('+ Add an exercise'));
            await user.click(screen.getByText('Add Exercise'));
            await waitFor(() => {
                expect(screen.getByText('1')).toBeInTheDocument();
            });

            // Get initial timer value (should be some time like 01:00 or slightly more)
            const initialTimer = screen.getByText(/^\d{2}:\d{2}$/);
            const initialTime = initialTimer.textContent;

            // Click finish to stop timer
            await user.click(screen.getByText('FINISH'));
            await waitFor(() => {
                expect(screen.getByTestId('submit-workout-modal')).toBeInTheDocument();
            });

            // Wait a bit and verify timer hasn't changed
            await new Promise(resolve => setTimeout(resolve, 100));

            // Timer should still show the same time as when finish was clicked
            expect(screen.getByText(initialTime!)).toBeInTheDocument();
        });
    });

    describe('Set Display', () => {
        it('displays set headers', async () => {
            const user = userEvent.setup();
            renderComponent();

            await user.click(screen.getByText('+ Add an exercise'));
            await user.click(screen.getByText('Add Exercise'));

            await waitFor(() => {
                expect(screen.getByText('SET')).toBeInTheDocument();
                expect(screen.getByText('PREVIOUSLY')).toBeInTheDocument();
                expect(screen.getByText('KG')).toBeInTheDocument();
                expect(screen.getByText('REPS')).toBeInTheDocument();
            });
        });

        it('displays previous set as "-" for new exercise', async () => {
            const user = userEvent.setup();
            renderComponent();

            await user.click(screen.getByText('+ Add an exercise'));
            await user.click(screen.getByText('Add Exercise'));

            await waitFor(() => {
                expect(screen.getByText('-')).toBeInTheDocument();
            });
        });
    });
});
