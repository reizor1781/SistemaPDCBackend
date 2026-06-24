export type UserRole = 'admin' | 'engineer' | 'technician' | 'operator';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}
