// server/prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // Seed Services
  const services = [
    {
      name: 'Podología Clínica Integral',
      description: 'Evaluación, corte de uñas, limpieza de surcos, retiro de durezas y humectación.',
      price: 25000,
      category: 'Clínico',
    },
    {
      name: 'Tratamiento Onicocriptosis (Uña Encarnada)',
      description: 'Procedimiento para retirar la espícula de la uña que causa dolor e infección.',
      price: 35000,
      category: 'Clínico',
    },
    {
      name: 'Reconstrucción Ungueal',
      description: 'Reconstrucción estética de la uña con resina acrílica medicada.',
      price: 15000,
      category: 'Estético',
    },
    {
      name: 'Esmaltado Permanente',
      description: 'Esmaltado de larga duración posterior a la atención podológica.',
      price: 12000,
      category: 'Estético',
    },
    {
      name: 'Ortosis de Silicona',
      description: 'Dispositivo a medida para corregir o proteger zonas de presión en los dedos.',
      price: 18000,
      category: 'Ortopedia',
    },
    {
      name: 'Masaje Podal Relajante',
      description: 'Masaje de 20 minutos enfocado en aliviar la tensión y mejorar la circulación.',
      price: 15000,
      category: 'Bienestar',
    },
  ];

  for (const service of services) {
    const exists = await prisma.service.findFirst({ where: { name: service.name } });
    if (!exists) {
      await prisma.service.create({ data: service });
    }
  }

  // Seed Admin and Dev
  const adminPassword = await bcrypt.hash('4dm1n1str4d0r', 10);
  const devPassword = await bcrypt.hash('d3v3l0p3r', 10);

  // Admin user
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: { password: adminPassword }, // Update password if exists to ensure it matches requirement
    create: {
      username: 'admin',
      password: adminPassword,
      isSetup: false,
    },
  });

  // Dev user
  await prisma.admin.upsert({
    where: { username: 'dev' },
    update: { password: devPassword },
    create: {
      username: 'dev',
      password: devPassword,
      isSetup: false,
    },
  });

  // Seed SiteConfig
  await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      email: 'contacto@podologiaconi.cl',
      phone: '+56 9 1234 5678',
      address: 'Av. Providencia 1234, Of. 505',
      instagram: 'https://instagram.com/podologiaconi',
      heroTitle: 'Podología Clínica Integral',
      heroSubtitle: 'Recupera la salud y belleza de tus pies con atención profesional personalizada.',
      aboutTitle: 'Hola, soy Constanza Cortés',
      aboutText: 'Podóloga clínica certificada con experiencia en el tratamiento de diversas patologías del pie. Mi compromiso es brindar una atención de calidad, segura y empática.',
    },
  });

  // Seed Success Cases (3 placeholders)
  const countCases = await prisma.successCase.count();
  if (countCases === 0) {
    await prisma.successCase.createMany({
      data: [
        {
          title: 'Onicocriptosis Severa',
          description: 'Paciente con uña encarnada de 3 semanas de evolución. Se realiza espiculectomía y curación avanzada. Recuperación total en 2 semanas.',
          imageBefore: 'https://images.unsplash.com/photo-1628965942468-b7c4d51624c8?q=80&w=600&auto=format&fit=crop',
          imageAfter: 'https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?q=80&w=600&auto=format&fit=crop',
        },
        {
          title: 'Reconstrucción Ungueal',
          description: 'Reconstrucción estética de lámina ungueal traumatizada mediante resina acrílica con antimicótico.',
          imageBefore: 'https://images.unsplash.com/photo-1632053009581-2296c0952528?q=80&w=600&auto=format&fit=crop',
          imageAfter: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=600&auto=format&fit=crop',
        },
        {
          title: 'Tratamiento de Durezas',
          description: 'Eliminación de hiperqueratosis plantar severa y grietas en talones. Hidratación profunda.',
          imageBefore: 'https://images.unsplash.com/photo-1549488656-d4198c60f269?q=80&w=600&auto=format&fit=crop',
          imageAfter: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=600&auto=format&fit=crop',
        },
      ]
    });
  }

  console.log('Seed data inserted (Services, Admins, SiteConfig & SuccessCases)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
