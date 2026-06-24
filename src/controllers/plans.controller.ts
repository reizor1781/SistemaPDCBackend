import { NextFunction, Request, Response } from 'express';
import { PlanService } from '../services/plan.service.js';
import { CreatePlanDto, UpdatePlanDto } from '../models/plan.model.js';

/**
 * Controlador de Planos Eléctricos.
 *
 * Responsabilidad única: manejar la capa HTTP.
 * Toda la lógica de negocio vive en PlanService.
 */

export async function listPlans(req: Request, res: Response, next: NextFunction) {
  try {
    const attractionId = req.query['attraction_id'] as string;
    const data = await PlanService.findAll(attractionId);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function getPlan(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await PlanService.findById(req.params['id'] as string);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function uploadPlan(req: Request, res: Response, next: NextFunction) {
  try {
    const dto = req.body as CreatePlanDto;
    const data = await PlanService.create(dto, req.file, req.user);
    res.status(201).json({ message: 'Plano subido exitosamente', data });
  } catch (err) {
    next(err);
  }
}

export async function updatePlan(req: Request, res: Response, next: NextFunction) {
  try {
    const dto = req.body as UpdatePlanDto;
    const data = await PlanService.update(req.params['id'] as string, dto);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function deletePlan(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await PlanService.remove(req.params['id'] as string);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function addComment(req: Request, res: Response, next: NextFunction) {
  try {
    const { content, pageRef } = req.body;
    const data = await PlanService.addComment(req.params['id'] as string, content, req.user, pageRef);
    res.status(201).json({ data });
  } catch (err) {
    next(err);
  }
}

export async function resolveComment(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await PlanService.resolveComment(req.params['id'] as string, req.params['commentId'] as string);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function deleteComment(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await PlanService.deleteComment(req.params['id'] as string, req.params['commentId'] as string);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}
