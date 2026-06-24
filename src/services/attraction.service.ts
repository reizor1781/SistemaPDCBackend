import { Attraction, CreateAttractionDto, UpdateAttractionDto } from '../models/attraction.model.js';
import { AppError } from '../types/errors.js';
import { prisma } from '../lib/prisma.js';

function parseTechnicalSpecs(value: unknown): Record<string, any> {
  if (!value) return {};
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }
  return typeof value === 'object' && !Array.isArray(value) ? value as Record<string, any> : {};
}

function normalizeTechnicalSpecs(value: unknown, totalPlans?: unknown): Record<string, any> {
  const specs = parseTechnicalSpecs(value);
  if (totalPlans !== undefined) {
    specs.total_plans = Math.max(0, Number(totalPlans) || 0);
  }
  return specs;
}

function mapAttraction(attraction: any): any {
  const technicalSpecs = parseTechnicalSpecs(attraction.technicalSpecs);
  const totalPlans = Math.max(0, Number(technicalSpecs.total_plans ?? 0) || 0);
  const uploadedPlans = attraction._count?.plans ?? 0;

  return {
    id: attraction.id,
    name: attraction.name,
    code: attraction.code,
    area: attraction.area,
    status: attraction.status,
    description: attraction.description || '',
    image: attraction.image || '',
    capacity: attraction.capacity || 0,
    height_m: attraction.heightM || 0,
    duration_min: attraction.durationMin || 0,
    manufacturer: attraction.manufacturer || '',
    model: attraction.model || '',
    year_installed: attraction.yearInstalled || 0,
    installed_power_kw: attraction.installedPowerKw || 0,
    operating_voltage: attraction.operatingVoltage || {},
    control_voltage_v: attraction.controlVoltageV || 0,
    frequency_hz: attraction.frequencyHz || 0,
    protection_ip: attraction.protectionIp || '',
    technical_specs: technicalSpecs,
    total_plans: totalPlans,
    pending_docs: Math.max(totalPlans - uploadedPlans, 0),
    last_maintenance: attraction.lastMaintenance ? attraction.lastMaintenance.toISOString().slice(0, 10) : undefined,
    next_maintenance: attraction.nextMaintenance ? attraction.nextMaintenance.toISOString().slice(0, 10) : undefined,
    created_at: attraction.createdAt ? attraction.createdAt.toISOString() : undefined,
    updated_at: attraction.updatedAt ? attraction.updatedAt.toISOString() : undefined,
  };
}

export const AttractionService = {
  async findAll(): Promise<any[]> {
    const attractions = await prisma.attraction.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { plans: true } } },
    });
    return attractions.map(mapAttraction);
  },

  async findById(id: string): Promise<any> {
    const attraction = await prisma.attraction.findUnique({
      where: { id },
      include: { _count: { select: { plans: true } } },
    });
    if (!attraction) {
      throw new AppError(`Atracción con id "${id}" no encontrada`, 404);
    }
    return mapAttraction(attraction);
  },

  async create(data: CreateAttractionDto, file?: Express.Multer.File): Promise<any> {
    const { name, code, area, status } = data;

    if (!name || !code || !area || !status) {
      throw new AppError('name, code, area y status son obligatorios', 400);
    }

    const existing = await prisma.attraction.findUnique({ where: { code } });
    if (existing) {
      throw new AppError(`El código de atracción "${code}" ya existe`, 409);
    }

    const imageUrl = file ? `/uploads/${file.filename}` : (data.image ?? '');
    const technicalSpecs = normalizeTechnicalSpecs(data.technical_specs, data.total_plans);

    const attraction = await prisma.attraction.create({
      data: {
        name,
        code,
        area,
        status: status as any,
        description: data.description ?? '',
        image: imageUrl,
        capacity: Number(data.capacity ?? 0),
        heightM: Number(data.height_m ?? 0),
        durationMin: Number(data.duration_min ?? 0),
        technicalSpecs: technicalSpecs as any,
      },
      include: { _count: { select: { plans: true } } },
    });

    return mapAttraction(attraction);
  },

  async update(id: string, data: UpdateAttractionDto, file?: Express.Multer.File): Promise<any> {
    const existing = await prisma.attraction.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError(`Atracción con id "${id}" no encontrada`, 404);
    }

    const imageUrl = file ? `/uploads/${file.filename}` : data.image;
    const technicalSpecs = data.technical_specs !== undefined || data.total_plans !== undefined
      ? normalizeTechnicalSpecs(data.technical_specs ?? existing.technicalSpecs, data.total_plans)
      : undefined;

    const updated = await prisma.attraction.update({
      where: { id },
      data: {
        name: data.name ?? undefined,
        code: data.code ?? undefined,
        area: data.area ?? undefined,
        status: data.status ? (data.status as any) : undefined,
        description: data.description ?? undefined,
        image: imageUrl !== undefined ? imageUrl : undefined,
        capacity: data.capacity !== undefined ? Number(data.capacity) : undefined,
        heightM: data.height_m !== undefined ? Number(data.height_m) : undefined,
        durationMin: data.duration_min !== undefined ? Number(data.duration_min) : undefined,
        technicalSpecs: technicalSpecs !== undefined ? (technicalSpecs as any) : undefined,
      },
      include: { _count: { select: { plans: true } } },
    });

    return mapAttraction(updated);
  },

  async remove(id: string): Promise<any> {
    try {
      const deleted = await prisma.attraction.delete({
        where: { id },
        include: { _count: { select: { plans: true } } },
      });
      return mapAttraction(deleted);
    } catch (e: any) {
      throw new AppError(`Atracción con id "${id}" no encontrada`, 404);
    }
  },
};
