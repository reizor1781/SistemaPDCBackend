import { demoAttractions } from '../data/mockData.js';
import { Attraction, CreateAttractionDto, UpdateAttractionDto } from '../models/attraction.model.js';
import { AppError } from '../types/errors.js';

// En memoria hasta que se conecte la BD (Prisma)
const attractions = demoAttractions as unknown as Attraction[];

/**
 * AttractionService — toda la lógica de negocio de atracciones.
 *
 * Los controladores solo llaman a estos métodos y propagan los
 * AppError al middleware de errores vía next(err).
 */
export const AttractionService = {
  /**
   * Devuelve la lista completa de atracciones.
   */
  findAll(): Attraction[] {
    return attractions;
  },

  /**
   * Busca una atracción por ID.
   * @throws {AppError} 404 si no se encuentra
   */
  findById(id: string): Attraction {
    const attraction = attractions.find(item => item.id === id);
    if (!attraction) {
      throw new AppError(`Atracción con id "${id}" no encontrada`, 404);
    }
    return attraction;
  },

  /**
   * Crea una nueva atracción.
   * @throws {AppError} 400 si faltan campos requeridos
   * @throws {AppError} 409 si el código ya existe
   */
  create(data: CreateAttractionDto, file?: Express.Multer.File): Attraction {
    const { name, code, area, status } = data;

    if (!name || !code || !area || !status) {
      throw new AppError('name, code, area y status son obligatorios', 400);
    }

    if (attractions.some(item => item.code === code)) {
      throw new AppError(`El código de atracción "${code}" ya existe`, 409);
    }

    const imageUrl = file ? `/uploads/${file.filename}` : (data.image ?? '');

    const attraction: Attraction = {
      id: `a-${Date.now()}`,
      name,
      code,
      area,
      status,
      description: data.description ?? '',
      image: imageUrl,
      capacity: Number(data.capacity ?? 0),
      height_m: Number(data.height_m ?? 0),
      duration_min: Number(data.duration_min ?? 0),
      total_plans: 0,
      pending_docs: 0,
      last_maintenance: data.last_maintenance ?? new Date().toISOString().slice(0, 10),
      next_maintenance: data.next_maintenance ?? new Date().toISOString().slice(0, 10),
      technical_specs: data.technical_specs,
    };

    attractions.unshift(attraction);
    return attraction;
  },

  /**
   * Actualiza una atracción existente.
   * @throws {AppError} 404 si no se encuentra
   */
  update(id: string, data: UpdateAttractionDto, file?: Express.Multer.File): Attraction {
    const index = attractions.findIndex(item => item.id === id);
    if (index === -1) {
      throw new AppError(`Atracción con id "${id}" no encontrada`, 404);
    }

    const imageUrl = file ? `/uploads/${file.filename}` : data.image;

    const updated: Attraction = {
      ...attractions[index],
      ...data,
      image: imageUrl !== undefined ? imageUrl : attractions[index].image,
      id: attractions[index].id, // ID nunca se sobreescribe
    };

    attractions[index] = updated;
    return updated;
  },

  /**
   * Elimina una atracción por ID.
   * @throws {AppError} 404 si no se encuentra
   */
  remove(id: string): Attraction {
    const index = attractions.findIndex(item => item.id === id);
    if (index === -1) {
      throw new AppError(`Atracción con id "${id}" no encontrada`, 404);
    }

    const [deleted] = attractions.splice(index, 1);
    return deleted;
  },
};
