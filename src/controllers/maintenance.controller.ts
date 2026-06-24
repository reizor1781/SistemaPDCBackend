import { Request, Response } from 'express';

const demoMaintenance = [
  {
    id: 'mnt1',
    attraction_id: 'a1',
    type: 'preventive',
    status: 'completed',
    date: '2026-06-10',
    technician: 'Luis Castano',
    description: 'Monthly electrical inspection and VFD parameter review.',
  },
];

export function listMaintenance(req: Request, res: Response) {
  const attractionId = req.query.attraction_id;
  const data = attractionId
    ? demoMaintenance.filter(item => item.attraction_id === attractionId)
    : demoMaintenance;

  res.json({ data });
}
