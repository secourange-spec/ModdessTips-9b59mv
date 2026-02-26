import { useState, useEffect } from 'react';
import { observeNotifications } from '@/lib/database';
import { User } from 'firebase/auth';
import { observeAuthState, getCurrentUserProfile, signOut } from '@/lib/auth';
import { UserProfile } from '@/lib/auth';
import AuthPage from '@/pages/AuthPage';
import HomePage from '@/pages/HomePage';
import PredictionsPage from '@/pages/PredictionsPage';
import HistoryPage from '@/pages/HistoryPage';
import VIPPricingPage from '@/pages/VIPPricingPage';
import ProfilePage from '@/pages/ProfilePage';
import AdminPage from '@/pages/AdminPage';
import Header from '@/components/layout/Header';
import LoadingScreen from '@/components/layout/LoadingScreen';
import NotificationCenter from '@/components/features/NotificationCenter';
import { Page } from '@/types';
import { Target, Crown, Trophy } from 'lucide-react';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [sectionFilter, setSectionFilter] = useState<'FREE' | 'VIP' | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const unsubscribe = observeAuthState(async (user) => {
      setCurrentUser(user);
      
      if (user) {
        const profile = await getCurrentUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = observeNotifications(currentUser.uid, (notifications) => {
      const unreadCount = notifications.filter(n => !n.read).length;
      setNotificationCount(unreadCount);
    });

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSignOut = async () => {
    await signOut();
    setCurrentUser(null);
    setUserProfile(null);
    setCurrentPage('home');
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!currentUser || !userProfile) {
    return <AuthPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage userProfile={userProfile} onNavigate={setCurrentPage} />;
      case 'predictions':
        return <PredictionsPage userProfile={userProfile} sectionFilter={sectionFilter} onNavigate={setCurrentPage} />;
      case 'history':
        return <HistoryPage userProfile={userProfile} />;
      case 'vip-pricing':
        return <VIPPricingPage />;
      case 'profile':
        return <ProfilePage userProfile={userProfile} />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage userProfile={userProfile} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 transition-colors duration-300">
      <Header
        userProfile={userProfile}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onSignOut={handleSignOut}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        notificationCount={notificationCount}
        onToggleNotifications={() => setNotificationsOpen(!notificationsOpen)}
      />
      
      <main className="pt-20 pb-24">
        {renderPage()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-900 border-t border-gray-200 dark:border-dark-800 shadow-2xl z-40">
        <div className="grid grid-cols-3 max-w-md mx-auto">
          <button
            onClick={() => {
              setSectionFilter('FREE');
              setCurrentPage('predictions');
            }}
            className={`flex flex-col items-center justify-center py-3 transition-colors ${
              currentPage === 'predictions' && sectionFilter === 'FREE'
                ? 'text-green-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-green-500'
            }`}
          >
            <Target className="w-6 h-6 mb-1" />
            <span className="text-xs font-semibold">FREE</span>
          </button>
          <button
            onClick={() => {
              setSectionFilter('VIP');
              setCurrentPage('predictions');
            }}
            className={`flex flex-col items-center justify-center py-3 transition-colors ${
              currentPage === 'predictions' && sectionFilter === 'VIP'
                ? 'text-primary-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary-500'
            }`}
          >
            <Crown className="w-6 h-6 mb-1" />
            <span className="text-xs font-semibold">VIP</span>
          </button>
          <button
            onClick={() => setCurrentPage('history')}
            className={`flex flex-col items-center justify-center py-3 transition-colors ${
              currentPage === 'history'
                ? 'text-primary-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary-500'
            }`}
          >
            <Trophy className="w-6 h-6 mb-1" />
            <span className="text-xs font-semibold">HISTORIQUES</span>
          </button>
        </div>
      </nav>

      {currentUser && (
        <NotificationCenter
          userId={currentUser.uid}
          isOpen={notificationsOpen}
          onTogglePanel={() => setNotificationsOpen(!notificationsOpen)}
        />
      )}
    </div>
  );
}

export default App;
