import './App.css'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { LoginPage } from '@/pages/AuthPages/LoginPage/LoginPage'
import { SignUpPage } from '@/pages/AuthPages/SignUpPage/SignUpPage'
import { HomePage } from '@/pages/HomePage/HomePage'
import { UserPage } from '@/pages/AccountPage/UserPage'
import { StartWorkoutPage } from '@/pages/WorkoutPages/StartWorkoutPage/StartWorkoutPage'
import { HistoryPage } from '@/pages/HistoryPage/HistoryPage'
import { SettingsPage } from '@/pages/SettingsPage/SettingsPage'
import { WorkoutPage } from '@/pages/WorkoutPages/WorkoutPage/WorkoutPage'
import { AuthProvider } from '@/authentication/AuthContext'
import { ProtectedRoute } from '@/authentication/ProtectedRoute';
import { StartingPage } from '@/pages/StartingPage/StartingPage'
import { RepeatWorkoutPage } from '@/pages/WorkoutPages/RepeatWorkoutPage/RepeatWorkoutPage'

const router = createBrowserRouter([
  {
    path: "/",
    element: <StartingPage />
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/signup",
    element: <SignUpPage />
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    )
  },
  {
    path: "/user",
    element: (
      <ProtectedRoute>
        <UserPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/startworkout",
    element: (
      <ProtectedRoute>
        <StartWorkoutPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/repeatworkout",
    element: (
      <ProtectedRoute>
        <RepeatWorkoutPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/history",
    element: (
      <ProtectedRoute>
        <HistoryPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/workout",
    element: (
      <ProtectedRoute>
        <WorkoutPage />
      </ProtectedRoute>
    )
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />
  }
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
