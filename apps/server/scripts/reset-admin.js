const { prisma } = require('../../../packages/database/src');
const bcrypt = require('bcryptjs');

async function resetAdmin(username) {
  let defaultPassword = '';
  if (username === 'dev') defaultPassword = 'd3v3l0p3r';
  else if (username === 'admin') defaultPassword = '4dm1n1str4d0r';
  else {
    console.error('Error: Usuario debe ser "dev" o "admin"');
    process.exit(1);
  }

  console.log(`Restableciendo usuario: ${username}...`);
  
  try {
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Verify user exists first
    const user = await prisma.admin.findUnique({ where: { username } });
    
    if (!user) {
      console.error(`Error: El usuario "${username}" no existe en la base de datos.`);
      console.log('Ejecuta "npx prisma db seed" para crear los usuarios iniciales.');
      process.exit(1);
    }

    await prisma.admin.update({
      where: { username },
      data: {
        password: hashedPassword,
        isSetup: false,
        email: null,
        verificationCode: null,
        verificationCodeExpiresAt: null
      }
    });

    console.log(`✅ Usuario ${username} restablecido exitosamente.`);
    console.log(`📝 Contraseña temporal: ${defaultPassword}`);
    console.log(`⚠️  El usuario deberá realizar el proceso de configuración inicial en su próximo ingreso.`);
  } catch (error) {
    console.error('Error al restablecer usuario:', error);
    process.exit(1);
  }
}

const args = process.argv.slice(2);
if (args.length !== 1) {
  console.log('\nHerramienta de Restablecimiento de Administrador');
  console.log('-----------------------------------------------');
  console.log('Uso: node apps/server/scripts/reset-admin.js <username>');
  console.log('\nEjemplos:');
  console.log('  node apps/server/scripts/reset-admin.js dev');
  console.log('  node apps/server/scripts/reset-admin.js admin');
  process.exit(1);
}

resetAdmin(args[0])
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
