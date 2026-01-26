// server/prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
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
    await prisma.service.create({
      data: service,
    });
  }

  console.log('Seed data inserted');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
