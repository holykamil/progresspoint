import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './SignUpPage.css';

export function SignUpPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    function validate() {
        if (!email || !username || !password || !confirmPassword) {
            return 'Please fill in all fields.';
        }
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address.';
        }

        if (password !== confirmPassword) {
            return 'Passwords do not match.';
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
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Signup failed. Please try again.');
                return;
            }

            // Success - redirect to login page
            console.log('Signup successful:', data);
            navigate('/login', {
                state: { message: 'Account created successfully! Please log in.' }
            });

        } catch (err) {
            console.error('Signup error:', err);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="sign-up-page">
            <div className="sign-up-page-content">
                <h1 className="text-header">Sign up</h1>

                <label className="text-input">email</label>
                <input
                    className="data-input"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={loading}
                    required
                />

                <label className="text-input">username</label>
                <input
                    className="data-input"
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
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

                <label className="text-input">confirm password</label>
                <input
                    className="data-input"
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    required
                />

                {error && <div className="form-error">{error}</div>}

                <button
                    className="continue-button"
                    onClick={onSubmit}
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'CONTINUE'}
                </button>

                <div className="auth-redirect">
                    Already have an account? <a className="auth-redirect-link" href="/login">Log in</a>
                </div>
            </div>
        </main>
    );
}