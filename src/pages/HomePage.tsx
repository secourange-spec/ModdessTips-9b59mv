import { UserProfile } from '@/lib/auth';
import { Page } from '@/types';
import { Trophy, Crown, TrendingUp, MessageCircle, Users, Send } from 'lucide-react';

interface HomePageProps {
  userProfile: UserProfile;
  onNavigate: (page: Page) => void;
}

export default function HomePage({ userProfile, onNavigate }: HomePageProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Hero Section */}
      <div className="mb-12 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl mb-6 animate-pulse-glow">
          <Trophy className="w-14 h-14 text-white" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500 bg-clip-text text-transparent">
          MODDESS TIPS
        </h1>
        <p className="text-2xl text-gray-600 dark:text-gray-400 mb-3">
          Pronostics Sportifs Professionnels
        </p>
        <p className="text-lg text-gray-500 dark:text-gray-500 mb-8 max-w-2xl mx-auto">
          Rejoignez des milliers de parieurs qui font confiance à nos analyses expertes et maximisez vos gains avec nos pronostics VIP
        </p>
        <div className="inline-flex items-center gap-3">
          <span className={`badge ${userProfile.vipStatus ? 'badge-vip text-lg px-6 py-2' : 'badge-free text-lg px-6 py-2'}`}>
            {userProfile.vipStatus ? '👑 MEMBRE VIP' : '🆓 MEMBRE FREE'}
          </span>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-slide-up">
        <div className="card p-8 text-center">
          <div className="text-4xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent mb-2">92%</div>
          <div className="text-gray-600 dark:text-gray-400 font-semibold">Taux de réussite</div>
          <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">Sur l'année 2024</div>
        </div>
        <div className="card p-8 text-center">
          <div className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent mb-2">5000+</div>
          <div className="text-gray-600 dark:text-gray-400 font-semibold">Membres actifs</div>
          <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">Communauté grandissante</div>
        </div>
        <div className="card p-8 text-center">
          <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent mb-2">24/7</div>
          <div className="text-gray-600 dark:text-gray-400 font-semibold">Support disponible</div>
          <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">Toujours à votre écoute</div>
        </div>
      </div>

      {/* VIP CTA */}
      {!userProfile.vipStatus && (
        <div className="card p-10 mb-12 relative overflow-hidden animate-fade-in">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-500/20 to-transparent rounded-full -mr-32 -mt-32" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-10 h-10 text-primary-500" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Passez au VIP</h2>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-2xl">
              Débloquez l'accès à nos pronostics premium avec des cotes élevées, analyses approfondies et un taux de réussite exceptionnel
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 bg-primary-500 rounded-full" />
                <span>Pronostics Côte 2-5</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 bg-primary-500 rounded-full" />
                <span>Score Exact Premium</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 bg-primary-500 rounded-full" />
                <span>Analyses complètes</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('vip-pricing')}
              className="btn-primary text-lg px-8 py-4 flex items-center gap-2"
            >
              <Crown className="w-5 h-5" />
              Voir les offres VIP
            </button>
          </div>
        </div>
      )}

      {/* Community Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="card p-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Send className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Canal Officiel</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Rejoignez notre canal Telegram pour recevoir les notifications en temps réel et ne manquez aucun pronostic
          </p>
          <a
            href="https://t.me/+EBiGK5As8NQ1MjI0"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full justify-center flex items-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Rejoindre le canal
          </a>
        </div>

        <div className="card p-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Contact Admin</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Contactez notre équipe d'administration pour toute question ou assistance concernant votre compte VIP
          </p>
          <a
            href="https://t.me/servant12r"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary w-full justify-center flex items-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Contacter l'admin
          </a>
        </div>
      </div>

      {/* Features */}
      <div className="card p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Pourquoi nous choisir ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Analyses Professionnelles</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Nos experts analysent chaque match en profondeur pour vous offrir les meilleurs pronostics
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Taux de réussite élevé</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Plus de 92% de pronostics gagnants sur l'ensemble de nos prédictions VIP
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Communauté Active</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Rejoignez des milliers de membres satisfaits qui gagnent avec nos pronostics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
