import { useState, useEffect } from 'react';
import { Prediction } from '@/types';
import { getHistory } from '@/lib/database';
import PredictionCard from '@/components/features/PredictionCard';
import { History, TrophyIcon, XCircle } from 'lucide-react';

export default function HistoryPage() {
  const [history, setHistory] = useState<Prediction[]>([]);
  const [filter, setFilter] = useState<'all' | 'won' | 'lost'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await getHistory();
    setHistory(data);
    setLoading(false);
  };

  const filteredHistory = history.filter(p => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const stats = {
    total: history.length,
    won: history.filter(p => p.status === 'won').length,
    lost: history.filter(p => p.status === 'lost').length,
  };

  const winRate = stats.total > 0 ? ((stats.won / stats.total) * 100).toFixed(1) : 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Historique
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Consultez les résultats de nos pronostics passés
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-6">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {stats.total}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
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
          <div className="text-sm text-gray-600 dark:text-gray-400">Taux de réussite</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setFilter('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
            filter === 'all'
              ? 'bg-primary-500 text-white'
              : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          <History className="w-4 h-4" />
          Tous
        </button>
        <button
          onClick={() => setFilter('won')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
            filter === 'won'
              ? 'bg-green-500 text-white'
              : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          <TrophyIcon className="w-4 h-4" />
          Gagnés
        </button>
        <button
          onClick={() => setFilter('lost')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
            filter === 'lost'
              ? 'bg-red-500 text-white'
              : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          <XCircle className="w-4 h-4" />
          Perdus
        </button>
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
