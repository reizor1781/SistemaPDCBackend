import { CreateManualDto, UpdateManualDto } from '../models/manual.model.js';
import { AppError } from '../types/errors.js';
import { prisma } from '../lib/prisma.js';

function mapManual(manual: any): any {
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
  async findAll(attractionId?: string): Promise<any[]> {
    const manuals = await prisma.attractionManual.findMany({
      where: attractionId ? { attractionId } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    return manuals.map(mapManual);
  },

  async findById(id: string): Promise<any> {
    const manual = await prisma.attractionManual.findUnique({ where: { id } });
    if (!manual) {
      throw new AppError(`Manual con id "${id}" no encontrado`, 404);
    }
    return mapManual(manual);
  },

  async create(data: CreateManualDto, file?: Express.Multer.File): Promise<any> {
    if (!data.attraction_id || !data.title) {
      throw new AppError('attraction_id y title son obligatorios', 400);
    }

    const manual = await prisma.attractionManual.create({
      data: {
        attractionId: data.attraction_id,
        manualNumber: data.manual_number ?? `MAN-${Date.now()}`,
        title: data.title,
        category: (data.category as any) ?? 'operation',
        status: (data.status as any) ?? 'active',
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

  async update(id: string, data: UpdateManualDto): Promise<any> {
    const existing = await prisma.attractionManual.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError(`Manual con id "${id}" no encontrado`, 404);
    }

    const updated = await prisma.attractionManual.update({
      where: { id },
      data: {
        title: data.title ?? undefined,
        category: data.category ? (data.category as any) : undefined,
        status: data.status ? (data.status as any) : undefined,
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

  async remove(id: string): Promise<any> {
    try {
      const deleted = await prisma.attractionManual.delete({ where: { id } });
      return mapManual(deleted);
    } catch (e: any) {
      throw new AppError(`Manual con id "${id}" no encontrado`, 404);
    }
  },
};
