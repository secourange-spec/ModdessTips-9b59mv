import { UserProfile } from '@/lib/auth';
import { signOut } from '@/lib/auth';
import { User, Mail, Crown, Calendar, ExternalLink, Users } from 'lucide-react';

interface ProfilePageProps {
  userProfile: UserProfile;
}

export default function ProfilePage({ userProfile }: ProfilePageProps) {
  const handleSignOut = async () => {
    await signOut();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isVIPExpired = userProfile.vipExpireDate 
    ? new Date(userProfile.vipExpireDate) < new Date()
    : false;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Mon Profil
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gérez vos informations personnelles
        </p>
      </div>

      {/* Profile Card */}
      <div className="card p-8 mb-8 animate-fade-in">
        <div className="flex items-start gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              {userProfile.name}
            </h2>
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">{userProfile.email}</span>
            </div>
            <div className="flex items-center gap-2">
              {userProfile.vipStatus && !isVIPExpired ? (
                <span className="badge-vip">👑 VIP PRO</span>
              ) : (
                <span className="badge-free">🆓 FREE</span>
              )}
              {userProfile.role === 'admin' && (
                <span className="badge bg-red-500 text-white">🛡️ ADMIN</span>
              )}
            </div>
          </div>
        </div>

        {/* VIP Info */}
        {userProfile.vipStatus && (
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Statut VIP
              </h3>
            </div>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calendar className="w-4 h-4" />
              <span>
                Expire le: <strong>{formatDate(userProfile.vipExpireDate)}</strong>
              </span>
            </div>
            {isVIPExpired && (
              <div className="mt-3 text-red-600 dark:text-red-400 font-semibold">
                ⚠️ Votre abonnement VIP a expiré
              </div>
            )}
          </div>
        )}

        {/* Account Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="border-l-4 border-primary-500 pl-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Date d'inscription
            </div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {formatDate(userProfile.createdAt)}
            </div>
          </div>
          <div className="border-l-4 border-primary-500 pl-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Statut du compte
            </div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {userProfile.banned ? '🚫 Banni' : '✅ Actif'}
            </div>
          </div>
        </div>
      </div>

      {/* Community Links */}
      <div className="card p-8 mb-8 animate-slide-up">
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
          Rejoignez la communauté
        </h2>
        <div className="space-y-4">
          <a
            href="https://t.me/servant12r"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  Contacter l'Admin
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Support et questions VIP
                </div>
              </div>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-400" />
          </a>

          <a
            href="https://t.me/+EBiGK5As8NQ1MjI0"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  Canal Officiel
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Rejoignez notre communauté Telegram
                </div>
              </div>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-400" />
          </a>
        </div>
      </div>

      {/* Sign Out */}
      <button
        onClick={handleSignOut}
        className="btn-secondary w-full"
      >
        Se déconnecter
      </button>
    </div>
  );
}
