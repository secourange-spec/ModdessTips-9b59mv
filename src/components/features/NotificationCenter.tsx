import { useState, useEffect } from 'react';
import { Notification } from '@/types';
import { observeNotifications, markNotificationAsRead } from '@/lib/database';
import { Bell, X, CheckCircle, Info, AlertTriangle, Trophy } from 'lucide-react';

interface NotificationCenterProps {
  userId: string;
  onTogglePanel?: () => void;
  isOpen?: boolean;
}

export default function NotificationCenter({ userId, onTogglePanel, isOpen: externalIsOpen }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
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

  const togglePanel = () => {
    if (onTogglePanel) {
      onTogglePanel();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  return (
    <>

      {/* Notification Panel */}
      {isOpen && (
        <div className="fixed top-16 right-4 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-dark-800 rounded-xl shadow-2xl z-50 animate-slide-up">
          <div className="p-4 border-b border-gray-200 dark:border-dark-700 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 dark:text-white">
              Notifications ({unreadCount})
            </h3>
            <button
              onClick={togglePanel}
              className="p-1 hover:bg-gray-100 dark:hover:bg-dark-700 rounded"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="max-h-[28rem] overflow-y-auto">
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
