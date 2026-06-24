import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { UserService } from '../services/user.service.js';

/**
 * Controlador de Autenticación.
 */

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    const result = await AuthService.login(email, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user?.id) return res.status(401).json({ error: 'No autenticado' });
    const user = await UserService.findById(req.user.id);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function updateMe(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user?.id) return res.status(401).json({ error: 'No autenticado' });
    const { name, password } = req.body as { name?: string; password?: string };
    const avatarUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const updated = await UserService.updateProfile(req.user.id, { name, password, avatar: avatarUrl });
    res.json({ user: updated });
  } catch (err) {
    next(err);
  }
}
