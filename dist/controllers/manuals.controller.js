import { ManualService } from '../services/manual.service.js';
export async function listManuals(req, res, next) {
    try {
        const attractionId = req.query['attraction_id'];
        const data = await ManualService.findAll(attractionId);
        res.json({ data });
    }
    catch (err) {
        next(err);
    }
}
export async function getManual(req, res, next) {
    try {
        const data = await ManualService.findById(req.params['id']);
        res.json({ data });
    }
    catch (err) {
        next(err);
    }
}
export async function uploadManual(req, res, next) {
    try {
        const dto = req.body;
        const data = await ManualService.create(dto, req.file);
        res.status(201).json({ message: 'Manual subido exitosamente', data });
    }
    catch (err) {
        next(err);
    }
}
export async function updateManual(req, res, next) {
    try {
        const dto = req.body;
        const data = await ManualService.update(req.params['id'], dto);
        res.json({ data });
    }
    catch (err) {
        next(err);
    }
}
export async function deleteManual(req, res, next) {
    try {
        const data = await ManualService.remove(req.params['id']);
        res.json({ data });
    }
    catch (err) {
        next(err);
    }
}
