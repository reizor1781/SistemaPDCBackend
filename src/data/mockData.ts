import bcrypt from 'bcryptjs';
import { UserRole } from '../types/auth.js';

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  active: boolean;
  passwordHash: string;
}

export const demoUsers: DemoUser[] = [
  {
    id: 'u1',
    name: 'Carlos Mendoza',
    email: 'admin@parquedelcafe.com',
    role: 'admin',
    department: 'Direccion de Ingenieria',
    active: true,
    passwordHash: bcrypt.hashSync('admin123', 10),
  },
  {
    id: 'u2',
    name: 'Andres Giraldo',
    email: 'ingeniero@parquedelcafe.com',
    role: 'engineer',
    department: 'Ingenieria Electrica',
    active: true,
    passwordHash: bcrypt.hashSync('ing123', 10),
  },
  {
    id: 'u3',
    name: 'Luis Castano',
    email: 'tecnico@parquedelcafe.com',
    role: 'technician',
    department: 'Mantenimiento',
    active: true,
    passwordHash: bcrypt.hashSync('tec123', 10),
  },
  {
    id: 'u4',
    name: 'Maria Ospina',
    email: 'operador@parquedelcafe.com',
    role: 'operator',
    department: 'Operaciones',
    active: true,
    passwordHash: bcrypt.hashSync('op123', 10),
  },
];

export const demoAttractions = [
  { id: 'a1', name: 'Montana Rusa', code: 'MR-001', area: 'Zona Extrema', status: 'operational' },
  { id: 'a2', name: 'Tren del Cafe', code: 'TC-001', area: 'Zona Cultural', status: 'operational' },
  { id: 'a3', name: 'Rapidos del Rio', code: 'RR-001', area: 'Zona Aventura', status: 'maintenance' },
  { id: 'a4', name: 'Carrusel Clasico', code: 'CC-001', area: 'Zona Infantil', status: 'operational' },
  { id: 'a5', name: 'Teleferico', code: 'TF-001', area: 'Zona Familiar', status: 'operational' },
  { id: 'a6', name: 'Torre Mirador', code: 'TM-001', area: 'Zona Aventura', status: 'operational' },
  { id: 'a7', name: 'Sillas Voladoras', code: 'SV-001', area: 'Zona Familiar', status: 'inspection' },
  { id: 'a8', name: 'Splash Acuatico', code: 'SA-001', area: 'Zona Aventura', status: 'operational' },
];

export const demoPlans = [
  {
    id: 'p1',
    attraction_id: 'a1',
    plan_number: 'MR-EL-001-A',
    title: 'Diagrama Unifilar General - Montana Rusa',
    type: 'single_line',
    status: 'approved',
    current_version: 'Rev. A',
    file_url: '/sample-plans/sample.pdf',
  },
  {
    id: 'p2',
    attraction_id: 'a3',
    plan_number: 'RR-EL-001-A',
    title: 'Diagrama de Potencia Bombas - Rapidos del Rio',
    type: 'power_diagram',
    status: 'review',
    current_version: 'Rev. A',
    file_url: '/sample-plans/sample.pdf',
  },
];

export const demoManuals = [
  {
    id: 'm1',
    attraction_id: 'a1',
    manual_number: 'MR-MAN-001',
    title: 'Manual de Operacion - Montana Rusa',
    category: 'operation',
    status: 'active',
    current_version: 'Rev. A',
    file_url: '/sample-plans/sample.pdf',
    pages: 12,
    file_size_kb: 1024,
    description: 'Procedimientos operativos generales de la atraccion.',
  },
  {
    id: 'm2',
    attraction_id: 'a3',
    manual_number: 'RR-MAN-001',
    title: 'Manual de Mantenimiento - Rapidos del Rio',
    category: 'maintenance',
    status: 'active',
    current_version: 'Rev. A',
    file_url: '/sample-plans/sample.pdf',
    pages: 18,
    file_size_kb: 1024,
    description: 'Rutinas de mantenimiento preventivo y correctivo.',
  },
];
