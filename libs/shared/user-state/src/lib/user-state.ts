export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatarText: string;
  lastUpdated?: string;
  department?: string;
}

export const DEFAULT_USER: UserProfile = {
  name: 'Jamal Siam',
  email: 'jamal@nexus.io',
  role: 'Super Administrator',
  avatarText: 'JS',
  lastUpdated: new Date().toLocaleTimeString()
};

const GLOBAL_KEY = '__SHOPHUB_GLOBAL_USER_STORE__';

export type UserListener = (user: UserProfile) => void;

export class GlobalUserStore {
  private listeners = new Set<UserListener>();
  private currentUser: UserProfile;

  constructor() {
    let initial = DEFAULT_USER;
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('shophub_user');
        if (saved) {
          initial = { ...DEFAULT_USER, ...JSON.parse(saved) };
        }
      } catch (_) { }
    }
    this.currentUser = initial;
  }

  getUser(): UserProfile {
    return this.currentUser;
  }

  setUser(updates: Partial<UserProfile>): void {
    const parts = (updates.name || this.currentUser.name).trim().split(' ');
    const avatar = parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : (updates.name || this.currentUser.name).slice(0, 2).toUpperCase();

    this.currentUser = {
      ...this.currentUser,
      ...updates,
      avatarText: avatar,
      lastUpdated: new Date().toLocaleTimeString()
    };

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('shophub_user', JSON.stringify(this.currentUser));
      } catch (_) { }

      // Dispatch native window event for cross-app reactivity
      window.dispatchEvent(new CustomEvent('SHOPHUB_USER_UPDATED', { detail: this.currentUser }));
    }

    this.listeners.forEach(fn => fn(this.currentUser));
  }

  subscribe(listener: UserListener): () => void {
    this.listeners.add(listener);
    // Immediately invoke with current state
    listener(this.currentUser);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

// Ensure singleton instance on global window
function getSingleton(): GlobalUserStore {
  if (typeof window !== 'undefined') {
    const w = window as any;
    if (!w[GLOBAL_KEY]) {
      w[GLOBAL_KEY] = new GlobalUserStore();

      // Also listen to window event in case another bundle dispatched it
      window.addEventListener('SHOPHUB_USER_UPDATED', (e: any) => {
        if (e.detail && w[GLOBAL_KEY]) {
          w[GLOBAL_KEY].currentUser = e.detail;
          w[GLOBAL_KEY].listeners.forEach((fn: UserListener) => fn(e.detail));
        }
      });
    }
    return w[GLOBAL_KEY];
  }
  return new GlobalUserStore();
}

export const userStore = getSingleton();
