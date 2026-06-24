import { Request, Response } from 'express';
import { demoPlans } from '../data/mockData.js';

const plans = demoPlans as Array<Record<string, unknown>>;

export function listPlans(req: Request, res: Response) {
  const attractionId = req.query.attraction_id;
  const data = attractionId
    ? plans.filter(plan => plan.attraction_id === attractionId)
    : plans;

  return res.json({ data });
}

export function getPlan(req: Request, res: Response) {
  const plan = plans.find(item => item.id === req.params.id);
  if (!plan) return res.status(404).json({ error: 'Plan not found' });
  return res.json({ data: plan });
}

export function uploadPlan(req: Request, res: Response) {
  const fileName = req.file?.filename;
  const now = new Date().toISOString();
  const plan = {
    id: `p-${Date.now()}`,
    attraction_id: req.body.attraction_id,
    plan_number: req.body.plan_number || `PL-${Date.now()}`,
    title: req.body.title,
    type: req.body.type || 'single_line',
    status: 'draft',
    current_version: 'Rev. 0',
    created_date: now,
    updated_date: now,
    author: req.user?.email ?? 'Servidor',
    file_url: fileName ? `/uploads/${fileName}` : '',
    file_size_kb: req.file ? Math.round(req.file.size / 1024) : 0,
    pages: 1,
    revisions: [],
    comments: [],
    tags: [],
    description: req.body.description || '',
  };

  plans.unshift(plan);

  return res.status(201).json({
    message: 'Plan uploaded',
    data: plan,
  });
}

export function updatePlan(req: Request, res: Response) {
  const index = plans.findIndex(item => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Plan not found' });

  const updated = {
    ...plans[index],
    ...req.body,
    id: plans[index].id,
    updated_date: new Date().toISOString(),
  };

  plans[index] = updated;
  return res.json({ data: updated });
}

export function deletePlan(req: Request, res: Response) {
  const index = plans.findIndex(item => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Plan not found' });

  const [deleted] = plans.splice(index, 1);
  return res.json({ data: deleted });
}
