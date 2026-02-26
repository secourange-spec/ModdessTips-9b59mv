# 🚀 Guide de Déploiement GitHub Pages

Ce guide vous explique comment déployer MODDESS TIPS sur GitHub Pages.

## 📋 Prérequis

1. Un compte GitHub
2. Votre code pushé sur un repository GitHub
3. Vos clés Firebase (depuis Firebase Console)

---

## 🔧 Configuration Initiale

### 1. Modifier `vite.config.ts`

Ouvrez `vite.config.ts` et remplacez `'nom-de-votre-repo'` par le nom réel de votre repository GitHub :

```typescript
base: process.env.NODE_ENV === 'production' ? '/moddess-tips/' : '/',
```

Par exemple, si votre repo est `https://github.com/username/moddess-tips`, utilisez `/moddess-tips/`

### 2. Configurer les Secrets GitHub

1. Allez sur votre repository GitHub
2. Cliquez sur **Settings** (Paramètres)
3. Dans le menu de gauche, cliquez sur **Secrets and variables** → **Actions**
4. Cliquez sur **New repository secret**
5. Ajoutez les secrets suivants (un par un) :

| Nom du Secret | Valeur |
|---------------|--------|
| `VITE_FIREBASE_API_KEY` | AIzaSyDiV6Wft0AEByYh1z14Q3niTiTCRMwrdrc |
| `VITE_FIREBASE_AUTH_DOMAIN` | modess-68d0d.firebaseapp.com |
| `VITE_FIREBASE_DATABASE_URL` | https://modess-68d0d-default-rtdb.firebaseio.com |
| `VITE_FIREBASE_PROJECT_ID` | modess-68d0d |
| `VITE_FIREBASE_STORAGE_BUCKET` | modess-68d0d.firebasestorage.app |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | 596193001452 |
| `VITE_FIREBASE_APP_ID` | 1:596193001452:web:c9214b990dfc5e13320ac9 |
| `VITE_FIREBASE_MEASUREMENT_ID` | G-1DMCJFCJWJ |

### 3. Activer GitHub Pages

1. Toujours dans **Settings**
2. Cliquez sur **Pages** dans le menu de gauche
3. Sous **Source**, sélectionnez **GitHub Actions**

---

## 🚀 Déploiement

### Déploiement Automatique (Recommandé)

Le site se déploie automatiquement à chaque fois que vous poussez du code sur la branche `main` :

```bash
git add .
git commit -m "Mise à jour du site"
git push origin main
```

Le déploiement prend environ 2-3 minutes. Vous pouvez suivre la progression dans l'onglet **Actions** de votre repository.

### Déploiement Manuel

1. Allez dans l'onglet **Actions** de votre repository
2. Cliquez sur **Deploy to GitHub Pages** dans la liste des workflows
3. Cliquez sur **Run workflow**
4. Sélectionnez la branche `main` et cliquez sur **Run workflow**

---

## 🌐 Accéder à votre Site

Après le déploiement réussi, votre site sera accessible à :

```
https://votre-username.github.io/nom-de-votre-repo/
```

Par exemple : `https://john.github.io/moddess-tips/`

---

## 🔍 Vérification

### Vérifier le Build

Dans l'onglet **Actions**, vous verrez :
- ✅ Build et Deploy réussis (cercle vert)
- ❌ Erreurs de build (croix rouge)

En cas d'erreur, cliquez sur le workflow échoué pour voir les logs détaillés.

### Tester Firebase

Une fois déployé, testez ces fonctionnalités :
- ✅ Connexion / Inscription
- ✅ Affichage des prédictions
- ✅ Accès admin
- ✅ Notifications

---

## 🔄 Mises à Jour

Pour mettre à jour le site :

1. Modifiez votre code localement
2. Commitez les changements :
   ```bash
   git add .
   git commit -m "Description des changements"
   git push origin main
   ```
3. Le déploiement se lance automatiquement

---

## 🆘 Dépannage

### Le site ne se charge pas

1. Vérifiez que le `base` dans `vite.config.ts` correspond au nom de votre repo
2. Attendez 5-10 minutes après le premier déploiement
3. Videz le cache de votre navigateur (Ctrl+Shift+R)

### Erreur Firebase

1. Vérifiez que tous les secrets GitHub sont bien configurés
2. Vérifiez qu'il n'y a pas de fautes de frappe dans les noms des secrets
3. Assurez-vous que Firebase autorise votre domaine GitHub Pages dans la console Firebase :
   - Firebase Console → Authentication → Settings → Authorized domains
   - Ajoutez : `votre-username.github.io`

### Le workflow échoue

1. Allez dans **Actions** → cliquez sur le workflow échoué
2. Lisez les logs d'erreur
3. Vérifiez que toutes les dépendances sont dans `package.json`
4. Vérifiez que les secrets GitHub sont configurés

---

## 📚 Ressources Supplémentaires

- [Documentation GitHub Pages](https://docs.github.com/pages)
- [Documentation GitHub Actions](https://docs.github.com/actions)
- [Documentation Vite](https://vitejs.dev/guide/static-deploy.html#github-pages)
- [Documentation Firebase](https://firebase.google.com/docs)

---

## 🎉 C'est Tout !

Votre site MODDESS TIPS est maintenant déployé et accessible publiquement !

Pour toute question, consultez les logs dans l'onglet Actions ou vérifiez la configuration Firebase.
