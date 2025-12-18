import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * Komponent Higher-Order Component (HOC) zabezpieczający chronione trasy.
 * Sprawdza czy użytkownik jest zalogowany przed wyświetleniem zawartości.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, isLoading } = useAuth();

    // Wyświetl ekran ładowania podczas weryfikacji tokenu
    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner">Loading...</div>
            </div>
        );
    }

    // Przekieruj do strony logowania jeśli użytkownik niezalogowany
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Renderuj chronioną zawartość jeśli użytkownik zalogowany
    return <>{children}</>;
}