import { demoPlans } from '../data/mockData.js';
import { CreatePlanDto, ElectricalPlan, UpdatePlanDto } from '../models/plan.model.js';
import { AppError } from '../types/errors.js';
import { AuthUser } from '../types/auth.js';

// En memoria hasta que se conecte la BD (Prisma)
const plans = demoPlans as unknown as ElectricalPlan[];

/**
 * PlanService — lógica de negocio para planos eléctricos.
 */
export const PlanService = {
  /**
   * Lista todos los planos. Filtra por attraction_id si se proporciona.
   */
  findAll(attractionId?: string): ElectricalPlan[] {
    if (attractionId) {
      return plans.filter(plan => plan.attraction_id === attractionId);
    }
    return plans;
  },

  /**
   * Obtiene un plano por ID.
   * @throws {AppError} 404 si no se encuentra
   */
  findById(id: string): ElectricalPlan {
    const plan = plans.find(item => item.id === id);
    if (!plan) {
      throw new AppError(`Plano con id "${id}" no encontrado`, 404);
    }
    return plan;
  },

  /**
   * Crea un nuevo plano. Requiere attraction_id y title.
   * @param data  — datos del formulario
   * @param file  — archivo subido (multer)
   * @param user  — usuario autenticado del token JWT
   * @throws {AppError} 400 si faltan campos requeridos
   */
  create(
    data: CreatePlanDto,
    file?: Express.Multer.File,
    user?: AuthUser,
  ): ElectricalPlan {
    if (!data.attraction_id || !data.title) {
      throw new AppError('attraction_id y title son obligatorios', 400);
    }

    const now = new Date().toISOString();

    const plan: ElectricalPlan = {
      id: `p-${Date.now()}`,
      attraction_id: data.attraction_id,
      plan_number: data.plan_number ?? `PL-${Date.now()}`,
      title: data.title,
      type: data.type ?? 'single_line',
      status: 'draft',
      current_version: 'Rev. 0',
      author: user?.email ?? data.author ?? 'Sistema',
      file_url: file ? `/uploads/${file.filename}` : '',
      file_size_kb: file ? Math.round(file.size / 1024) : 0,
      pages: 1,
      tags: [],
      description: data.description ?? '',
      revisions: [],
      comments: [],
      created_date: now,
      updated_date: now,
    };

    plans.unshift(plan);
    return plan;
  },

  /**
   * Actualiza un plano existente.
   * @throws {AppError} 404 si no se encuentra
   */
  update(id: string, data: UpdatePlanDto): ElectricalPlan {
    const index = plans.findIndex(item => item.id === id);
    if (index === -1) {
      throw new AppError(`Plano con id "${id}" no encontrado`, 404);
    }

    const updated: ElectricalPlan = {
      ...plans[index],
      ...data,
      id: plans[index].id,
      updated_date: new Date().toISOString(),
    };

    plans[index] = updated;
    return updated;
  },

  /**
   * Elimina un plano por ID.
   * @throws {AppError} 404 si no se encuentra
   */
  remove(id: string): ElectricalPlan {
    const index = plans.findIndex(item => item.id === id);
    if (index === -1) {
      throw new AppError(`Plano con id "${id}" no encontrado`, 404);
    }

    const [deleted] = plans.splice(index, 1);
    return deleted;
  },
};
