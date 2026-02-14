
import { FarmerProfile, HistoryEvent } from '../types';

/**
 * Samarth Kisan Document Store (Simulating real-time DB like Firestore)
 */
const STORAGE_PREFIX = 'sk_user_';

export const dbService = {
  /**
   * Initialize or get user profile
   */
  getUserProfile: (email: string): FarmerProfile | null => {
    const data = localStorage.getItem(`${STORAGE_PREFIX}${email}`);
    return data ? JSON.parse(data) : null;
  },

  /**
   * Save user profile with audit log
   */
  saveUserProfile: (profile: FarmerProfile): void => {
    const updatedProfile = {
      ...profile,
      lastSync: new Date().toISOString()
    };
    localStorage.setItem(`${STORAGE_PREFIX}${profile.email}`, JSON.stringify(updatedProfile));
    
    // Broadcast update
    window.dispatchEvent(new CustomEvent('db_sync', { detail: profile.email }));
  },

  /**
   * Add a historical event to the user's timeline
   */
  addHistoryEvent: (email: string, event: Omit<HistoryEvent, 'id' | 'timestamp'>): void => {
    const profile = dbService.getUserProfile(email);
    if (!profile) return;

    const newEvent: HistoryEvent = {
      ...event,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };

    const updatedProfile: FarmerProfile = {
      ...profile,
      history: [newEvent, ...(profile.history || [])].slice(0, 50) // Keep last 50 events
    };

    dbService.saveUserProfile(updatedProfile);
  },

  /**
   * Check if email exists
   */
  userExists: (email: string): boolean => {
    return localStorage.getItem(`${STORAGE_PREFIX}${email}`) !== null;
  },

  /**
   * Clean/Delete Account
   */
  deleteAccount: (email: string): void => {
    localStorage.removeItem(`${STORAGE_PREFIX}${email}`);
  }
};
