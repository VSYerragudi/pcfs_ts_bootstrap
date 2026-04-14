import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App';
import './index.css';

/**
 * Application Entry Point
 *
 * This is the React DOM render entry point.
 * All application logic is delegated to App.tsx.
 *
 * Hierarchy:
 * main.tsx (entry) → App.tsx (init & providers) → Router → Layouts → Pages
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

