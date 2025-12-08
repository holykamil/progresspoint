import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { StartingPage } from './StartingPage';

describe('StartingPage', () => {
    const renderStartingPage = () => {
        return render(
            <BrowserRouter>
                <StartingPage />
            </BrowserRouter>
        );
    };

    it('renders the starting page', () => {
        renderStartingPage();
        expect(screen.getByRole('main', { name: /starting page/i })).toBeInTheDocument();
    });

    it('displays the logo', () => {
        renderStartingPage();
        const logo = screen.getByAltText(/logo/i);
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute('src');
    });

    it('displays all text lines correctly', () => {
        renderStartingPage();
        expect(screen.getByText(/STAY ON/i)).toBeInTheDocument();
        expect(screen.getByText(/POINT/i)).toBeInTheDocument();
        expect(screen.getByText(/WITH YOUR/i)).toBeInTheDocument();
        expect(screen.getByText(/FITNESS/i)).toBeInTheDocument();
        expect(screen.getByText(/PROGRESS/i)).toBeInTheDocument();
    });

    it('highlights POINT text in red', () => {
        renderStartingPage();
        const pointText = screen.getByText(/POINT/i);
        expect(pointText).toHaveClass('text-red');
    });

    it('displays Log In button with correct link', () => {
        renderStartingPage();
        const loginButton = screen.getByRole('link', { name: /log in/i });
        expect(loginButton).toBeInTheDocument();
        expect(loginButton).toHaveAttribute('href', '/login');
        expect(loginButton).toHaveClass('login-button');
    });

    it('displays Sign Up button with correct link', () => {
        renderStartingPage();
        const signupButton = screen.getByRole('link', { name: /sign up/i });
        expect(signupButton).toBeInTheDocument();
        expect(signupButton).toHaveAttribute('href', '/signup');
        expect(signupButton).toHaveClass('signin-button');
    });

    it('renders all navigation buttons', () => {
        renderStartingPage();
        const links = screen.getAllByRole('link');
        expect(links).toHaveLength(2);
    });
});
