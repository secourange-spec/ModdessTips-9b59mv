import { useState, useEffect } from 'react';
import { Notification } from '@/types';
import { observeNotifications, markNotificationAsRead } from '@/lib/database';
import { Bell, X, CheckCircle, Info, AlertTriangle, Trophy } from 'lucide-react';

interface NotificationCenterProps {
  userId: string;
}

export default function NotificationCenter({ userId }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [latestNotification, setLatestNotification] = useState<Notification | null>(null);

  useEffect(() => {
    const unsubscribe = observeNotifications(userId, (data) => {
      const unreadCount = data.filter(n => !n.read).length;
      const previousUnreadCount = notifications.filter(n => !n.read).length;

      if (unreadCount > previousUnreadCount && data.length > 0) {
        const latest = data[0];
        setLatestNotification(latest);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
      }

      setNotifications(data);
    });

    return () => unsubscribe();
  }, [userId]);

  const handleMarkAsRead = async (notificationId: string) => {
    await markNotificationAsRead(userId, notificationId);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'prediction':
        return <Trophy className="w-5 h-5 text-primary-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <>
      {/* Notification Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-40"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white dark:bg-dark-800 rounded-xl shadow-2xl z-50 animate-slide-up">
          <div className="p-4 border-b border-gray-200 dark:border-dark-700 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 dark:text-white">
              Notifications ({unreadCount})
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-dark-700 rounded"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Aucune notification</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-dark-700">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-dark-700 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-primary-50 dark:bg-primary-900/10' : ''
                    }`}
                    onClick={() => {
                      if (!notification.read) {
                        handleMarkAsRead(notification.id!);
                      }
                    }}
                  >
                    <div className="flex gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(notification.createdAt).toLocaleString('fr-FR')}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary-500 rounded-full" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && latestNotification && (
        <div className="fixed top-20 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white dark:bg-dark-800 rounded-xl shadow-2xl z-50 animate-slide-up">
          <div className="p-4 flex gap-3">
            {getNotificationIcon(latestNotification.type)}
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Nouvelle notification
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {latestNotification.message}
              </p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-dark-700 rounded"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
