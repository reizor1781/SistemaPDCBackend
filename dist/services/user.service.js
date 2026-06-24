import bcrypt from 'bcryptjs';
import { AppError } from '../types/errors.js';
import { prisma } from '../lib/prisma.js';
const VALID_ROLES = ['admin', 'engineer', 'technician', 'operator'];
const toSafeUser = ({ passwordHash, ...user }) => {
    return {
        ...user,
        avatar: user.avatar || undefined,
        lastLogin: user.lastLogin ? user.lastLogin.toISOString() : undefined,
        createdAt: user.createdAt ? user.createdAt.toISOString() : undefined,
        updatedAt: user.updatedAt ? user.updatedAt.toISOString() : undefined,
    };
};
export const UserService = {
    async findAll() {
        const users = await prisma.user.findMany();
        return users.map(toSafeUser);
    },
    async findById(id) {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new AppError(`Usuario con id "${id}" no encontrado`, 404);
        return toSafeUser(user);
    },
    async create(data) {
        const { name, email, role, department, active, password, avatar } = data;
        if (!name || !email || !role) {
            throw new AppError('name, email y role son obligatorios', 400);
        }
        if (!VALID_ROLES.includes(role)) {
            throw new AppError(`Rol inválido. Valores permitidos: ${VALID_ROLES.join(', ')}`, 400);
        }
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            throw new AppError(`El email "${email}" ya está registrado`, 409);
        }
        const user = await prisma.user.create({
            data: {
                name,
                email,
                role: role,
                department: department ?? '',
                active: active ?? true,
                avatar: avatar ?? undefined,
                passwordHash: bcrypt.hashSync(password ?? 'usuario123', 10),
            },
        });
        return toSafeUser(user);
    },
    async update(id, data) {
        const existing = await prisma.user.findUnique({ where: { id } });
        if (!existing) {
            throw new AppError(`Usuario con id "${id}" no encontrado`, 404);
        }
        const { name, email, role, department, active, password, avatar } = data;
        if (role && !VALID_ROLES.includes(role)) {
            throw new AppError(`Rol inválido. Valores permitidos: ${VALID_ROLES.join(', ')}`, 400);
        }
        if (email && email !== existing.email) {
            const emailTaken = await prisma.user.findUnique({ where: { email } });
            if (emailTaken) {
                throw new AppError(`El email "${email}" ya está registrado por otro usuario`, 409);
            }
        }
        const updated = await prisma.user.update({
            where: { id },
            data: {
                name: name ?? undefined,
                email: email ?? undefined,
                role: role ? role : undefined,
                department: department ?? undefined,
                active: active ?? undefined,
                avatar: avatar !== undefined ? avatar : undefined,
                passwordHash: password ? bcrypt.hashSync(password, 10) : undefined,
            },
        });
        return toSafeUser(updated);
    },
    async updateProfile(id, data) {
        const { name, password, avatar } = data;
        const updated = await prisma.user.update({
            where: { id },
            data: {
                name: name ?? undefined,
                avatar: avatar !== undefined ? avatar : undefined,
                passwordHash: password ? bcrypt.hashSync(password, 10) : undefined,
            },
        });
        return toSafeUser(updated);
    },
    async remove(id, requesterId) {
        if (requesterId && requesterId === id) {
            throw new AppError('No puedes eliminar tu propio usuario', 400);
        }
        try {
            const deleted = await prisma.user.delete({ where: { id } });
            return toSafeUser(deleted);
        }
        catch (e) {
            throw new AppError(`Usuario con id "${id}" no encontrado`, 404);
        }
    },
};
