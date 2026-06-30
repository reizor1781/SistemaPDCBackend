import { CreatePlanDto, UpdatePlanDto } from '../models/plan.model.js';
import { AppError } from '../types/errors.js';
import { AuthUser } from '../types/auth.js';
import { prisma } from '../lib/prisma.js';
import { deleteFromCloudinary, extractPublicId } from '../config/cloudinary.js';

function mapPlan(plan: any): any {
  return {
    id: plan.id,
    attraction_id: plan.attractionId,
    plan_number: plan.planNumber,
    title: plan.title,
    type: plan.type,
    status: plan.status,
    current_version: plan.currentVersion,
    author: plan.author?.name || plan.authorId || 'Sistema',
    file_url: plan.fileUrl,
    file_size_kb: plan.fileSizeKb,
    pages: plan.pages,
    tags: plan.tags,
    description: plan.description,
    created_date: plan.createdAt.toISOString(),
    updated_date: plan.updatedAt.toISOString(),
    revisions: plan.revisions?.map((rev: any) => ({
      id: rev.id,
      version: rev.version,
      author: rev.author,
      date: rev.createdAt.toISOString(),
      description: rev.description,
      file_url: rev.fileUrl,
    })) || [],
    comments: plan.comments?.map((c: any) => ({
      id: c.id,
      user_id: c.userId,
      user_name: c.user?.name || 'Usuario',
      user_role: c.user?.role || 'operator',
      content: c.content,
      date: c.createdAt.toISOString(),
      resolved: c.resolved,
      page_ref: c.pageRef,
    })) || [],
  };
}

export const PlanService = {
  async findAll(attractionId?: string): Promise<any[]> {
    const plans = await prisma.electricalPlan.findMany({
      where: attractionId ? { attractionId } : undefined,
      include: { author: true },
      orderBy: { createdAt: 'desc' },
    });
    return plans.map(mapPlan);
  },

  async findById(id: string): Promise<any> {
    const plan = await prisma.electricalPlan.findUnique({
      where: { id },
      include: {
        author: true,
        revisions: { orderBy: { createdAt: 'desc' } },
        comments: { include: { user: true }, orderBy: { createdAt: 'asc' } },
      },
    });
    if (!plan) {
      throw new AppError(`Plano con id "${id}" no encontrado`, 404);
    }
    return mapPlan(plan);
  },

  async create(data: CreatePlanDto, file?: Express.Multer.File, user?: AuthUser): Promise<any> {
    if (!data.attraction_id || !data.title) {
      throw new AppError('attraction_id y title son obligatorios', 400);
    }

    const plan = await prisma.electricalPlan.create({
      data: {
        attractionId: data.attraction_id,
        planNumber: data.plan_number ?? `PL-${Date.now()}`,
        title: data.title,
        type: (data.type as any) ?? 'single_line',
        status: 'draft',
        currentVersion: 'Rev. 0',
        authorId: user?.id,
        fileUrl: file ? (file as any).path : '',
        fileSizeKb: file ? Math.round(file.size / 1024) : 0,
        pages: 1,
        tags: [],
        description: data.description ?? '',
      },
      include: {
        author: true,
        revisions: true,
        comments: true,
      },
    });

    return mapPlan(plan);
  },

  async update(id: string, data: UpdatePlanDto): Promise<any> {
    const existing = await prisma.electricalPlan.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError(`Plano con id "${id}" no encontrado`, 404);
    }

    const updated = await prisma.electricalPlan.update({
      where: { id },
      data: {
        title: data.title ?? undefined,
        type: data.type ? (data.type as any) : undefined,
        status: data.status ? (data.status as any) : undefined,
        description: data.description ?? undefined,
        planNumber: data.plan_number ?? undefined,
        currentVersion: data.current_version ?? undefined,
        fileUrl: data.file_url ?? undefined,
      },
      include: {
        author: true,
        revisions: true,
        comments: { include: { user: true } },
      },
    });

    return mapPlan(updated);
  },

  async remove(id: string): Promise<any> {
    try {
      const deleted = await prisma.electricalPlan.delete({
        where: { id },
        include: { author: true, revisions: true, comments: { include: { user: true } } },
      });
      // Eliminar archivo de Cloudinary
      const publicId = extractPublicId(deleted.fileUrl);
      if (publicId) await deleteFromCloudinary(publicId, 'raw');
      return mapPlan(deleted);
    } catch (e: any) {
      throw new AppError(`Plano con id "${id}" no encontrado`, 404);
    }
  },

  async addComment(planId: string, content: string, user?: AuthUser, pageRef?: number): Promise<any> {
    const existing = await prisma.electricalPlan.findUnique({ where: { id: planId } });
    if (!existing) throw new AppError(`Plano con id "${planId}" no encontrado`, 404);

    await prisma.comment.create({
      data: {
        planId,
        userId: user?.id ?? '',
        content,
        pageRef,
      },
    });

    return this.findById(planId);
  },

  async resolveComment(planId: string, commentId: string): Promise<any> {
    try {
      await prisma.comment.update({
        where: { id: commentId, planId },
        data: { resolved: true },
      });
      return this.findById(planId);
    } catch (e: any) {
      throw new AppError(`Comentario con id "${commentId}" no encontrado`, 404);
    }
  },

  async deleteComment(planId: string, commentId: string): Promise<any> {
    try {
      await prisma.comment.delete({
        where: { id: commentId, planId },
      });
      return this.findById(planId);
    } catch (e: any) {
      throw new AppError(`Comentario con id "${commentId}" no encontrado`, 404);
    }
  },
};
