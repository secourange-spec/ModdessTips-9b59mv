import { useState, useEffect } from 'react';
import { UserProfile } from '@/lib/auth';
import { Prediction, PredictionCategory } from '@/types';
import { observePredictions } from '@/lib/database';
import PredictionCard from '@/components/features/PredictionCard';
import { TrendingUp, Trophy, Target, Crown, Lock } from 'lucide-react';

interface PredictionsPageProps {
  userProfile: UserProfile;
}

export default function PredictionsPage({ userProfile }: PredictionsPageProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<PredictionCategory | 'ALL' | 'FREE' | 'VIP'>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = observePredictions((data) => {
      setPredictions(data.filter(p => p.status === 'active'));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const categories: Array<{ id: PredictionCategory | 'ALL' | 'FREE' | 'VIP'; label: string; icon: any; vip: boolean }> = [
    { id: 'ALL', label: 'Tous', icon: Trophy, vip: false },
    { id: 'FREE', label: 'FREE', icon: Target, vip: false },
    { id: 'COTE_2_FREE', label: 'Côte 2 Free', icon: Target, vip: false },
    { id: 'ACCUMULATION_FREE', label: 'Accumulation', icon: TrendingUp, vip: false },
    { id: 'VIP', label: 'VIP', icon: Crown, vip: true },
    { id: 'COTE_2_VIP', label: 'Côte 2 VIP', icon: Crown, vip: true },
    { id: 'COTE_5_VIP', label: 'Côte 5 VIP', icon: Trophy, vip: true },
    { id: 'SCORE_EXACT_VIP', label: 'Score Exact', icon: Target, vip: true },
    { id: 'HT_FT_VIP', label: 'HT/FT', icon: TrendingUp, vip: true },
  ];

  const filteredPredictions = predictions.filter(p => {
    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'FREE') return !p.category.includes('VIP');
    if (selectedCategory === 'VIP') return p.category.includes('VIP');
    return p.category === selectedCategory;
  }).filter(p => {
    const isVIPCategory = p.category.includes('VIP');
    return !isVIPCategory || userProfile.vipStatus;
  });

  const visibleCategories = categories.filter(cat => {
    if (cat.id === 'ALL') return true;
    return !cat.vip || userProfile.vipStatus;
  });

  const freePredictions = filteredPredictions.filter(p => !p.category.includes('VIP'));
  const vipPredictions = filteredPredictions.filter(p => p.category.includes('VIP'));

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Tous les Pronostics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Découvrez nos derniers pronostics sportifs
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {visibleCategories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap font-semibold transition-all ${
                  isActive
                    ? cat.vip
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                      : 'bg-green-500 text-white shadow-lg'
                    : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 border border-gray-200 dark:border-dark-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
                {cat.vip && <Crown className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Predictions Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card p-6">
              <div className="skeleton h-6 w-3/4 mb-4" />
              <div className="skeleton h-4 w-full mb-2" />
              <div className="skeleton h-4 w-5/6" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* FREE Section */}
          {(selectedCategory === 'ALL' || selectedCategory === 'FREE' || !selectedCategory.toString().includes('VIP')) && freePredictions.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <span className="badge-free text-base">GRATUIT</span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Pronostics FREE ({freePredictions.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {freePredictions.map((prediction, index) => (
                  <div
                    key={prediction.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <PredictionCard prediction={prediction} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIP Section */}
          {(selectedCategory === 'ALL' || selectedCategory === 'VIP' || selectedCategory.toString().includes('VIP')) && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="badge-vip text-base">VIP PREMIUM</span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Pronostics VIP ({vipPredictions.length})
                </h2>
                {!userProfile.vipStatus && (
                  <Lock className="w-5 h-5 text-primary-500" />
                )}
              </div>

              {!userProfile.vipStatus ? (
                <div className="card p-12 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-primary-600/10" />
                  <div className="relative z-10">
                    <Lock className="w-16 h-16 mx-auto text-primary-500 mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      Contenu VIP Verrouillé
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                      Passez au VIP pour accéder à nos pronostics premium avec des analyses approfondies
                    </p>
                    <button
                      onClick={() => window.location.href = '#'}
                      className="btn-primary inline-flex items-center gap-2"
                    >
                      <Crown className="w-5 h-5" />
                      Voir les offres VIP
                    </button>
                  </div>
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
                  {vipPredictions.map((prediction, index) => (
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
          )}

          {filteredPredictions.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Aucun pronostic disponible
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                De nouveaux pronostics seront bientôt ajoutés
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
