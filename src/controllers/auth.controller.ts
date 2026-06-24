import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';

/**
 * Controlador de Autenticación.
 *
 * Responsabilidad única: manejar la capa HTTP.
 * Toda la lógica de validación y JWT vive en AuthService.
 */

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    const result = AuthService.login(email, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export function me(req: Request, res: Response) {
  res.json({ user: req.user });
}
