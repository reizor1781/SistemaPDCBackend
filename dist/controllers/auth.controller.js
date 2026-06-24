import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { demoUsers } from '../data/mockData.js';
export async function login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = demoUsers.find(item => item.email === email && item.active);
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const signOptions = { expiresIn: env.jwtExpiresIn };
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, env.jwtSecret, signOptions);
    const { passwordHash, ...safeUser } = user;
    return res.json({ token, user: safeUser });
}
export function me(req, res) {
    return res.json({ user: req.user });
}
