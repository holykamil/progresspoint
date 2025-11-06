import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '@/authentication/AuthContext';
import './LoginPage.css';

export function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Get success message from navigation state (from signup redirect)
    const successMessage = location.state?.message;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validate() {
        if (!email || !password) {
            return 'Please fill in all fields.';
        }
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address.';
        }
        return null;
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        const v = validate();
        if (v) {
            setError(v);
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Invalid email or password');
                return;
            }

            // Validate that we received a token
            if (!data.token) {
                setError('Login failed: No token received');
                return;
            }

            // Clean the token (remove any whitespace)
            const cleanToken = data.token.trim();

            // Store token and update auth context
            await login(cleanToken);

            // Redirect to home page
            navigate('/home');

        } catch (err) {
            console.error('Login error:', err);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="login-page">
            <div className="login-page-content">
                <h1 className="text-header">Log in</h1>

                {successMessage && (
                    <div className="success-message">{successMessage}</div>
                )}

                <label className="text-input">email</label>
                <input
                    className="data-input"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={loading}
                    required
                />

                <label className="text-input">password</label>
                <input
                    className="data-input"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={loading}
                    required
                />

                {error && <div className="form-error">{error}</div>}

                <button
                    className="continue-button"
                    onClick={onSubmit}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'CONTINUE'}
                </button>

                <div className="auth-redirect">
                    Don't have an account? <a className="auth-redirect-link" href="/signup">Sign up</a>
                </div>
            </div>
        </main>
    );
}