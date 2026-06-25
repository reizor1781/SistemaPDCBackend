import { NextFunction, Request, Response } from 'express';
import { ManualService } from '../services/manual.service.js';
import { CreateManualDto, UpdateManualDto } from '../models/manual.model.js';

export async function listManuals(req: Request, res: Response, next: NextFunction) {
  try {
    const attractionId = req.query['attraction_id'] as string;
    const data = await ManualService.findAll(attractionId);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function getManual(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await ManualService.findById(req.params['id'] as string);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function uploadManual(req: Request, res: Response, next: NextFunction) {
  try {
    const dto = req.body as CreateManualDto;
    const data = await ManualService.create(dto, req.file);
    res.status(201).json({ message: 'Manual subido exitosamente', data });
  } catch (err) {
    next(err);
  }
}

export async function updateManual(req: Request, res: Response, next: NextFunction) {
  try {
    const dto = req.body as UpdateManualDto;
    const data = await ManualService.update(req.params['id'] as string, dto);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function deleteManual(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await ManualService.remove(req.params['id'] as string);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}
