import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '@/authentication/AuthContext';
import './LoginPage.css';

/**
 * Komponent strony logowania.
 * Obsługuje formularz logowania, walidację danych i komunikację z API.
 */
export function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    // Stany komponentu
    const [email, setEmail] = useState('');                  // Adres email
    const [password, setPassword] = useState('');            // Hasło
    const [error, setError] = useState<string | null>(null); // Komunikat błędu
    const [loading, setLoading] = useState(false);           // Flaga ładowania

    // Pobranie komunikatu sukcesu z nawigacji (przekierowanie po rejestracji)
    const successMessage = location.state?.message;

    // Wyrażenie regularne do walidacji formatu adresu email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Walidacja danych wejściowych formularza
    function validate() {
        if (!email || !password) {
            return 'Please fill in all fields.'; // Sprawdź czy pola nie są puste
        }
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address.'; // Waliduj format email
        }
        return null; // Brak błędów walidacji
    }

    // Obsługa klawisza Enter - automatyczne wysłanie formularza
    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter' && !loading) {
            const syntheticEvent = e as unknown as React.FormEvent;
            onSubmit(syntheticEvent); // Wyślij formularz po naciśnięciu Enter
        }
    }

    // Funkcja obsługująca wysłanie formularza logowania
    async function onSubmit(e: React.FormEvent) {
        e.preventDefault(); // Zapobiegnij domyślnemu odświeżeniu strony

        // Waliduj dane wejściowe
        const v = validate();
        if (v) {
            setError(v); // Wyświetl błąd walidacji
            return;
        }

        setError(null);      // Wyczyść poprzednie błędy
        setLoading(true);    // Ustaw stan ładowania

        try {
            // Wyślij żądanie POST do endpointa logowania
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                // Błąd logowania - wyświetl komunikat
                setError(data.message || 'Invalid email or password');
                return;
            }

            // Sprawdź czy otrzymano token
            if (!data.token) {
                setError('Login failed: No token received');
                return;
            }

            // Oczyść token z białych znaków
            const cleanToken = data.token.trim();

            // Zapisz token i zaktualizuj kontekst autoryzacji
            await login(cleanToken);

            // Przekieruj użytkownika na stronę główną
            navigate('/home');

        } catch (err) {
            console.error('Login error:', err);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false); // Zakończ stan ładowania
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
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    required
                />

                <label className="text-input">password</label>
                <input
                    className="data-input"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
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