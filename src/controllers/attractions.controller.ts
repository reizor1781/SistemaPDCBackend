import { NextFunction, Request, Response } from 'express';
import { AttractionService } from '../services/attraction.service.js';
import { CreateAttractionDto, UpdateAttractionDto } from '../models/attraction.model.js';

/**
 * Controlador de Atracciones.
 *
 * Responsabilidad única: manejar la capa HTTP.
 * - Extrae datos de req (params, body, query).
 * - Llama al servicio correspondiente.
 * - Devuelve la respuesta JSON con el código HTTP correcto.
 * - Propaga errores al middleware global via next(err).
 */

export async function listAttractions(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await AttractionService.findAll();
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function getAttraction(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await AttractionService.findById(req.params['id'] as string);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function createAttraction(req: Request, res: Response, next: NextFunction) {
  try {
    const dto = req.body as CreateAttractionDto;
    const data = await AttractionService.create(dto, req.file);
    res.status(201).json({ data });
  } catch (err) {
    next(err);
  }
}

export async function updateAttraction(req: Request, res: Response, next: NextFunction) {
  try {
    const dto = req.body as UpdateAttractionDto;
    const data = await AttractionService.update(req.params['id'] as string, dto, req.file);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function deleteAttraction(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await AttractionService.remove(req.params['id'] as string);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}
