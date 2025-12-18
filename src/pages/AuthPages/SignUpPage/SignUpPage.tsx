import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './SignUpPage.css';

/**
 * Komponent strony rejestracji.
 * Obsługuje formularz rejestracji, walidację danych i tworzenie nowego konta.
 */
export function SignUpPage() {
    const navigate = useNavigate();

    // Stany komponentu
    const [email, setEmail] = useState('');                         // Adres email
    const [username, setUsername] = useState('');                   // Nazwa użytkownika
    const [password, setPassword] = useState('');                   // Hasło
    const [confirmPassword, setConfirmPassword] = useState('');     // Potwierdzenie hasła
    const [error, setError] = useState<string | null>(null);        // Komunikat błędu
    const [loading, setLoading] = useState(false);                  // Flaga ładowania

    // Wyrażenie regularne do walidacji formatu adresu email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    // Walidacja danych wejściowych formularza rejestracji
    function validate() {
        if (!email || !username || !password || !confirmPassword) {
            return 'Please fill in all fields.'; // Sprawdź czy wszystkie pola wypełnione
        }
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address.'; // Waliduj format email
        }

        if (password !== confirmPassword) {
            return 'Passwords do not match.'; // Sprawdź czy hasła się zgadzają
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

    // Funkcja obsługująca wysłanie formularza rejestracji
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
            // Wyślij żądanie POST do endpointa rejestracji
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                // Błąd rejestracji - wyświetl komunikat
                setError(data.message || 'Signup failed. Please try again.');
                return;
            }

            // Sukces - przekieruj do strony logowania z komunikatem
            console.log('Signup successful:', data);
            navigate('/login', {
                state: { message: 'Account created successfully! Please log in.' }
            });

        } catch (err) {
            console.error('Signup error:', err);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false); // Zakończ stan ładowania
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
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    required
                />

                <label className="text-input">username</label>
                <input
                    className="data-input"
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
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

                <label className="text-input">confirm password</label>
                <input
                    className="data-input"
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
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
                    {loading ? 'Creating...' : 'CONTINUE'}
                </button>

                <div className="auth-redirect">
                    Already have an account? <a className="auth-redirect-link" href="/login">Log in</a>
                </div>
            </div>
        </main>
    );
}