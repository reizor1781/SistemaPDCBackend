import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { demoUsers } from '../data/mockData.js';
import { UserRole } from '../types/auth.js';

const users = demoUsers;
const roles: UserRole[] = ['admin', 'engineer', 'technician', 'operator'];

const toSafeUser = ({ passwordHash, ...user }: (typeof demoUsers)[number]) => user;

export function listUsers(_req: Request, res: Response) {
  const data = users.map(toSafeUser);
  res.json({ data });
}

export function createUser(req: Request, res: Response) {
  const { name, email, role, department, active, password } = req.body as {
    name?: string;
    email?: string;
    role?: UserRole;
    department?: string;
    active?: boolean;
    password?: string;
  };

  if (!name || !email || !role) {
    return res.status(400).json({ error: 'Name, email and role are required' });
  }

  if (!roles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ error: 'User email already exists' });
  }

  const user = {
    id: `u-${Date.now()}`,
    name,
    email,
    role,
    department: department ?? '',
    active: active ?? true,
    passwordHash: bcrypt.hashSync(password || 'usuario123', 10),
  };

  users.push(user);
  return res.status(201).json({ data: toSafeUser(user) });
}

export function updateUser(req: Request, res: Response) {
  const index = users.findIndex(user => user.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'User not found' });

  const { name, email, role, department, active, password } = req.body as {
    name?: string;
    email?: string;
    role?: UserRole;
    department?: string;
    active?: boolean;
    password?: string;
  };

  if (role && !roles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  if (email && users.some(user => user.id !== req.params.id && user.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ error: 'User email already exists' });
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
  return res.json({ data: toSafeUser(updated) });
}

export function deleteUser(req: Request, res: Response) {
  if (req.user?.id === req.params.id) {
    return res.status(400).json({ error: 'You cannot delete your own user' });
  }

  const index = users.findIndex(user => user.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'User not found' });

  const [deleted] = users.splice(index, 1);
  return res.json({ data: toSafeUser(deleted) });
}
