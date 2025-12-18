import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Interfejs reprezentujący dane użytkownika
interface User {
    id: string;
    email: string;
    username: string;
}

// Interfejs definiujący typ kontekstu autoryzacji
interface AuthContextType {
    user: User | null;                      // Dane zalogowanego użytkownika lub null
    token: string | null;                   // Token JWT lub null
    login: (token: string) => Promise<void>; // Funkcja logowania
    logout: () => void;                     // Funkcja wylogowania
    isLoading: boolean;                     // Flaga informująca o trwającej weryfikacji tokenu
}

// Utworzenie kontekstu React dla autoryzacji
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Komponent dostarczający kontekst autoryzacji dla całej aplikacji
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);   // Stan przechowujący dane użytkownika
    const [token, setToken] = useState<string | null>(null); // Stan przechowujący token JWT
    const [isLoading, setIsLoading] = useState(true);       // Stan ładowania podczas weryfikacji

    // Sprawdzenie czy istnieje zapisany token przy pierwszym załadowaniu aplikacji
    useEffect(() => {
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) {
            validateToken(storedToken); // Waliduj token jeśli istnieje
        } else {
            setIsLoading(false); // Brak tokenu - zakończ ładowanie
        }
    }, []);

    // Walidacja tokenu i pobranie danych użytkownika z serwera
    async function validateToken(token: string) {
        try {
            // Wysłanie żądania do endpointa /api/me z tokenem w nagłówku
            const res = await fetch('/api/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                // Token prawidłowy - pobierz dane użytkownika
                const data = await res.json();
                setUser(data.user);
                setToken(token);
            } else {
                // Token nieprawidłowy - usuń go z localStorage
                localStorage.removeItem('auth_token');
            }
        } catch (error) {
            console.error('Token validation failed:', error);
            localStorage.removeItem('auth_token');
        } finally {
            setIsLoading(false); // Zakończ ładowanie niezależnie od wyniku
        }
    }

    // Funkcja logowania - zapisuje token i pobiera dane użytkownika
    async function login(newToken: string) {
        // Oczyszczenie tokenu z białych znaków i nowych linii
        const cleanToken = newToken.trim();
        localStorage.setItem('auth_token', cleanToken); // Zapisz token w localStorage
        setToken(cleanToken);                          // Zaktualizuj stan
        await validateToken(cleanToken);               // Waliduj token i pobierz dane użytkownika
    }

    // Funkcja wylogowania - usuwa token i dane użytkownika
    function logout() {
        localStorage.removeItem('auth_token'); // Usuń token z localStorage
        setUser(null);                        // Wyczyść dane użytkownika
        setToken(null);                       // Wyczyść token
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook umożliwiający dostęp do kontekstu autoryzacji w komponentach
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        // Rzuć błąd jeśli hook użyty poza AuthProvider
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}