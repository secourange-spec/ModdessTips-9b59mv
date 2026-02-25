import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { observeAuthState, getCurrentUserProfile } from '@/lib/auth';
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

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

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
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSignOut = () => {
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
        return <PredictionsPage userProfile={userProfile} />;
      case 'history':
        return <HistoryPage />;
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
      />
      
      <main className="pt-20">
        {renderPage()}
      </main>

      {currentUser && <NotificationCenter userId={currentUser.uid} />}
    </div>
  );
}

export default App;
