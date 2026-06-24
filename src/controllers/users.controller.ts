import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services/user.service.js';
import { CreateUserDto, UpdateUserDto } from '../models/user.model.js';

/**
 * Controlador de Usuarios.
 *
 * Responsabilidad única: manejar la capa HTTP.
 * Toda la lógica de negocio y validación vive en UserService.
 */

export function listUsers(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = UserService.findAll();
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const dto = req.body as CreateUserDto;
    const data = UserService.create(dto);
    res.status(201).json({ data });
  } catch (err) {
    next(err);
  }
}

export function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const dto = req.body as UpdateUserDto;
    const data = UserService.update(req.params['id'] as string, dto);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    // El servicio se encarga de validar que el usuario no se elimine a sí mismo
    const data = UserService.remove(req.params['id'] as string, req.user?.id);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}
