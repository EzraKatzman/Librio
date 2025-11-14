import './App.css'

import LibraryPage from "./pages/LibraryPage";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/Toast/ToastContainer';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useWebSocket } from './hooks/useWebSocket';

function AppContent() {
  const { toggleTheme, isDark } = useTheme();

  useWebSocket();

  // Global keyboard shortcut for theme toggle
  useKeyboardShortcuts([
    { 
      key: 'd', 
      ctrl: true, 
      shift: true,
      callback: toggleTheme 
    },
  ], true);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="p-4 border-b border-border flex gap-4 items-center">
        
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="ml-auto p-2 rounded-lg hover:bg-border-light transition-colors"
          title="Toggle Theme (Ctrl+D)"
        >
          {isDark ? (
            // Sun icon (light mode)
            <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            // Moon icon (dark mode)
            <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>
      <Routes>
        <Route path="/" element={<LibraryPage />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <AppContent />
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}
