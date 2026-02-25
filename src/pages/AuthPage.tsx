import { useState } from 'react';
import { signIn, signUp } from '@/lib/auth';
import { Trophy, Mail, Lock, User } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, name);
      }
    } catch (err: any) {
      console.log('Auth error:', err);
      
      // Gestion des erreurs Firebase avec messages en français
      let errorMessage = 'Une erreur est survenue';
      
      if (err.code) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            errorMessage = '❌ Cet email est déjà utilisé. Veuillez vous connecter ou utiliser un autre email.';
            break;
          case 'auth/invalid-email':
            errorMessage = '❌ Format d\'email invalide.';
            break;
          case 'auth/operation-not-allowed':
            errorMessage = '❌ Opération non autorisée.';
            break;
          case 'auth/weak-password':
            errorMessage = '❌ Le mot de passe doit contenir au moins 6 caractères.';
            break;
          case 'auth/user-disabled':
            errorMessage = '❌ Ce compte a été désactivé.';
            break;
          case 'auth/user-not-found':
            errorMessage = '❌ Aucun compte trouvé avec cet email.';
            break;
          case 'auth/wrong-password':
            errorMessage = '❌ Mot de passe incorrect.';
            break;
          case 'auth/too-many-requests':
            errorMessage = '❌ Trop de tentatives. Réessayez plus tard.';
            break;
          case 'auth/network-request-failed':
            errorMessage = '❌ Erreur réseau. Vérifiez votre connexion internet.';
            break;
          default:
            errorMessage = err.message || 'Une erreur est survenue';
        }
      } else {
        errorMessage = err.message || 'Une erreur est survenue';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo & Title */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl mb-4 animate-pulse-glow">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">MODDESS TIPS</h1>
          <p className="text-gray-400">Pronostics Sportifs Professionnels</p>
        </div>

        {/* Auth Card */}
        <div className="card p-8 animate-slide-up">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                isLogin
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                !isLogin
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              Inscription
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Nom complet
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field pl-11"
                    placeholder="Votre nom"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-11"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-11"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Chargement...' : isLogin ? 'Se connecter' : "S'inscrire"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
