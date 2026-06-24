import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';
import { demoUsers } from '../data/mockData.js';
import { AppError } from '../types/errors.js';
import { AuthUser } from '../types/auth.js';

/** Resultado exitoso del login */
export interface LoginResult {
  token: string;
  user: Omit<(typeof demoUsers)[number], 'passwordHash'>;
}

/**
 * AuthService — autenticación y generación de tokens JWT.
 */
export const AuthService = {
  /**
   * Valida credenciales y genera un token JWT.
   * @throws {AppError} 400 si faltan email o password
   * @throws {AppError} 401 si las credenciales son inválidas o el usuario está inactivo
   */
  login(email: string | undefined, password: string | undefined): LoginResult {
    if (!email || !password) {
      throw new AppError('Email y contraseña son obligatorios', 400);
    }

    const user = demoUsers.find(item => item.email === email && item.active);

    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const payload: AuthUser = { id: user.id, email: user.email, role: user.role };
    const options: SignOptions = {
      expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'],
    };

    const token = jwt.sign(payload, env.jwtSecret, options);

    const { passwordHash, ...safeUser } = user;
    void passwordHash; // descartado intencionalmente
    return { token, user: safeUser };
  },
};
