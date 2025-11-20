import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/authentication/AuthContext';
import { LoginPage } from './LoginPage';

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

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderLoginPage = () => {
        return render(
            <BrowserRouter>
                <AuthProvider>
                    <LoginPage />
                </AuthProvider>
            </BrowserRouter>
        );
    };

    it('renders the login page', () => {
        renderLoginPage();
        expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument();
    });

    it('displays email input field', () => {
        renderLoginPage();
        const emailInput = screen.getByRole('textbox');
        expect(emailInput).toBeInTheDocument();
        expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('displays password input field', () => {
        renderLoginPage();
        const allInputs = document.querySelectorAll('input');
        const passwordInput = allInputs[1]; // Second input is password
        expect(passwordInput).toBeInTheDocument();
        expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('displays continue button', () => {
        renderLoginPage();
        expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
    });

    it('has link to sign up page', () => {
        renderLoginPage();
        const signupLink = screen.getByRole('link', { name: /sign up/i });
        expect(signupLink).toBeInTheDocument();
        expect(signupLink).toHaveAttribute('href', '/signup');
    });

    it('allows input in email field', () => {
        renderLoginPage();
        const allInputs = document.querySelectorAll('input');
        const emailInput = allInputs[0] as HTMLInputElement;
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        expect(emailInput.value).toBe('test@example.com');
    });

    it('allows input in password field', () => {
        renderLoginPage();
        const allInputs = document.querySelectorAll('input');
        const passwordInput = allInputs[1] as HTMLInputElement;
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        expect(passwordInput.value).toBe('password123');
    });

    it('password field is of type password', () => {
        renderLoginPage();
        const allInputs = document.querySelectorAll('input');
        const passwordInput = allInputs[1];
        expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('disables button when submitting', async () => {
        mockFetch.mockImplementation(() => new Promise(() => { }));

        renderLoginPage();

        const allInputs = document.querySelectorAll('input');
        const emailInput = allInputs[0];
        const passwordInput = allInputs[1];
        const loginButton = screen.getByRole('button', { name: /continue/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(loginButton);

        await waitFor(() => {
            expect(loginButton).toBeDisabled();
        });
    });

    it('submits form with valid credentials', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({ token: 'fake-token' })
        });

        renderLoginPage();

        const allInputs = document.querySelectorAll('input');
        const emailInput = allInputs[0];
        const passwordInput = allInputs[1];
        const loginButton = screen.getByRole('button', { name: /continue/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(loginButton);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                '/api/auth/login',
                expect.objectContaining({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: 'test@example.com',
                        password: 'password123'
                    })
                })
            );
        });
    });

    it('displays error message on invalid credentials', async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            json: async () => ({ message: 'Invalid credentials' })
        });

        renderLoginPage();

        const allInputs = document.querySelectorAll('input');
        const emailInput = allInputs[0];
        const passwordInput = allInputs[1];
        const loginButton = screen.getByRole('button', { name: /continue/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
        fireEvent.click(loginButton);

        await waitFor(() => {
            expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
        });
    });

});
