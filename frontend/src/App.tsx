import { useEffect, useState, useRef } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { useAuthStore } from '@/stores/authStore';

/**
 * Application Root Component
 *
 * Responsibilities:
 * 1. Initialize authentication state on app load
 * 2. Show loading state while initializing
 * 3. Provide the router to the application
 * 4. Wrap with any global providers (toast, theme, etc.)
 *
 * Architecture:
 * main.tsx (entry point)
 *    └── App.tsx (initialization & providers)
 *           └── RouterProvider
 *                  └── Routes (routes/index.tsx)
 *                         ├── RootLayout (public pages)
 *                         │      ├── HomePage
 *                         │      └── AboutPage
 *                         ├── LoginPage (standalone)
 *                         └── DashboardLayout (protected)
 *                                ├── DashboardPage
 *                                └── Admin pages
 */

/**
 * Loading component shown during app initialization
 */
function AppLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

/**
 * Main App component
 *
 * Handles:
 * - Auth state initialization from localStorage (via Zustand persist)
 * - Token validation on app startup
 * - Loading state while initializing
 */
export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const initializationRef = useRef(false);

  // Get auth store methods - use store selectors for stability
  const initialize = useAuthStore((state) => state.initialize);
  const refreshTokens = useAuthStore((state) => state.refreshTokens);

  useEffect(() => {
    // Prevent double initialization in React StrictMode
    if (initializationRef.current) {
      return;
    }
    initializationRef.current = true;

    const initializeApp = async () => {
      // Step 1: Initialize auth state (restore token to API client from persisted storage)
      initialize();

      // Step 2: Get current state after initialization
      const { accessToken } = useAuthStore.getState();

      // Step 3: If we have a stored token, validate it by refreshing
      // This handles cases where:
      // - Token expired while app was closed
      // - Token was invalidated server-side
      if (accessToken) {
        try {
          const success = await refreshTokens();
          if (!success) {
            console.log('Session expired, user will need to login again');
          }
        } catch {
          console.log('Token validation failed, user will need to login again');
        }
      }

      // Step 4: Mark initialization complete
      setIsInitialized(true);
    };

    initializeApp();
  }, [initialize, refreshTokens]);

  // Show loading spinner while initializing
  if (!isInitialized) {
    return <AppLoader />;
  }

  // Render the application
  return <RouterProvider router={router} />;
}
