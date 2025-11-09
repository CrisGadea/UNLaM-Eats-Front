import { Injectable, signal } from '@angular/core';

export type UserRole = 'cliente' | 'dueno' | 'repartidor';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

@Injectable({ providedIn: 'root' })
export class AuthStore {
  currentUser = signal<AuthUser | null>(null);
  token = signal<string | null>(null);

  private readonly KEY_USER = 'ue_user';
  private readonly KEY_TOKEN = 'ue_token';

  constructor() {
    const rawUser = localStorage.getItem(this.KEY_USER);
    const rawToken = localStorage.getItem(this.KEY_TOKEN);
    if (rawUser) {
      try {
        this.currentUser.set(JSON.parse(rawUser));
      } catch {}
    }
    if (rawToken) this.token.set(rawToken);
  }

  setUser(user: AuthUser | null) {
    this.currentUser.set(user);
    if (user) localStorage.setItem(this.KEY_USER, JSON.stringify(user));
    else localStorage.removeItem(this.KEY_USER);
  }

  setToken(token: string | null) {
    this.token.set(token);
    if (token) localStorage.setItem(this.KEY_TOKEN, token);
    else localStorage.removeItem(this.KEY_TOKEN);
  }

  get role(): UserRole | null {
    return this.currentUser()?.role ?? null;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser();
  }
}
