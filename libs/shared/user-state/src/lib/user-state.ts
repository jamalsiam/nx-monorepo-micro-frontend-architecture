export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatarText: string;
  department?: string;
  lastUpdated?: string;
}

export const DEFAULT_USER: UserProfile = {
  name: 'Jamal Siam',
  email: 'jamal@nexus.io',
  role: 'Super Administrator',
  avatarText: 'JS',
  department: 'Core Infrastructure',
  lastUpdated: new Date().toLocaleTimeString()
};

export type UserListener = (user: UserProfile) => void;

/**
 * Pure in-memory User State Store.
 * Managed as a shared singleton by Native Federation across all micro-frontends.
 * Zero reliance on `window` or `localStorage`.
 */
export class UserStore {
  private currentUser: UserProfile = { ...DEFAULT_USER };
  private listeners = new Set<UserListener>();

  getUser(): UserProfile {
    return this.currentUser;
  }

  setUser(updates: Partial<UserProfile>): void {
    const newName = updates.name !== undefined ? updates.name : this.currentUser.name;
    const parts = newName.trim().split(' ');
    const avatar = parts.length >= 2 
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() 
      : newName.slice(0, 2).toUpperCase();

    this.currentUser = {
      ...this.currentUser,
      ...updates,
      avatarText: avatar,
      lastUpdated: new Date().toLocaleTimeString()
    };

    // Notify all active subscribers in memory
    this.listeners.forEach(fn => fn(this.currentUser));
  }

  subscribe(listener: UserListener): () => void {
    this.listeners.add(listener);
    // Immediately provide current state upon subscription
    listener(this.currentUser);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

// Single in-memory instance shared across micro-frontends
export const userStore = new UserStore();
