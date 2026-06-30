import { UserService } from '../services/user.service.js';
export async function listUsers(_req, res, next) {
    try {
        const data = await UserService.findAll();
        res.json({ data });
    }
    catch (err) {
        next(err);
    }
}
export async function createUser(req, res, next) {
    try {
        const dto = req.body;
        if (req.file)
            dto.avatar = req.file.path;
        const data = await UserService.create(dto);
        res.status(201).json({ data });
    }
    catch (err) {
        next(err);
    }
}
export async function updateUser(req, res, next) {
    try {
        const dto = req.body;
        if (req.file)
            dto.avatar = req.file.path;
        const data = await UserService.update(req.params['id'], dto);
        res.json({ data });
    }
    catch (err) {
        next(err);
    }
}
export async function deleteUser(req, res, next) {
    try {
        const data = await UserService.remove(req.params['id'], req.user?.id);
        res.json({ data });
    }
    catch (err) {
        next(err);
    }
}
