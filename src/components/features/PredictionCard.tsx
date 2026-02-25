import { Prediction } from '@/types';
import { Trophy, TrendingUp, Target, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

interface PredictionCardProps {
  prediction: Prediction;
  showResult?: boolean;
}

export default function PredictionCard({ prediction, showResult = false }: PredictionCardProps) {
  const getCategoryColor = (category: string) => {
    if (category.includes('COTE_2')) return 'from-blue-500 to-blue-600';
    if (category.includes('COTE_5')) return 'from-purple-500 to-purple-600';
    if (category.includes('ACCUMULATION')) return 'from-green-500 to-green-600';
    if (category.includes('SCORE_EXACT')) return 'from-red-500 to-red-600';
    if (category.includes('HT_FT')) return 'from-orange-500 to-orange-600';
    return 'from-gray-500 to-gray-600';
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes('ACCUMULATION')) return TrendingUp;
    if (category.includes('SCORE_EXACT')) return Target;
    return Trophy;
  };

  const Icon = getCategoryIcon(prediction.category);
  const colorGradient = getCategoryColor(prediction.category);

  return (
    <div className="card card-hover relative overflow-hidden group">
      {/* Header with Championship */}
      <div className={`bg-gradient-to-r ${colorGradient} px-4 py-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-white" />
            <span className="text-white font-semibold text-sm">
              {prediction.championship}
            </span>
          </div>
          <span className="badge bg-white/20 text-white text-xs">
            {prediction.category.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* Result Badge */}
      {showResult && (
        <div className="absolute top-3 right-3 z-10">
          {prediction.status === 'won' ? (
            <div className="flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
              <CheckCircle className="w-4 h-4" />
              GAGNÉ
            </div>
          ) : (
            <div className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
              <XCircle className="w-4 h-4" />
              PERDU
            </div>
          )}
        </div>
      )}

      <div className="p-5">
        {/* Teams */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1">
              <div className="text-base font-bold text-gray-900 dark:text-white mb-1">
                {prediction.homeTeam}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Domicile</div>
            </div>
            <div className="px-4 py-2 bg-gray-100 dark:bg-dark-700 rounded-lg">
              <span className="text-lg font-bold text-primary-600 dark:text-primary-400">VS</span>
            </div>
            <div className="flex-1 text-right">
              <div className="text-base font-bold text-gray-900 dark:text-white mb-1">
                {prediction.awayTeam}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Extérieur</div>
            </div>
          </div>
        </div>

        {/* Prediction & Odds */}
        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Pronostic</div>
              <div className="text-lg font-bold text-primary-700 dark:text-primary-300">
                {prediction.prediction}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Cote</div>
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {prediction.odds}
              </div>
            </div>
          </div>
        </div>

        {/* Confidence */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Confiance</span>
          <span className="badge bg-green-500 text-white font-bold">{prediction.confidence}</span>
        </div>

        {/* Footer with Dates */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-dark-700">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Match: {new Date(prediction.matchDate).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Publié: {new Date(prediction.createdAt).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: 'short',
            })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
