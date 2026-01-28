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

  console.log('Seed data inserted (Services & Admins: admin/dev)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
