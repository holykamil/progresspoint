import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/authentication/AuthContext';
import { SignUpPage } from './SignUpPage';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('SignUpPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderSignUpPage = () => {
        return render(
            <BrowserRouter>
                <AuthProvider>
                    <SignUpPage />
                </AuthProvider>
            </BrowserRouter>
        );
    };

    it('renders the sign up page', () => {
        renderSignUpPage();
        expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
    });

    it('displays all required input fields', () => {
        renderSignUpPage();
        const inputs = screen.getAllByRole('textbox');
        const passwordInputs = screen.getAllByDisplayValue('');
        expect(inputs.length).toBeGreaterThanOrEqual(2); // email and username
        expect(passwordInputs.length).toBeGreaterThanOrEqual(4); // all 4 inputs
    });

    it('displays continue button', () => {
        renderSignUpPage();
        expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
    });

    it('has link to login page', () => {
        renderSignUpPage();
        const loginLink = screen.getByRole('link', { name: /log in/i });
        expect(loginLink).toBeInTheDocument();
        expect(loginLink).toHaveAttribute('href', '/login');
    });

    it('allows input in all fields', () => {
        renderSignUpPage();

        const inputs = screen.getAllByRole('textbox');
        const emailInput = inputs[0] as HTMLInputElement; // First textbox is email
        const usernameInput = inputs[1] as HTMLInputElement; // Second textbox is username
        const allInputs = document.querySelectorAll('input');
        const passwordInput = allInputs[2] as HTMLInputElement; // Third input is password
        const confirmPasswordInput = allInputs[3] as HTMLInputElement; // Fourth input is confirm password

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

        expect(usernameInput.value).toBe('testuser');
        expect(emailInput.value).toBe('test@example.com');
        expect(passwordInput.value).toBe('password123');
        expect(confirmPasswordInput.value).toBe('password123');
    });

    it('password fields are of type password', () => {
        renderSignUpPage();
        const allInputs = document.querySelectorAll('input');
        const passwordInput = allInputs[2]; // Third input is password
        const confirmPasswordInput = allInputs[3]; // Fourth input is confirm password
        expect(passwordInput).toHaveAttribute('type', 'password');
        expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    });

    it('validates that passwords match', async () => {
        renderSignUpPage();

        const allInputs = document.querySelectorAll('input');
        const emailInput = allInputs[0];
        const usernameInput = allInputs[1];
        const passwordInput = allInputs[2];
        const confirmPasswordInput = allInputs[3];
        const signupButton = screen.getByRole('button', { name: /continue/i });

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } });
        fireEvent.click(signupButton);

        await waitFor(() => {
            expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
        });
    });

    it('validates required fields', async () => {
        renderSignUpPage();

        const signupButton = screen.getByRole('button', { name: /continue/i });
        fireEvent.click(signupButton);

        await waitFor(() => {
            expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
        });
    });

    it('submits form with valid data', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({ token: 'fake-token' })
        });

        renderSignUpPage();

        const allInputs = document.querySelectorAll('input');
        const emailInput = allInputs[0];
        const usernameInput = allInputs[1];
        const passwordInput = allInputs[2];
        const confirmPasswordInput = allInputs[3];
        const signupButton = screen.getByRole('button', { name: /continue/i });

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
        fireEvent.click(signupButton);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                '/api/auth/register',
                expect.objectContaining({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: 'test@example.com',
                        username: 'testuser',
                        password: 'password123'
                    })
                })
            );
        });
    });

    it('displays error message on signup failure', async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            json: async () => ({ message: 'Email already exists' })
        });

        renderSignUpPage();

        const allInputs = document.querySelectorAll('input');
        const emailInput = allInputs[0];
        const usernameInput = allInputs[1];
        const passwordInput = allInputs[2];
        const confirmPasswordInput = allInputs[3];
        const signupButton = screen.getByRole('button', { name: /continue/i });

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
        fireEvent.click(signupButton);

        await waitFor(() => {
            expect(screen.getByText(/Email already exists/i)).toBeInTheDocument();
        });
    });

    it('disables button when submitting', async () => {
        mockFetch.mockImplementation(() => new Promise(() => { }));

        renderSignUpPage();

        const allInputs = document.querySelectorAll('input');
        const emailInput = allInputs[0];
        const usernameInput = allInputs[1];
        const passwordInput = allInputs[2];
        const confirmPasswordInput = allInputs[3];
        const signupButton = screen.getByRole('button', { name: /continue/i });

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
        fireEvent.click(signupButton);

        await waitFor(() => {
            expect(signupButton).toBeDisabled();
        });
    });

});
