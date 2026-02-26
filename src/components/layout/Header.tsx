import { UserProfile } from '@/lib/auth';
import { Page } from '@/types';
import { Trophy, Home, TrendingUp, History, Crown, User, Shield, Moon, Sun, Menu, X, Target, BarChart3, Lock, LogOut, ChevronRight, Bell } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  userProfile: UserProfile;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onSignOut: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  notificationCount?: number;
  onToggleNotifications?: () => void;
}

export default function Header({ userProfile, currentPage, onNavigate, onSignOut, darkMode, onToggleDarkMode, notificationCount = 0, onToggleNotifications }: HeaderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuSections = [
    {
      title: 'Menu Principal',
      items: [
        { id: 'home' as Page, label: 'Accueil', icon: Home },
        { id: 'profile' as Page, label: 'Profil', icon: User },
        { id: 'vip-pricing' as Page, label: 'Passer VIP', icon: Crown },
      ]
    },
  ];

  return (
    <>
    {/* Top Header */}
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-800 shadow-md backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
      <div className="px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left: Menu Button + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-700 dark:text-gray-300"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white hidden sm:block">
                MODDESS TIPS
              </span>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Notification Button */}
            {onToggleNotifications && (
              <button
                onClick={onToggleNotifications}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-700 dark:text-gray-300 relative"
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {notificationCount > 9 ? '9' : notificationCount}
                  </span>
                )}
              </button>
            )}

            {/* User Info */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{userProfile.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{userProfile.email}</div>
              </div>
            </div>

            {/* VIP Badge */}
            <span className={`badge ${userProfile.vipStatus ? 'badge-vip' : 'badge-free'}`}>
              {userProfile.vipStatus ? '👑 VIP' : '🆓 FREE'}
            </span>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-700 dark:text-gray-300"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>

    {/* Sidebar */}
    <div
      className={`fixed inset-0 z-40 transition-opacity duration-300 ${
        sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar Panel */}
      <div
        className={`absolute top-0 left-0 bottom-0 w-72 bg-white dark:bg-dark-900 shadow-2xl transform transition-transform duration-300 ease-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } overflow-y-auto flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="sticky top-0 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-600 p-5 text-white shadow-lg z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white/25 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-inner">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-base">MODDESS TIPS</h2>
                <p className="text-[10px] text-white/75 font-medium">Pronostics Professionnels</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 hover:bg-white/15 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info in Sidebar */}
          <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/25 rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{userProfile.name}</div>
                <div className="text-[10px] text-white/70 truncate">{userProfile.email}</div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                userProfile.vipStatus ? 'bg-yellow-400 text-dark-900' : 'bg-white/20'
              }`}>
                {userProfile.vipStatus ? 'VIP' : 'FREE'}
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-1 p-3 space-y-5 overflow-y-auto">
          {/* Menu Sections */}
          {menuSections.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              <div className="flex items-center justify-between mb-2 px-2.5">
                <h3 className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  {section.title}
                </h3>
                {section.badge && (
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${section.badgeColor} text-white`}>
                    {section.badge}
                  </span>
                )}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  const isLocked = item.vipOnly && !userProfile.vipStatus;

                  return (
                    <button
                      key={`${sectionIdx}-${itemIdx}`}
                      onClick={() => {
                        onNavigate(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 group ${
                        isActive
                          ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                          : isLocked
                          ? 'text-gray-400 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-dark-800/50'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1 text-left text-[13px] font-semibold">{item.label}</span>
                      {isLocked && <Lock className="w-3.5 h-3.5 text-gray-400" />}
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Admin Section */}
          {userProfile.role === 'admin' && (
            <div className="pt-3 border-t border-gray-200 dark:border-dark-800">
              <div className="flex items-center justify-between mb-2 px-2.5">
                <h3 className="text-[10px] font-extrabold text-red-500 uppercase tracking-wider">Administration</h3>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-red-500 text-white">ADMIN</span>
              </div>
              <button
                onClick={() => {
                  onNavigate('admin');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 group ${
                  currentPage === 'admin'
                    ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span className="flex-1 text-left text-[13px] font-semibold">Panneau Admin</span>
                {currentPage === 'admin' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </button>
            </div>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-dark-900 border-t border-gray-200 dark:border-dark-800 p-3">
          <button
            onClick={() => {
              onSignOut();
              setSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold text-[13px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
