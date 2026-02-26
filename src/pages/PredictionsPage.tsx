import { useState, useEffect } from 'react';
import { UserProfile } from '@/lib/auth';
import { Prediction, PredictionCategory } from '@/types';
import { observePredictions } from '@/lib/database';
import PredictionCard from '@/components/features/PredictionCard';
import { TrendingUp, Trophy, Target, Crown, Lock, BarChart3 } from 'lucide-react';

interface PredictionsPageProps {
  userProfile: UserProfile;
}

export default function PredictionsPage({ userProfile }: PredictionsPageProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [selectedSection, setSelectedSection] = useState<PredictionCategory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = observePredictions((data) => {
      setPredictions(data.filter(p => p.status === 'active'));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const freeSections = [
    { id: 'COTE_2_FREE' as PredictionCategory, label: 'Côte 2', icon: Target, color: 'from-blue-500 to-blue-600' },
    { id: 'ACCUMULATION_FREE' as PredictionCategory, label: 'Accumulation', icon: TrendingUp, color: 'from-green-500 to-green-600' },
  ];

  const vipSections = [
    { id: 'COTE_2_VIP' as PredictionCategory, label: 'Côte 2', icon: Target, color: 'from-purple-500 to-purple-600' },
    { id: 'COTE_5_VIP' as PredictionCategory, label: 'Côte 5', icon: BarChart3, color: 'from-indigo-500 to-indigo-600' },
    { id: 'SCORE_EXACT_VIP' as PredictionCategory, label: 'Score Exact', icon: Trophy, color: 'from-red-500 to-red-600' },
    { id: 'HT_FT_VIP' as PredictionCategory, label: 'HT/FT', icon: TrendingUp, color: 'from-orange-500 to-orange-600' },
  ];

  const filteredPredictions = selectedSection 
    ? predictions.filter(p => p.category === selectedSection)
    : [];

  const getSectionData = (sectionId: PredictionCategory) => {
    const count = predictions.filter(p => p.category === sectionId).length;
    return count;
  };

  if (selectedSection) {
    const section = [...freeSections, ...vipSections].find(s => s.id === selectedSection);
    const Icon = section?.icon || Target;

    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <button
            onClick={() => setSelectedSection(null)}
            className="text-primary-500 hover:text-primary-600 font-semibold mb-4 flex items-center gap-2"
          >
            ← Retour
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-12 h-12 bg-gradient-to-r ${section?.color} rounded-xl flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {section?.label}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedSection.includes('VIP') ? 'Section VIP Premium' : 'Section FREE'}
              </p>
            </div>
          </div>
        </div>

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
        ) : filteredPredictions.length === 0 ? (
          <div className="card p-12 text-center">
            <Icon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Aucun pronostic disponible
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              De nouveaux pronostics seront bientôt ajoutés dans cette section
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPredictions.map((prediction, index) => (
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
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* FREE Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="badge-free text-base px-4 py-2">GRATUIT</span>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sections FREE</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {freeSections.map((section) => {
            const Icon = section.icon;
            const count = getSectionData(section.id);

            return (
              <button
                key={section.id}
                onClick={() => setSelectedSection(section.id)}
                className="card p-8 text-left hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${section.color} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`} />
                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-r ${section.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {section.label}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600 dark:text-gray-400">
                      {count} pronostic{count !== 1 ? 's' : ''} disponible{count !== 1 ? 's' : ''}
                    </p>
                    <span className="text-primary-500 font-semibold group-hover:translate-x-2 transition-transform">
                      Voir →
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* VIP Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <span className="badge-vip text-base px-4 py-2">VIP PREMIUM</span>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sections VIP</h2>
          {!userProfile.vipStatus && <Lock className="w-6 h-6 text-primary-500" />}
        </div>

        {!userProfile.vipStatus ? (
          <div className="card p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-primary-600/10" />
            <div className="relative z-10">
              <Lock className="w-20 h-20 mx-auto text-primary-500 mb-6" />
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Sections VIP Verrouillées
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Passez au VIP pour débloquer l'accès à 4 sections premium avec des pronostics exclusifs et un taux de réussite exceptionnel
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {vipSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <div key={section.id} className="bg-white/50 dark:bg-dark-800/50 p-4 rounded-xl backdrop-blur-sm">
                      <div className={`w-12 h-12 bg-gradient-to-r ${section.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{section.label}</p>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => window.location.href = '#'}
                className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2"
              >
                <Crown className="w-6 h-6" />
                Voir les offres VIP
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vipSections.map((section) => {
              const Icon = section.icon;
              const count = getSectionData(section.id);

              return (
                <button
                  key={section.id}
                  onClick={() => setSelectedSection(section.id)}
                  className="card p-8 text-left hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${section.color} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`} />
                  <div className="relative z-10">
                    <div className={`w-16 h-16 bg-gradient-to-r ${section.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      {section.label}
                      <Crown className="w-5 h-5 text-primary-500" />
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-600 dark:text-gray-400">
                        {count} pronostic{count !== 1 ? 's' : ''} disponible{count !== 1 ? 's' : ''}
                      </p>
                      <span className="text-primary-500 font-semibold group-hover:translate-x-2 transition-transform">
                        Voir →
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
