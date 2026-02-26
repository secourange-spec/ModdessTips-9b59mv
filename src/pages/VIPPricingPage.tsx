import { Crown, Check, Send } from 'lucide-react';

export default function VIPPricingPage() {
  const plans = [
    {
      id: '1week',
      duration: '1 Semaine',
      price: 15,
      features: [
        'Accès à tous les pronostics VIP',
        'Côte 2 VIP illimités',
        'Côte 5 VIP premium',
        'Score exact VIP',
        'HT/FT VIP',
        'Support prioritaire 24/7',
      ],
      popular: false,
    },
    {
      id: '1month',
      duration: '1 Mois',
      price: 30,
      features: [
        'Tous les avantages 1 semaine',
        'Statistiques détaillées',
        'Analyses approfondies',
        'Notifications prioritaires',
        'Historique complet',
        'Garantie satisfaction',
      ],
      popular: true,
    },
    {
      id: '3months',
      duration: '3 Mois',
      price: 50,
      features: [
        'Tous les avantages 1 mois',
        'Meilleur rapport qualité/prix',
        '16$ par mois seulement',
        'Accès anticipé aux nouveaux tips',
        'Consultation personnalisée',
        'Badge VIP Platinum',
      ],
      popular: false,
    },
  ];

  const handleSubscribe = (plan: typeof plans[0]) => {
    const messages = {
      '1week': 'Salutation Leader 👋\n\nJe suis là pour la souscription à l\'offre VIP 1 SEMAINE (15$).\n\nMerci !',
      '1month': 'Salutation Leader 👋\n\nJe suis là pour la souscription à l\'offre VIP 1 MOIS (30$).\n\nMerci !',
      '3months': 'Salutation Leader 👋\n\nJe suis là pour la souscription à l\'offre VIP 3 MOIS (50$).\n\nMerci !',
    };

    const message = encodeURIComponent(messages[plan.id as keyof typeof messages]);
    window.open(`https://t.me/servant12r?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl mb-4">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          Passez au VIP PRO
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Accédez à nos pronostics premium avec un taux de réussite de 92%
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {plans.map((plan, index) => (
          <div
            key={plan.id}
            className={`card p-8 relative animate-slide-up ${
              plan.popular ? 'ring-2 ring-primary-500 shadow-2xl scale-105' : ''
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="badge-vip px-4 py-1">
                  ⭐ Plus Populaire
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                {plan.duration}
              </h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold text-primary-600 dark:text-primary-400">
                  ${plan.price}
                </span>
                <span className="text-gray-500 dark:text-gray-400">USD</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan)}
              className={`w-full ${
                plan.popular ? 'btn-primary' : 'btn-secondary'
              } flex items-center justify-center gap-2`}
            >
              <Send className="w-4 h-4" />
              Souscrire maintenant
            </button>
          </div>
        ))}
      </div>

      {/* Features Grid */}
      <div className="card p-8 mb-8 animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Pourquoi choisir MODDESS TIPS VIP ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: '92% de réussite', description: 'Taux de réussite vérifié' },
            { title: 'Analyses pro', description: 'Expertise approfondie' },
            { title: 'Support 24/7', description: 'Assistance prioritaire' },
            { title: 'Communauté VIP', description: 'Accès canal exclusif' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="card p-8 animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Questions fréquentes
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
              Comment activer mon abonnement VIP ?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Cliquez sur "Souscrire maintenant", vous serez redirigé vers Telegram pour contacter l'admin. 
              Une fois le paiement effectué, votre compte sera activé sous 24h.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
              Puis-je annuler mon abonnement ?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Les abonnements sont valables pour la durée choisie. Aucun renouvellement automatique.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
              Quels sont les moyens de paiement acceptés ?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Contactez l'admin sur Telegram pour connaître les options de paiement disponibles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
