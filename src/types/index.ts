export interface User {
  uid: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  vipStatus: boolean;
  vipExpireDate: string | null;
  banned: boolean;
  createdAt: string;
}

export interface Prediction {
  id?: string;
  championship: string;
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
  category: PredictionCategory;
  prediction: string;
  odds: string;
  confidence: string;
  analysis: string;
  advice: string;
  status: 'active' | 'won' | 'lost';
  createdAt: string;
  updatedAt?: string;
}

export type PredictionCategory = 
  | 'COTE_2_FREE' 
  | 'ACCUMULATION_FREE' 
  | 'COTE_2_VIP' 
  | 'COTE_5_VIP' 
  | 'SCORE_EXACT_VIP' 
  | 'HT_FT_VIP';

export interface Notification {
  id?: string;
  userId: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'prediction';
  read: boolean;
  createdAt: string;
}

export type Page = 'home' | 'predictions' | 'history' | 'vip-pricing' | 'profile' | 'admin';
