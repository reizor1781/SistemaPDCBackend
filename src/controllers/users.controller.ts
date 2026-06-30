import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services/user.service.js';
import { CreateUserDto, UpdateUserDto } from '../models/user.model.js';

export async function listUsers(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await UserService.findAll();
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const dto = req.body as CreateUserDto;
    if (req.file) dto.avatar = (req.file as any).path;
    const data = await UserService.create(dto);
    res.status(201).json({ data });
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const dto = req.body as UpdateUserDto;
    if (req.file) dto.avatar = (req.file as any).path;
    const data = await UserService.update(req.params['id'] as string, dto);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await UserService.remove(req.params['id'] as string, req.user?.id);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}
