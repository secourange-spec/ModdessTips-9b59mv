# 🏆 MODDESS TIPS

Plateforme professionnelle de pronostics sportifs avec système FREE/VIP et tableau de bord administrateur.

## 🌟 Fonctionnalités

### Pour les Utilisateurs
- **Sections FREE** : Côte 2, Accumulation
- **Sections VIP** : Côte 2, Côte 5, Score Exact, HT/FT
- **Historique** : Filtrage par section avec badges
- **Profil** : Gestion du compte et liens Telegram
- **Tarifs VIP** : Plans 1 semaine, 1 mois, 3 mois

### Pour les Administrateurs
- **Gestion des Utilisateurs** : Activation/désactivation VIP, gestion des dates d'expiration, bannissement
- **Gestion des Pronostics** : Ajout, modification, suppression
- **Gestion de l'Historique** : Organisation des résultats passés
- **Notifications** : Diffusion de messages à tous les utilisateurs
- **Tableau de bord** : Vue d'ensemble complète

## 🛠️ Technologies

- **Frontend** : React 18.3 + TypeScript + Tailwind CSS
- **Backend** : Firebase (Auth + Realtime Database)
- **Build** : Vite 5.4
- **Icons** : Lucide React
- **Routing** : React Router DOM

## 🚀 Démarrage Rapide

### Installation Locale

```bash
# Cloner le repository
git clone https://github.com/votre-username/moddess-tips.git
cd moddess-tips

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env
# Modifiez .env avec vos clés Firebase

# Lancer le serveur de développement
npm run dev
```

Le site sera accessible sur `http://localhost:8080`

### Déploiement sur GitHub Pages

Voir le guide complet : [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

**Résumé rapide :**

1. Modifier `vite.config.ts` avec le nom de votre repo
2. Configurer les secrets Firebase dans GitHub Settings
3. Activer GitHub Pages (Source: GitHub Actions)
4. Push sur `main` → déploiement automatique

## 📁 Structure du Projet

```
src/
├── components/
│   ├── features/       # Composants métier
│   └── layout/         # Composants de mise en page
├── lib/
│   ├── auth.ts         # Gestion authentification
│   ├── database.ts     # Opérations Firebase
│   └── firebase.ts     # Configuration Firebase
├── pages/
│   ├── AdminPage.tsx
│   ├── AuthPage.tsx
│   ├── HistoryPage.tsx
│   ├── HomePage.tsx
│   ├── PredictionsPage.tsx
│   ├── ProfilePage.tsx
│   └── VIPPricingPage.tsx
└── types/
    └── index.ts        # Types TypeScript
```

## 🔑 Variables d'Environnement

Créez un fichier `.env` à la racine avec :

```env
VITE_FIREBASE_API_KEY=votre_api_key
VITE_FIREBASE_AUTH_DOMAIN=votre-projet.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://votre-projet.firebaseio.com
VITE_FIREBASE_PROJECT_ID=votre-projet
VITE_FIREBASE_STORAGE_BUCKET=votre-projet.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
VITE_FIREBASE_APP_ID=votre_app_id
VITE_FIREBASE_MEASUREMENT_ID=votre_measurement_id
```

## 👤 Compte Admin

Pour accéder au panneau admin, l'email de l'utilisateur doit être `admin@moddess.com` ou configuré dans `src/lib/auth.ts`.

## 🔗 Liens Telegram

- **Contact Admin** : https://t.me/servant12r
- **Canal VIP** : https://t.me/+EBiGK5As8NQ1MjI0

## 📝 Scripts Disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Prévisualiser le build
npm run lint         # Vérifier le code
```

## 🔒 Sécurité Firebase

Les clés Firebase sont stockées dans :
- **Local** : fichier `.env` (git-ignoré)
- **GitHub Actions** : GitHub Secrets
- **Fallback** : valeurs par défaut dans `firebase.ts` (pour compatibilité OnSpace)

## 📱 Responsive Design

Le site est entièrement responsive :
- 📱 Mobile first
- 💻 Tablette optimisé
- 🖥️ Desktop avec layout étendu

## 🎨 Thème

- Mode clair / sombre
- Palette de couleurs personnalisée
- Animations fluides
- Design moderne et professionnel

## 📄 Licence

Tous droits réservés © 2025 MODDESS TIPS

## 🤝 Support

Pour toute question ou problème :
- Telegram : [@servant12r](https://t.me/servant12r)
- GitHub Issues : [Créer une issue](https://github.com/votre-username/moddess-tips/issues)

---

Développé avec ❤️ pour la communauté des parieurs sportifs
