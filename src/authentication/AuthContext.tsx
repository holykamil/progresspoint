import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface User {
    id: string;
    email: string;
    username: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing token on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) {
            validateToken(storedToken);
        } else {
            setIsLoading(false);
        }
    }, []);

    // Validate token and fetch user data
    async function validateToken(token: string) {
        try {
            const res = await fetch('/api/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
                setToken(token);
            } else {
                // Token invalid, clear it
                localStorage.removeItem('auth_token');
            }
        } catch (error) {
            console.error('Token validation failed:', error);
            localStorage.removeItem('auth_token');
        } finally {
            setIsLoading(false);
        }
    }

    async function login(newToken: string) {
        // Clean token to remove any whitespace/newlines
        const cleanToken = newToken.trim();
        localStorage.setItem('auth_token', cleanToken);
        setToken(cleanToken);
        await validateToken(cleanToken);
    }

    function logout() {
        localStorage.removeItem('auth_token');
        setUser(null);
        setToken(null);
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}