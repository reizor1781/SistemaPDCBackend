import { AttractionService } from '../services/attraction.service.js';
/**
 * Controlador de Atracciones.
 *
 * Responsabilidad única: manejar la capa HTTP.
 * - Extrae datos de req (params, body, query).
 * - Llama al servicio correspondiente.
 * - Devuelve la respuesta JSON con el código HTTP correcto.
 * - Propaga errores al middleware global via next(err).
 */
export async function listAttractions(_req, res, next) {
    try {
        const data = await AttractionService.findAll();
        res.json({ data });
    }
    catch (err) {
        next(err);
    }
}
export async function getAttraction(req, res, next) {
    try {
        const data = await AttractionService.findById(req.params['id']);
        res.json({ data });
    }
    catch (err) {
        next(err);
    }
}
export async function createAttraction(req, res, next) {
    try {
        const dto = req.body;
        const data = await AttractionService.create(dto, req.file);
        res.status(201).json({ data });
    }
    catch (err) {
        next(err);
    }
}
export async function updateAttraction(req, res, next) {
    try {
        const dto = req.body;
        const data = await AttractionService.update(req.params['id'], dto, req.file);
        res.json({ data });
    }
    catch (err) {
        next(err);
    }
}
export async function deleteAttraction(req, res, next) {
    try {
        const data = await AttractionService.remove(req.params['id']);
        res.json({ data });
    }
    catch (err) {
        next(err);
    }
}
