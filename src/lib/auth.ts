import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { ref, set, get, update } from 'firebase/database';
import { auth, database } from './firebase';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  vipStatus: boolean;
  vipExpireDate: string | null;
  banned: boolean;
  createdAt: string;
}

export const signUp = async (email: string, password: string, name: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  const userProfile: UserProfile = {
    uid: user.uid,
    name,
    email,
    role: 'user',
    vipStatus: false,
    vipExpireDate: null,
    banned: false,
    createdAt: new Date().toISOString()
  };

  await set(ref(database, `users/${user.uid}`), userProfile);
  return userProfile;
};

export const signIn = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  await checkAndUpdateVIPStatus(userCredential.user.uid);
  return userCredential.user;
};

export const signOut = async () => {
  await firebaseSignOut(auth);
};

export const getCurrentUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userRef = ref(database, `users/${uid}`);
  const snapshot = await get(userRef);
  
  if (snapshot.exists()) {
    await checkAndUpdateVIPStatus(uid);
    const updatedSnapshot = await get(userRef);
    return updatedSnapshot.val() as UserProfile;
  }
  return null;
};

export const checkAndUpdateVIPStatus = async (uid: string) => {
  const userRef = ref(database, `users/${uid}`);
  const snapshot = await get(userRef);
  
  if (snapshot.exists()) {
    const userData = snapshot.val() as UserProfile;
    
    if (userData.vipStatus && userData.vipExpireDate) {
      const expireDate = new Date(userData.vipExpireDate);
      const now = new Date();
      
      if (now > expireDate) {
        await update(userRef, { vipStatus: false });
      }
    }
  }
};

export const observeAuthState = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
