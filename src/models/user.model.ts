import { UserRole } from '../types/auth.js';

/** Entidad de dominio — Usuario del sistema */
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  department: string;
  active: boolean;
}

/** Usuario sin datos sensibles (para respuestas de API) */
export type SafeUser = Omit<User, 'passwordHash'>;

/** DTO para crear un usuario */
export interface CreateUserDto {
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  active?: boolean;
  password?: string;
  avatar?: string;
}

/** DTO para actualizar un usuario */
export type UpdateUserDto = Partial<CreateUserDto>;

/** DTO para actualizar el propio perfil */
export interface UpdateProfileDto {
  name?: string;
  password?: string;
  avatar?: string;
}
