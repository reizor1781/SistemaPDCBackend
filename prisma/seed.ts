import { PrismaClient } from '@prisma/client';
import { demoAttractions, demoPlans, demoUsers } from '../src/data/mockData.js';

const prisma = new PrismaClient();

const totalPlansByAttractionCode: Record<string, number> = {
  'MR-001': 12,
  'TC-001': 8,
  'RR-001': 15,
  'CC-001': 6,
  'TF-001': 18,
  'TM-001': 10,
  'SV-001': 7,
  'SA-001': 9,
};

async function main() {
  console.log('Start seeding...');

  let adminId = '';

  for (const user of demoUsers) {
    const saved = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role as any,
        department: user.department,
        active: user.active,
      },
      create: {
        id: user.id,
        email: user.email,
        name: user.name,
        passwordHash: user.passwordHash,
        role: user.role as any,
        department: user.department,
        active: user.active,
      },
    });

    if (saved.role === 'admin' && !adminId) {
      adminId = saved.id;
    }
  }

  console.log('Users seeded');

  for (const attraction of demoAttractions) {
    const technicalSpecs = {
      total_plans: totalPlansByAttractionCode[attraction.code] ?? 0,
    };

    await prisma.attraction.upsert({
      where: { code: attraction.code },
      update: {
        name: attraction.name,
        area: attraction.area,
        status: attraction.status as any,
        technicalSpecs,
      },
      create: {
        id: attraction.id,
        name: attraction.name,
        code: attraction.code,
        area: attraction.area,
        status: attraction.status as any,
        description: '',
        image: '',
        capacity: 0,
        heightM: 0,
        durationMin: 0,
        technicalSpecs,
      },
    });
  }

  console.log('Attractions seeded');

  for (const plan of demoPlans) {
    await prisma.electricalPlan.upsert({
      where: { planNumber: plan.plan_number },
      update: {
        title: plan.title,
        type: plan.type as any,
        status: plan.status as any,
        currentVersion: plan.current_version,
        fileUrl: plan.file_url,
        description: plan.description || '',
      },
      create: {
        id: plan.id,
        attractionId: plan.attraction_id,
        planNumber: plan.plan_number,
        title: plan.title,
        type: plan.type as any,
        status: plan.status as any,
        currentVersion: plan.current_version,
        authorId: adminId || undefined,
        fileUrl: plan.file_url,
        fileSizeKb: plan.file_size_kb || 1024,
        pages: plan.pages || 1,
        tags: [],
        description: plan.description || '',
        createdAt: plan.created_date ? new Date(plan.created_date) : new Date(),
        updatedAt: plan.updated_date ? new Date(plan.updated_date) : new Date(),
      },
    });
  }

  console.log('Plans seeded');
  console.log('Seeding finished.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
