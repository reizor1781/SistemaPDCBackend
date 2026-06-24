import { prisma } from '../lib/prisma.js';
export const MaintenanceService = {
    async findAll(attractionId) {
        const records = await prisma.maintenanceRecord.findMany({
            where: attractionId ? { attractionId } : undefined,
            orderBy: { date: 'desc' },
        });
        return records.map((r) => ({
            id: r.id,
            attraction_id: r.attractionId,
            type: r.type,
            status: r.status,
            date: r.date.toISOString().slice(0, 10),
            technician: r.technician,
            description: r.description,
            duration_hours: r.durationHours,
            parts_replaced: r.partsReplaced,
            observations: r.observations,
        }));
    },
};
