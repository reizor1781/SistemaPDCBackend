import bcrypt from 'bcryptjs';
import { demoUsers } from '../data/mockData.js';
const users = demoUsers;
const roles = ['admin', 'engineer', 'technician', 'operator'];
const toSafeUser = ({ passwordHash, ...user }) => user;
export function listUsers(_req, res) {
    const data = users.map(toSafeUser);
    res.json({ data });
}
export function createUser(req, res) {
    const { name, email, role, department, active, password } = req.body;
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
export function updateUser(req, res) {
    const index = users.findIndex(user => user.id === req.params.id);
    if (index === -1)
        return res.status(404).json({ error: 'User not found' });
    const { name, email, role, department, active, password } = req.body;
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
export function deleteUser(req, res) {
    if (req.user?.id === req.params.id) {
        return res.status(400).json({ error: 'You cannot delete your own user' });
    }
    const index = users.findIndex(user => user.id === req.params.id);
    if (index === -1)
        return res.status(404).json({ error: 'User not found' });
    const [deleted] = users.splice(index, 1);
    return res.json({ data: toSafeUser(deleted) });
}
