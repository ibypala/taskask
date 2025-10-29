export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  username: string;
  role: UserRole;
  email?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}
