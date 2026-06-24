import { demoAttractions } from '../data/mockData.js';
const attractions = demoAttractions;
export function listAttractions(_req, res) {
    res.json({ data: attractions });
}
export function getAttraction(req, res) {
    const attraction = attractions.find(item => item.id === req.params.id);
    if (!attraction)
        return res.status(404).json({ error: 'Attraction not found' });
    return res.json({ data: attraction });
}
export function createAttraction(req, res) {
    const { name, code, area, status } = req.body;
    if (!name || !code || !area || !status) {
        return res.status(400).json({ error: 'Name, code, area and status are required' });
    }
    if (attractions.some(item => item.code === code)) {
        return res.status(409).json({ error: 'Attraction code already exists' });
    }
    const attraction = {
        id: `a-${Date.now()}`,
        name,
        code,
        area,
        status,
        description: req.body.description || '',
        capacity: Number(req.body.capacity ?? 0),
        height_m: Number(req.body.height_m ?? 0),
        duration_min: Number(req.body.duration_min ?? 0),
        total_plans: Number(req.body.total_plans ?? 0),
        pending_docs: Number(req.body.pending_docs ?? 0),
        last_maintenance: req.body.last_maintenance || new Date().toISOString().slice(0, 10),
        next_maintenance: req.body.next_maintenance || new Date().toISOString().slice(0, 10),
        technical_specs: req.body.technical_specs,
    };
    attractions.unshift(attraction);
    return res.status(201).json({ data: attraction });
}
export function updateAttraction(req, res) {
    const index = attractions.findIndex(item => item.id === req.params.id);
    if (index === -1)
        return res.status(404).json({ error: 'Attraction not found' });
    const updated = {
        ...attractions[index],
        ...req.body,
        id: attractions[index].id,
    };
    attractions[index] = updated;
    return res.json({ data: updated });
}
export function deleteAttraction(req, res) {
    const index = attractions.findIndex(item => item.id === req.params.id);
    if (index === -1)
        return res.status(404).json({ error: 'Attraction not found' });
    const [deleted] = attractions.splice(index, 1);
    return res.json({ data: deleted });
}
