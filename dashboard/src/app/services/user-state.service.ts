import { Injectable, signal } from '@angular/core';
import { userStore, UserProfile } from '@shophub/shared-user-state';

@Injectable({ providedIn: 'root' })
export class UserStateService {
  readonly user = signal<UserProfile>(userStore.getUser());

  constructor() {
    userStore.subscribe((u) => {
      this.user.set(u);
    });
  }

  updateUser(updates: Partial<UserProfile>) {
    userStore.setUser(updates);
  }
}
