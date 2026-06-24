import bcrypt from 'bcryptjs';
import { demoUsers } from '../data/mockData.js';
import { CreateUserDto, SafeUser, UpdateUserDto } from '../models/user.model.js';
import { AppError } from '../types/errors.js';
import { UserRole } from '../types/auth.js';

// En memoria hasta que se conecte la BD (Prisma)
const users = demoUsers;
const VALID_ROLES: UserRole[] = ['admin', 'engineer', 'technician', 'operator'];

/** Elimina passwordHash del objeto de usuario antes de enviarlo al cliente */
const toSafeUser = ({ passwordHash, ...user }: (typeof demoUsers)[number]): SafeUser => {
  void passwordHash;
  return user;
};

/**
 * UserService — gestión de usuarios del sistema.
 */
export const UserService = {
  /**
   * Devuelve todos los usuarios sin datos sensibles.
   */
  findAll(): SafeUser[] {
    return users.map(toSafeUser);
  },

  /**
   * Crea un nuevo usuario.
   * @throws {AppError} 400 si faltan campos o el rol es inválido
   * @throws {AppError} 409 si el email ya existe
   */
  create(data: CreateUserDto): SafeUser {
    const { name, email, role, department, active, password } = data;

    if (!name || !email || !role) {
      throw new AppError('name, email y role son obligatorios', 400);
    }

    if (!VALID_ROLES.includes(role)) {
      throw new AppError(`Rol inválido. Valores permitidos: ${VALID_ROLES.join(', ')}`, 400);
    }

    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new AppError(`El email "${email}" ya está registrado`, 409);
    }

    const user = {
      id: `u-${Date.now()}`,
      name,
      email,
      role,
      department: department ?? '',
      active: active ?? true,
      passwordHash: bcrypt.hashSync(password ?? 'usuario123', 10),
    };

    users.push(user);
    return toSafeUser(user);
  },

  /**
   * Actualiza los datos de un usuario.
   * @throws {AppError} 404 si no se encuentra
   * @throws {AppError} 400 si el rol es inválido
   * @throws {AppError} 409 si el email ya pertenece a otro usuario
   */
  update(id: string, data: UpdateUserDto): SafeUser {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new AppError(`Usuario con id "${id}" no encontrado`, 404);
    }

    const { name, email, role, department, active, password } = data;

    if (role && !VALID_ROLES.includes(role)) {
      throw new AppError(`Rol inválido. Valores permitidos: ${VALID_ROLES.join(', ')}`, 400);
    }

    if (email && users.some(u => u.id !== id && u.email.toLowerCase() === email.toLowerCase())) {
      throw new AppError(`El email "${email}" ya está registrado por otro usuario`, 409);
    }

    const updated = {
      ...users[index],
      name: name ?? users[index].name,
      email: email ?? users[index].email,
      role: role ?? users[index].role,
      department: department ?? users[index].department,
      active: active ?? users[index].active,
      passwordHash: password ? bcrypt.hashSync(password, 10) : users[index].passwordHash,
    };

    users[index] = updated;
    return toSafeUser(updated);
  },

  /**
   * Elimina un usuario por ID.
   * @throws {AppError} 400 si el usuario intenta eliminarse a sí mismo
   * @throws {AppError} 404 si no se encuentra
   */
  remove(id: string, requesterId?: string): SafeUser {
    if (requesterId && requesterId === id) {
      throw new AppError('No puedes eliminar tu propio usuario', 400);
    }

    const index = users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new AppError(`Usuario con id "${id}" no encontrado`, 404);
    }

    const [deleted] = users.splice(index, 1);
    return toSafeUser(deleted);
  },
};
