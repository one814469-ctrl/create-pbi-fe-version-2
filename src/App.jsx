import { Routes, Route, Navigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import Navigation from '@/components/common/Navigation';
import EpicPage from '@/components/EpicPage';
import epicsData from '@/data/epics.json';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useEffect } from 'react'; // Import useEffect for session timeout check

function App() {
  const { isAuthenticated, login, logout } = useAuth();
  const { toast } = useToast();

  // Helper to display Shadcn toasts
  const displayMessage = (type, title, description) => {
    toast({
      variant: type === 'error' ? 'destructive' : type === 'success' ? 'default' : 'foreground',
      title: title,
      description: description,
    });
  };

  // Guardrail: [Edge] Given a session times out after inactivity
  useEffect(() => {
    let timeoutId;
    const resetTimer = () => {
      clearTimeout(timeoutId);
      if (isAuthenticated) {
        timeoutId = setTimeout(() => {
          logout();
          displayMessage('info', 'Session Expired', 'Your session has timed out due to inactivity. Please log in again.');
        }, 15 * 60 * 1000); // 15 minutes of inactivity
      }
    };

    const handleActivity = () => resetTimer();

    // Attach event listeners for user activity
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);

    resetTimer(); // Initialize timer on component mount

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [isAuthenticated, logout, displayMessage]);

  return (
    <div className="flex min-h-screen flex-col bg-muted/40 text-foreground">
      <Header isAuthenticated={isAuthenticated} onLogout={logout} />
      <div className="flex flex-1">
        <Navigation epics={epicsData} isAuthenticated={isAuthenticated} />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/epics/account-authentication-access" replace />} />
            {epicsData.map((epic) => {
              const slug = epic.title.toLowerCase().replace(/\s+/g, '-');
              return (
                <Route
                  key={epic.title}
                  path={`/epics/${slug}`}
                  element={
                    <EpicPage
                      epic={epic}
                      isAuthenticated={isAuthenticated}
                      displayMessage={displayMessage}
                    />
                  }
                />
              );
            })}
            <Route path="*" element={<h2 className="text-2xl font-bold text-destructive">404 - Page Not Found</h2>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;