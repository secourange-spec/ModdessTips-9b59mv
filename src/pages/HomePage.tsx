import { useState, useEffect } from 'react';
import { UserProfile } from '@/lib/auth';
import { Page, Prediction } from '@/types';
import { observePredictions } from '@/lib/database';
import PredictionCard from '@/components/features/PredictionCard';
import { Trophy, TrendingUp, Target, Crown, Lock, ChevronRight } from 'lucide-react';

interface HomePageProps {
  userProfile: UserProfile;
  onNavigate: (page: Page) => void;
}

export default function HomePage({ userProfile, onNavigate }: HomePageProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = observePredictions((data) => {
      setPredictions(data.filter(p => p.status === 'active'));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const freePredictions = predictions.filter(p => 
    p.category === 'COTE_2_FREE' || p.category === 'ACCUMULATION_FREE'
  );

  const vipPredictions = predictions.filter(p => 
    p.category.includes('VIP')
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <div className="mb-12 text-center animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
          Bienvenue {userProfile.name}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
          Découvrez nos pronostics sportifs professionnels
        </p>
        <div className="inline-flex items-center gap-3">
          <span className={`badge ${userProfile.vipStatus ? 'badge-vip text-lg' : 'badge-free text-lg'}`}>
            {userProfile.vipStatus ? '👑 VIP PRO' : '🆓 FREE'}
          </span>
          {!userProfile.vipStatus && (
            <button
              onClick={() => onNavigate('vip-pricing')}
              className="btn-primary text-sm flex items-center gap-2"
            >
              <Crown className="w-4 h-4" />
              Passer au VIP
            </button>
          )}
        </div>
      </div>

      {/* FREE Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
              <span className="badge-free text-base">GRATUIT</span>
              Pronostics FREE
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Accessible à tous les membres</p>
          </div>
          <button 
            onClick={() => onNavigate('predictions')}
            className="btn-secondary text-sm flex items-center gap-1"
          >
            Voir tous
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-6">
                <div className="skeleton h-6 w-3/4 mb-4" />
                <div className="skeleton h-4 w-full mb-2" />
                <div className="skeleton h-4 w-5/6" />
              </div>
            ))}
          </div>
        ) : freePredictions.length === 0 ? (
          <div className="card p-12 text-center">
            <Target className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 dark:text-gray-400">
              Aucun pronostic FREE disponible pour le moment
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freePredictions.slice(0, 3).map((prediction, index) => (
              <div
                key={prediction.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <PredictionCard prediction={prediction} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* VIP Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
              <span className="badge-vip text-base">VIP PREMIUM</span>
              Pronostics VIP Exclusifs
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {userProfile.vipStatus 
                ? 'Accès illimité à tous nos pronostics premium' 
                : 'Devenez VIP pour débloquer ces pronostics'}
            </p>
          </div>
          {userProfile.vipStatus && (
            <button 
              onClick={() => onNavigate('predictions')}
              className="btn-primary text-sm flex items-center gap-1"
            >
              Voir tous
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className={`relative ${!userProfile.vipStatus ? 'section-vip-locked' : ''}`}>
          {!userProfile.vipStatus && (
            <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm bg-black/40 rounded-xl">
              <div className="text-center p-8">
                <Lock className="w-16 h-16 text-white mb-4 mx-auto" />
                <h3 className="text-2xl font-bold text-white mb-3">Contenu VIP Verrouillé</h3>
                <p className="text-white/90 mb-6 max-w-md">
                  Accédez à nos pronostics premium avec des cotes élevées et analyses approfondies
                </p>
                <button
                  onClick={() => onNavigate('vip-pricing')}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Crown className="w-5 h-5" />
                  Découvrir les offres VIP
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card p-6">
                  <div className="skeleton h-6 w-3/4 mb-4" />
                  <div className="skeleton h-4 w-full mb-2" />
                  <div className="skeleton h-4 w-5/6" />
                </div>
              ))}
            </div>
          ) : vipPredictions.length === 0 ? (
            <div className="card p-12 text-center">
              <Crown className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 dark:text-gray-400">
                Aucun pronostic VIP disponible pour le moment
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vipPredictions.slice(0, 6).map((prediction, index) => (
                <div
                  key={prediction.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <PredictionCard prediction={prediction} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">92%</div>
          <div className="text-gray-600 dark:text-gray-400">Taux de réussite</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">5K+</div>
          <div className="text-gray-600 dark:text-gray-400">Membres actifs</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">24/7</div>
          <div className="text-gray-600 dark:text-gray-400">Support disponible</div>
        </div>
      </div>
    </div>
  );
}
