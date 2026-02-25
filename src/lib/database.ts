import { ref, push, set, get, update, remove, onValue, query, orderByChild } from 'firebase/database';
import { database } from './firebase';

export interface Prediction {
  id?: string;
  championship: string;
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
  category: 'COTE_2_FREE' | 'ACCUMULATION_FREE' | 'COTE_2_VIP' | 'COTE_5_VIP' | 'SCORE_EXACT_VIP' | 'HT_FT_VIP';
  prediction: string;
  odds: string;
  confidence: string;
  analysis: string;
  advice: string;
  status: 'active' | 'won' | 'lost';
  createdAt: string;
  updatedAt?: string;
}

export interface Notification {
  id?: string;
  userId: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'prediction';
  read: boolean;
  createdAt: string;
}

// Predictions
export const createPrediction = async (prediction: Omit<Prediction, 'id' | 'createdAt'>) => {
  const predictionsRef = ref(database, 'predictions');
  const newPredictionRef = push(predictionsRef);
  
  const newPrediction: Prediction = {
    ...prediction,
    analysis: prediction.analysis || '',
    advice: prediction.advice || '',
    id: newPredictionRef.key!,
    createdAt: new Date().toISOString(),
    status: 'active'
  };
  
  await set(newPredictionRef, newPrediction);
  return newPrediction;
};

export const updatePrediction = async (id: string, updates: Partial<Prediction>) => {
  const predictionRef = ref(database, `predictions/${id}`);
  await update(predictionRef, {
    ...updates,
    updatedAt: new Date().toISOString()
  });
};

export const deletePrediction = async (id: string) => {
  const predictionRef = ref(database, `predictions/${id}`);
  await remove(predictionRef);
};

export const movePredictionToHistory = async (id: string, status: 'won' | 'lost') => {
  const predictionRef = ref(database, `predictions/${id}`);
  const snapshot = await get(predictionRef);
  
  if (snapshot.exists()) {
    const prediction = snapshot.val();
    const historyRef = ref(database, `history/${id}`);
    
    await set(historyRef, {
      ...prediction,
      status,
      movedAt: new Date().toISOString()
    });
    
    await remove(predictionRef);
  }
};

export const getAllPredictions = async (): Promise<Prediction[]> => {
  const predictionsRef = ref(database, 'predictions');
  const snapshot = await get(predictionsRef);
  
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.values(data);
  }
  return [];
};

export const getHistory = async (): Promise<Prediction[]> => {
  const historyRef = ref(database, 'history');
  const snapshot = await get(historyRef);
  
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.values(data);
  }
  return [];
};

export const deleteHistory = async (id: string) => {
  const historyRef = ref(database, `history/${id}`);
  await remove(historyRef);
};

export const restorePrediction = async (id: string) => {
  const historyRef = ref(database, `history/${id}`);
  const snapshot = await get(historyRef);
  
  if (snapshot.exists()) {
    const prediction = snapshot.val();
    const predictionRef = ref(database, `predictions/${id}`);
    
    await set(predictionRef, {
      ...prediction,
      status: 'active',
      updatedAt: new Date().toISOString()
    });
    
    await remove(historyRef);
  }
};

export const observePredictions = (callback: (predictions: Prediction[]) => void) => {
  const predictionsRef = ref(database, 'predictions');
  
  return onValue(predictionsRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const predictions = Object.values(data) as Prediction[];
      callback(predictions);
    } else {
      callback([]);
    }
  });
};

// Notifications
export const createNotification = async (userId: string, message: string, type: Notification['type'] = 'info') => {
  const notificationsRef = ref(database, `notifications/${userId}`);
  const newNotificationRef = push(notificationsRef);
  
  const notification: Notification = {
    id: newNotificationRef.key!,
    userId,
    message,
    type,
    read: false,
    createdAt: new Date().toISOString()
  };
  
  await set(newNotificationRef, notification);
  return notification;
};

export const broadcastNotification = async (message: string, type: Notification['type'] = 'info') => {
  const users = await getAllUsers();
  const promises = users.map((user: any) => 
    createNotification(user.uid, message, type)
  );
  await Promise.all(promises);
};

export const markNotificationAsRead = async (userId: string, notificationId: string) => {
  const notificationRef = ref(database, `notifications/${userId}/${notificationId}`);
  await update(notificationRef, { read: true });
};

export const observeNotifications = (userId: string, callback: (notifications: Notification[]) => void) => {
  const notificationsRef = ref(database, `notifications/${userId}`);
  
  return onValue(notificationsRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const notifications = Object.values(data) as Notification[];
      callback(notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } else {
      callback([]);
    }
  });
};

// Users
export const getAllUsers = async () => {
  const usersRef = ref(database, 'users');
  const snapshot = await get(usersRef);
  
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.values(data);
  }
  return [];
};

export const updateUser = async (uid: string, updates: any) => {
  const userRef = ref(database, `users/${uid}`);
  await update(userRef, updates);
};
