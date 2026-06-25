import { AppError } from '../types/errors.js';
import { prisma } from '../lib/prisma.js';
function mapManual(manual) {
    return {
        id: manual.id,
        attraction_id: manual.attractionId,
        manual_number: manual.manualNumber,
        title: manual.title,
        category: manual.category,
        status: manual.status,
        current_version: manual.currentVersion,
        author: manual.author || 'Sistema',
        file_url: manual.fileUrl,
        file_size_kb: manual.fileSizeKb,
        pages: manual.pages,
        tags: manual.tags,
        description: manual.description || '',
        created_date: manual.createdAt.toISOString(),
        updated_date: manual.updatedAt.toISOString(),
    };
}
export const ManualService = {
    async findAll(attractionId) {
        const manuals = await prisma.attractionManual.findMany({
            where: attractionId ? { attractionId } : undefined,
            orderBy: { createdAt: 'desc' },
        });
        return manuals.map(mapManual);
    },
    async findById(id) {
        const manual = await prisma.attractionManual.findUnique({ where: { id } });
        if (!manual) {
            throw new AppError(`Manual con id "${id}" no encontrado`, 404);
        }
        return mapManual(manual);
    },
    async create(data, file) {
        if (!data.attraction_id || !data.title) {
            throw new AppError('attraction_id y title son obligatorios', 400);
        }
        const manual = await prisma.attractionManual.create({
            data: {
                attractionId: data.attraction_id,
                manualNumber: data.manual_number ?? `MAN-${Date.now()}`,
                title: data.title,
                category: data.category ?? 'technical',
                status: data.status ?? 'active',
                currentVersion: data.current_version ?? 'Rev. 0',
                author: data.author ?? 'Sistema',
                fileUrl: file ? `/uploads/${file.filename}` : '',
                fileSizeKb: file ? Math.round(file.size / 1024) : 0,
                pages: 1,
                tags: [],
                description: data.description ?? '',
            },
        });
        return mapManual(manual);
    },
    async update(id, data) {
        const existing = await prisma.attractionManual.findUnique({ where: { id } });
        if (!existing) {
            throw new AppError(`Manual con id "${id}" no encontrado`, 404);
        }
        const updated = await prisma.attractionManual.update({
            where: { id },
            data: {
                title: data.title ?? undefined,
                category: data.category ? data.category : undefined,
                status: data.status ? data.status : undefined,
                description: data.description ?? undefined,
                manualNumber: data.manual_number ?? undefined,
                currentVersion: data.current_version ?? undefined,
                author: data.author ?? undefined,
                fileUrl: data.file_url ?? undefined,
                fileSizeKb: data.file_size_kb !== undefined ? Number(data.file_size_kb) : undefined,
                pages: data.pages !== undefined ? Number(data.pages) : undefined,
                tags: data.tags ?? undefined,
            },
        });
        return mapManual(updated);
    },
    async remove(id) {
        try {
            const deleted = await prisma.attractionManual.delete({ where: { id } });
            return mapManual(deleted);
        }
        catch (e) {
            throw new AppError(`Manual con id "${id}" no encontrado`, 404);
        }
    },
};
