import { useState, useEffect } from 'react';
import { getAllUsers, updateUser, createPrediction, getAllPredictions, updatePrediction, deletePrediction, movePredictionToHistory, broadcastNotification, getHistory, deleteHistory, restorePrediction } from '@/lib/database';
import { Prediction, PredictionCategory } from '@/types';
import { Users, Trophy, Plus, Edit, Trash2, Check, X, Shield, Crown, Ban, Filter, Send, History, RotateCcw } from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'predictions' | 'history' | 'notifications'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [history, setHistory] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPredictionForm, setShowPredictionForm] = useState(false);
  const [editingPrediction, setEditingPrediction] = useState<Prediction | null>(null);
  const [userFilter, setUserFilter] = useState<'all' | 'vip' | 'free' | 'banned'>('all');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'info' | 'success' | 'warning' | 'prediction'>('info');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [usersData, predictionsData, historyData] = await Promise.all([
      getAllUsers(),
      getAllPredictions(),
      getHistory(),
    ]);
    setUsers(usersData);
    setPredictions(predictionsData);
    setHistory(historyData);
    setLoading(false);
  };

  const handleToggleVIP = async (uid: string, currentStatus: boolean) => {
    if (currentStatus) {
      // Désactiver VIP
      if (confirm('Voulez-vous désactiver le VIP pour cet utilisateur ?')) {
        await updateUser(uid, {
          vipStatus: false,
          vipExpireDate: null,
        });
        await loadData();
        alert('VIP désactivé avec succès!');
      }
    } else {
      // Activer VIP
      const days = prompt('Entrez le nombre de jours pour l\'accès VIP:', '30');
      if (days && !isNaN(Number(days)) && Number(days) > 0) {
        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + Number(days));
        
        await updateUser(uid, {
          vipStatus: true,
          vipExpireDate: expireDate.toISOString(),
        });
        
        await loadData();
        alert(`VIP activé pour ${days} jours!`);
      }
    }
  };

  const handleModifyVIPExpiration = async (uid: string, currentExpiration: string) => {
    const currentDate = new Date(currentExpiration);
    const days = prompt(
      `Date d'expiration actuelle: ${currentDate.toLocaleDateString('fr-FR')}\n\nEntrez le nombre de jours à ajouter (nombre négatif pour réduire):`,
      '7'
    );
    
    if (days && !isNaN(Number(days))) {
      const newExpireDate = new Date(currentExpiration);
      newExpireDate.setDate(newExpireDate.getDate() + Number(days));
      
      await updateUser(uid, {
        vipExpireDate: newExpireDate.toISOString(),
      });
      
      await loadData();
      alert(`Date d'expiration mise à jour: ${newExpireDate.toLocaleDateString('fr-FR')}`);
    }
  };

  const handleBanUser = async (uid: string, banned: boolean) => {
    if (confirm(`Êtes-vous sûr de vouloir ${banned ? 'bannir' : 'débannir'} cet utilisateur ?`)) {
      await updateUser(uid, { banned });
      await loadData();
    }
  };

  const handleCreatePrediction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const prediction = {
      championship: formData.get('championship') as string,
      homeTeam: formData.get('homeTeam') as string,
      awayTeam: formData.get('awayTeam') as string,
      matchDate: formData.get('matchDate') as string,
      category: formData.get('category') as PredictionCategory,
      prediction: formData.get('prediction') as string,
      odds: formData.get('odds') as string,
      confidence: formData.get('confidence') as string,
      analysis: '',
      advice: '',
      status: 'active' as const,
    };

    if (editingPrediction?.id) {
      await updatePrediction(editingPrediction.id, prediction);
      alert('Pronostic modifié avec succès!');
    } else {
      await createPrediction(prediction);
      alert('Pronostic créé avec succès!');
    }
    
    setShowPredictionForm(false);
    setEditingPrediction(null);
    await loadData();
  };

  const handleDeletePrediction = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce pronostic ?')) {
      await deletePrediction(id);
      await loadData();
      alert('Pronostic supprimé!');
    }
  };

  const handleMovePrediction = async (id: string, status: 'won' | 'lost') => {
    if (confirm(`Marquer ce pronostic comme ${status === 'won' ? 'GAGNÉ' : 'PERDU'} ?`)) {
      await movePredictionToHistory(id, status);
      await loadData();
      alert(`Pronostic déplacé vers l'historique!`);
    }
  };

  const handleSendNotification = async () => {
    if (!notificationMessage.trim()) {
      alert('Veuillez entrer un message');
      return;
    }

    if (confirm('Envoyer cette notification à tous les utilisateurs ?')) {
      await broadcastNotification(notificationMessage, notificationType);
      setNotificationMessage('');
      alert('Notification envoyée à tous les utilisateurs!');
    }
  };

  const handleDeleteHistory = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer définitivement ce pronostic de l\'historique ?')) {
      await deleteHistory(id);
      await loadData();
      alert('Pronostic supprimé de l\'historique!');
    }
  };

  const handleRestorePrediction = async (id: string) => {
    if (confirm('Restaurer ce pronostic dans les pronostics actifs ?')) {
      await restorePrediction(id);
      await loadData();
      alert('Pronostic restauré!');
    }
  };

  const filteredUsers = users.filter(user => {
    if (userFilter === 'all') return true;
    if (userFilter === 'vip') return user.vipStatus;
    if (userFilter === 'free') return !user.vipStatus;
    if (userFilter === 'banned') return user.banned;
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-red-500" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Panneau d'Administration
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Gérez les utilisateurs, pronostics et notifications
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-dark-700'
          }`}
        >
          <Users className="w-5 h-5" />
          Utilisateurs
        </button>
        <button
          onClick={() => setActiveTab('predictions')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            activeTab === 'predictions'
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-dark-700'
          }`}
        >
          <Trophy className="w-5 h-5" />
          Pronostics
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            activeTab === 'history'
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-dark-700'
          }`}
        >
          <History className="w-5 h-5" />
          Historique
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            activeTab === 'notifications'
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-dark-700'
          }`}
        >
          <Send className="w-5 h-5" />
          Notifications
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Filter */}
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-500" />
              <div className="flex gap-2 flex-wrap">
                {[
                  { id: 'all', label: 'Tous' },
                  { id: 'vip', label: 'VIP' },
                  { id: 'free', label: 'FREE' },
                  { id: 'banned', label: 'Bannis' },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setUserFilter(filter.id as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      userFilter === filter.id
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              <span className="ml-auto text-sm text-gray-600 dark:text-gray-400">
                {filteredUsers.length} utilisateur(s)
              </span>
            </div>
          </div>

          {/* Users Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-dark-900">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-bold text-gray-700 dark:text-gray-300">Nom</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-gray-700 dark:text-gray-300">Email</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-gray-700 dark:text-gray-300">Statut</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-gray-700 dark:text-gray-300">VIP</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-gray-700 dark:text-gray-300">Expiration VIP</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={user.uid} className={`border-t border-gray-100 dark:border-dark-800 ${index % 2 === 0 ? 'bg-white dark:bg-dark-800' : 'bg-gray-50/50 dark:bg-dark-900/50'}`}>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-gray-900 dark:text-white">{user.name}</div>
                      </td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400 text-sm">{user.email}</td>
                      <td className="py-4 px-6">
                        {user.role === 'admin' ? (
                          <span className="badge bg-red-500 text-white">
                            <Shield className="w-3 h-3 mr-1" />
                            Admin
                          </span>
                        ) : user.banned ? (
                          <span className="badge bg-gray-500 text-white">
                            <Ban className="w-3 h-3 mr-1" />
                            Banni
                          </span>
                        ) : (
                          <span className="badge bg-green-500 text-white">✓ Actif</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {user.vipStatus ? (
                          <span className="badge-vip">
                            <Crown className="w-3 h-3 mr-1" />
                            VIP
                          </span>
                        ) : (
                          <span className="badge-free">FREE</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">
                        {user.vipExpireDate ? (
                          <span className={`${new Date(user.vipExpireDate) < new Date() ? 'text-red-500' : 'text-green-600'}`}>
                            {new Date(user.vipExpireDate).toLocaleDateString('fr-FR')}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2 flex-wrap">
                          {user.role !== 'admin' && (
                            <>
                              <button
                                onClick={() => handleToggleVIP(user.uid, user.vipStatus)}
                                className={`text-xs px-3 py-1.5 rounded-lg font-semibold text-white ${
                                  user.vipStatus
                                    ? 'bg-gray-500 hover:bg-gray-600'
                                    : 'bg-primary-500 hover:bg-primary-600'
                                }`}
                              >
                                {user.vipStatus ? '🔓 Désactiver VIP' : '👑 Activer VIP'}
                              </button>
                              {user.vipStatus && user.vipExpireDate && (
                                <button
                                  onClick={() => handleModifyVIPExpiration(user.uid, user.vipExpireDate!)}
                                  className="text-xs px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
                                >
                                  📅 Modifier Date
                                </button>
                              )}
                              <button
                                onClick={() => handleBanUser(user.uid, !user.banned)}
                                className={`text-xs px-3 py-1.5 rounded-lg font-semibold ${
                                  user.banned
                                    ? 'bg-green-500 hover:bg-green-600'
                                    : 'bg-red-500 hover:bg-red-600'
                                } text-white`}
                              >
                                {user.banned ? '✅ Débannir' : '🚫 Bannir'}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Predictions Tab */}
      {activeTab === 'predictions' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Gestion des pronostics ({predictions.length})
            </h2>
            <button
              onClick={() => {
                setShowPredictionForm(true);
                setEditingPrediction(null);
              }}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nouveau pronostic
            </button>
          </div>

          {showPredictionForm && (
            <div className="card p-8">
              <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                {editingPrediction ? '✏️ Modifier le pronostic' : '➕ Créer un nouveau pronostic'}
              </h3>
              <form onSubmit={handleCreatePrediction} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                    Championnat / Compétition
                  </label>
                  <input
                    type="text"
                    name="championship"
                    defaultValue={editingPrediction?.championship}
                    className="input-field"
                    placeholder="Ex: Premier League, Ligue 1, Champions League..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                    Équipe Domicile
                  </label>
                  <input
                    type="text"
                    name="homeTeam"
                    defaultValue={editingPrediction?.homeTeam}
                    className="input-field"
                    placeholder="Ex: PSG"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                    Équipe Extérieur
                  </label>
                  <input
                    type="text"
                    name="awayTeam"
                    defaultValue={editingPrediction?.awayTeam}
                    className="input-field"
                    placeholder="Ex: OM"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                    Date du Match
                  </label>
                  <input
                    type="date"
                    name="matchDate"
                    defaultValue={editingPrediction?.matchDate ? editingPrediction.matchDate.split('T')[0] : ''}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                    Catégorie
                  </label>
                  <select
                    name="category"
                    defaultValue={editingPrediction?.category}
                    className="input-field"
                    required
                  >
                    <option value="COTE_2_FREE">Côte 2 FREE</option>
                    <option value="ACCUMULATION_FREE">Accumulation FREE</option>
                    <option value="COTE_2_VIP">Côte 2 VIP</option>
                    <option value="COTE_5_VIP">Côte 5 VIP</option>
                    <option value="SCORE_EXACT_VIP">Score Exact VIP</option>
                    <option value="HT_FT_VIP">HT/FT VIP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                    Pronostic
                  </label>
                  <input
                    type="text"
                    name="prediction"
                    defaultValue={editingPrediction?.prediction}
                    className="input-field"
                    placeholder="Ex: 1X, Plus de 2.5 buts, Score 2-1..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                    Cote
                  </label>
                  <input
                    type="text"
                    name="odds"
                    defaultValue={editingPrediction?.odds}
                    className="input-field"
                    placeholder="Ex: 2.50"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                    Confiance
                  </label>
                  <input
                    type="text"
                    name="confidence"
                    defaultValue={editingPrediction?.confidence}
                    className="input-field"
                    placeholder="Ex: 85%, Haute, Moyenne..."
                    required
                  />
                </div>
                <div className="md:col-span-2 flex gap-3">
                  <button type="submit" className="btn-primary flex-1">
                    {editingPrediction ? '💾 Enregistrer les modifications' : '➕ Créer le pronostic'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPredictionForm(false);
                      setEditingPrediction(null);
                    }}
                    className="btn-secondary flex-1"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {predictions.map((prediction) => (
              <div key={prediction.id} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-5 h-5 text-primary-500" />
                      <h4 className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                        {prediction.championship}
                      </h4>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {prediction.homeTeam} vs {prediction.awayTeam}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="badge bg-primary-500 text-white">
                        {prediction.category.replace(/_/g, ' ')}
                      </span>
                      <span className="badge bg-blue-500 text-white">
                        Pronostic: {prediction.prediction}
                      </span>
                      <span className="badge bg-green-500 text-white">
                        Cote: {prediction.odds}
                      </span>
                      <span className="badge bg-purple-500 text-white">
                        {prediction.confidence}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      📅 Match le: {new Date(prediction.matchDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingPrediction(prediction);
                        setShowPredictionForm(true);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeletePrediction(prediction.id!)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleMovePrediction(prediction.id!, 'won')}
                    className="btn-primary text-sm flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Marquer GAGNÉ
                  </button>
                  <button
                    onClick={() => handleMovePrediction(prediction.id!, 'lost')}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 font-semibold"
                  >
                    <X className="w-4 h-4" />
                    Marquer PERDU
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Historique des pronostics ({history.length})
            </h2>
            <div className="flex items-center gap-2">
              <span className="badge bg-green-500 text-white">
                {history.filter(h => h.status === 'won').length} Gagnés
              </span>
              <span className="badge bg-red-500 text-white">
                {history.filter(h => h.status === 'lost').length} Perdus
              </span>
            </div>
          </div>

          {history.length === 0 ? (
            <div className="card p-12 text-center">
              <History className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 dark:text-gray-400">
                Aucun pronostic dans l'historique
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {history.map((prediction) => (
                <div key={prediction.id} className={`card p-6 border-l-4 ${
                  prediction.status === 'won' 
                    ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10' 
                    : 'border-red-500 bg-red-50/50 dark:bg-red-900/10'
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy className="w-5 h-5 text-primary-500" />
                        <h4 className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                          {prediction.championship}
                        </h4>
                        <span className={`badge ${
                          prediction.status === 'won' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        }`}>
                          {prediction.status === 'won' ? '✅ GAGNÉ' : '❌ PERDU'}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {prediction.homeTeam} vs {prediction.awayTeam}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="badge bg-primary-500 text-white">
                          {prediction.category.replace(/_/g, ' ')}
                        </span>
                        <span className="badge bg-blue-500 text-white">
                          Pronostic: {prediction.prediction}
                        </span>
                        <span className="badge bg-purple-500 text-white">
                          Cote: {prediction.odds}
                        </span>
                        <span className="badge bg-gray-500 text-white">
                          {prediction.confidence}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        📅 Match: {new Date(prediction.matchDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRestorePrediction(prediction.id!)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                        title="Restaurer dans les pronostics actifs"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteHistory(prediction.id!)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        title="Supprimer définitivement"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="card p-8">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              <Send className="w-6 h-6 text-red-500" />
              Envoyer une notification à tous les utilisateurs
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                  Type de notification
                </label>
                <select
                  value={notificationType}
                  onChange={(e) => setNotificationType(e.target.value as any)}
                  className="input-field"
                >
                  <option value="info">ℹ️ Information</option>
                  <option value="success">✅ Succès</option>
                  <option value="warning">⚠️ Avertissement</option>
                  <option value="prediction">🏆 Nouveau Pronostic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                  Message
                </label>
                <textarea
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  className="input-field"
                  rows={4}
                  placeholder="Entrez votre message pour tous les utilisateurs..."
                />
              </div>
              <button
                onClick={handleSendNotification}
                className="btn-primary w-full flex items-center justify-center gap-2"
                disabled={!notificationMessage.trim()}
              >
                <Send className="w-5 h-5" />
                Envoyer à tous les utilisateurs ({users.length})
              </button>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
              💡 Exemples de messages
            </h3>
            <div className="space-y-3">
              {[
                { type: 'prediction', text: '🏆 Nouveau pronostic VIP disponible ! Ne manquez pas cette opportunité.' },
                { type: 'success', text: '✅ Notre dernier pronostic est GAGNÉ ! Félicitations à tous nos membres VIP.' },
                { type: 'info', text: 'ℹ️ Rejoignez notre canal Telegram pour ne rien manquer : https://t.me/+EBiGK5As8NQ1MjI0' },
                { type: 'warning', text: '⚠️ Promotion limitée : -20% sur les abonnements VIP ce week-end !' },
              ].map((example, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setNotificationMessage(example.text);
                    setNotificationType(example.type as any);
                  }}
                  className="w-full text-left p-4 bg-gray-50 dark:bg-dark-700 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
                >
                  <p className="text-sm text-gray-700 dark:text-gray-300">{example.text}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
