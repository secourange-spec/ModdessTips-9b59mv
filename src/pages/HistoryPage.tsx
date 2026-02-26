import { useState, useEffect } from 'react';
import { Prediction, PredictionCategory } from '@/types';
import { getHistory } from '@/lib/database';
import PredictionCard from '@/components/features/PredictionCard';
import { History, TrophyIcon, XCircle, Target, TrendingUp } from 'lucide-react';
import { UserProfile } from '@/lib/auth';

interface HistoryPageProps {
  userProfile: UserProfile;
}

export default function HistoryPage({ userProfile }: HistoryPageProps) {
  const [history, setHistory] = useState<Prediction[]>([]);
  const [resultFilter, setResultFilter] = useState<'all' | 'won' | 'lost'>('all');
  const [categoryFilter, setCategoryFilter] = useState<PredictionCategory | 'ALL' | 'FREE' | 'VIP'>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await getHistory();
    setHistory(data);
    setLoading(false);
  };

  const categories: Array<{ id: PredictionCategory | 'ALL' | 'FREE' | 'VIP'; label: string; icon: any }> = [
    { id: 'ALL', label: 'Toutes', icon: History },
    { id: 'FREE', label: 'FREE', icon: Target },
    { id: 'COTE_2_FREE', label: 'Côte 2 Free', icon: Target },
    { id: 'ACCUMULATION_FREE', label: 'Accumulation', icon: TrendingUp },
    { id: 'VIP', label: 'VIP', icon: TrophyIcon },
    { id: 'COTE_2_VIP', label: 'Côte 2 VIP', icon: Target },
    { id: 'COTE_5_VIP', label: 'Côte 5 VIP', icon: TrophyIcon },
    { id: 'SCORE_EXACT_VIP', label: 'Score Exact', icon: Target },
    { id: 'HT_FT_VIP', label: 'HT/FT', icon: TrendingUp },
  ];

  const filteredHistory = history.filter(p => {
    // Filter by result
    if (resultFilter !== 'all' && p.status !== resultFilter) return false;
    
    // Filter by category
    if (categoryFilter === 'ALL') return true;
    if (categoryFilter === 'FREE') return !p.category.includes('VIP');
    if (categoryFilter === 'VIP') return p.category.includes('VIP');
    return p.category === categoryFilter;
  });

  const stats = {
    total: history.length,
    won: history.filter(p => p.status === 'won').length,
    lost: history.filter(p => p.status === 'lost').length,
  };

  const categoryStats = {
    total: filteredHistory.length,
    won: filteredHistory.filter(p => p.status === 'won').length,
    lost: filteredHistory.filter(p => p.status === 'lost').length,
  };

  const winRate = stats.total > 0 ? ((stats.won / stats.total) * 100).toFixed(1) : 0;
  const categoryWinRate = categoryStats.total > 0 ? ((categoryStats.won / categoryStats.total) * 100).toFixed(1) : 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Historique des Pronostics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Consultez les résultats de nos pronostics passés par section
        </p>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-6">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {stats.total}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Global</div>
        </div>
        <div className="card p-6">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {stats.won}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Gagnés</div>
        </div>
        <div className="card p-6">
          <div className="text-2xl font-bold text-red-600 mb-1">
            {stats.lost}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Perdus</div>
        </div>
        <div className="card p-6">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
            {winRate}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Taux Global</div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Filtrer par section</h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = categoryFilter === cat.id;
            
            return (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap font-semibold transition-all ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 border border-gray-200 dark:border-dark-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Stats */}
      {categoryFilter !== 'ALL' && (
        <div className="card p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Statistiques - {categories.find(c => c.id === categoryFilter)?.label}
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">{categoryStats.total}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
            </div>
            <div>
              <div className="text-xl font-bold text-green-600">{categoryStats.won} gagnés</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{categoryStats.lost} perdus</div>
            </div>
            <div>
              <div className="text-xl font-bold text-primary-600 dark:text-primary-400">{categoryWinRate}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Taux de réussite</div>
            </div>
          </div>
        </div>
      )}

      {/* Result Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Filtrer par résultat</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setResultFilter('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              resultFilter === 'all'
                ? 'bg-primary-500 text-white'
                : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <History className="w-4 h-4" />
            Tous
          </button>
          <button
            onClick={() => setResultFilter('won')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              resultFilter === 'won'
                ? 'bg-green-500 text-white'
                : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <TrophyIcon className="w-4 h-4" />
            Gagnés
          </button>
          <button
            onClick={() => setResultFilter('lost')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              resultFilter === 'lost'
                ? 'bg-red-500 text-white'
                : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <XCircle className="w-4 h-4" />
            Perdus
          </button>
        </div>
      </div>

      {/* History Grid */}
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
      ) : filteredHistory.length === 0 ? (
        <div className="text-center py-12">
          <History className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Aucun historique disponible
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {categoryFilter !== 'ALL' 
              ? `Aucun pronostic dans la section ${categories.find(c => c.id === categoryFilter)?.label}`
              : 'Aucun pronostic dans l\'historique'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHistory.map((prediction, index) => (
            <div
              key={prediction.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <PredictionCard prediction={prediction} showResult />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
