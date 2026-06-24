import { PlanService } from '../services/plan.service.js';
/**
 * Controlador de Planos Eléctricos.
 *
 * Responsabilidad única: manejar la capa HTTP.
 * Toda la lógica de negocio vive en PlanService.
 */
export async function listPlans(req, res, next) {
    try {
        const attractionId = req.query['attraction_id'];
        const data = await PlanService.findAll(attractionId);
        res.json({ data });
    }
    catch (err) {
        next(err);
    }
}
export async function getPlan(req, res, next) {
    try {
        const data = await PlanService.findById(req.params['id']);
        res.json({ data });
    }
    catch (err) {
        next(err);
    }
}
export async function uploadPlan(req, res, next) {
    try {
        const dto = req.body;
        const data = await PlanService.create(dto, req.file, req.user);
        res.status(201).json({ message: 'Plano subido exitosamente', data });
    }
    catch (err) {
        next(err);
    }
}
export async function updatePlan(req, res, next) {
    try {
        const dto = req.body;
        const data = await PlanService.update(req.params['id'], dto);
        res.json({ data });
    }
    catch (err) {
        next(err);
    }
}
export async function deletePlan(req, res, next) {
    try {
        const data = await PlanService.remove(req.params['id']);
        res.json({ data });
    }
    catch (err) {
        next(err);
    }
}
export async function addComment(req, res, next) {
    try {
        const { content, pageRef } = req.body;
        const data = await PlanService.addComment(req.params['id'], content, req.user, pageRef);
        res.status(201).json({ data });
    }
    catch (err) {
        next(err);
    }
}
export async function resolveComment(req, res, next) {
    try {
        const data = await PlanService.resolveComment(req.params['id'], req.params['commentId']);
        res.json({ data });
    }
    catch (err) {
        next(err);
    }
}
export async function deleteComment(req, res, next) {
    try {
        const data = await PlanService.deleteComment(req.params['id'], req.params['commentId']);
        res.json({ data });
    }
    catch (err) {
        next(err);
    }
}
