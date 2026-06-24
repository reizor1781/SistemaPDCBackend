import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../types/errors.js';
import { AuthUser } from '../types/auth.js';
import { prisma } from '../lib/prisma.js';

export interface LoginResult {
  token: string;
  user: any;
}

export const AuthService = {
  async login(email: string | undefined, password: string | undefined): Promise<LoginResult> {
    if (!email || !password) {
      throw new AppError('Email y contraseña son obligatorios', 400);
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.active || !bcrypt.compareSync(password, user.passwordHash)) {
      throw new AppError('Credenciales inválidas', 401);
    }

    // Update lastLogin
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const payload: AuthUser = { id: user.id, email: user.email, role: user.role as any, name: user.name };
    const options: SignOptions = {
      expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'],
    };

    const token = jwt.sign(payload, env.jwtSecret, options);

    const { passwordHash, ...safeUser } = user;
    return {
      token,
      user: {
        ...safeUser,
        lastLogin: new Date().toISOString(),
        avatar: safeUser.avatar || undefined,
      },
    };
  },
};

