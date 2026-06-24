import { NextFunction, Request, Response } from 'express';
import { PlanService } from '../services/plan.service.js';
import { CreatePlanDto, UpdatePlanDto } from '../models/plan.model.js';

/**
 * Controlador de Planos Eléctricos.
 *
 * Responsabilidad única: manejar la capa HTTP.
 * Toda la lógica de negocio vive en PlanService.
 */

export function listPlans(req: Request, res: Response, next: NextFunction) {
  try {
    const attractionId = req.query.attraction_id as string | undefined;
    const data = PlanService.findAll(attractionId);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export function getPlan(req: Request, res: Response, next: NextFunction) {
  try {
    const data = PlanService.findById(req.params['id'] as string);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export function uploadPlan(req: Request, res: Response, next: NextFunction) {
  try {
    const dto = req.body as CreatePlanDto;
    const data = PlanService.create(dto, req.file, req.user);
    res.status(201).json({ message: 'Plano subido exitosamente', data });
  } catch (err) {
    next(err);
  }
}

export function updatePlan(req: Request, res: Response, next: NextFunction) {
  try {
    const dto = req.body as UpdatePlanDto;
    const data = PlanService.update(req.params['id'] as string, dto);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export function deletePlan(req: Request, res: Response, next: NextFunction) {
  try {
    const data = PlanService.remove(req.params['id'] as string);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}
