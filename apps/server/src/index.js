// server/index.js
const express = require('express');
const cors = require('cors');
const { prisma } = require('../../../packages/database/src');
const { Resend } = require('resend');
const crypto = require('crypto');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

dotenv.config();

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);
const SECRET_KEY = process.env.SECRET_KEY || 'supersecretkey';

// Cloudinary Config (auto-loads from CLOUDINARY_URL)
// We only need to ensure secure URLs
cloudinary.config({
  secure: true
});

// Multer config (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper to extract public_id from Cloudinary URL
const getPublicIdFromUrl = (url) => {
  if (!url || !url.includes('cloudinary.com')) return null;
  try {
    // Example: https://res.cloudinary.com/cloudname/image/upload/v1234567890/podologiaconi/image.jpg
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    const publicIdWithExt = filename.split('.')[0];
    const folder = parts[parts.length - 2];

    // Check if folder is part of public_id (usually is for structured folders)
    // If the URL has the folder 'podologiaconi', we want 'podologiaconi/filename'
    if (folder === 'podologiaconi') {
      return `${folder}/${publicIdWithExt}`;
    }
    return publicIdWithExt;
  } catch (e) {
    console.error('Error parsing Cloudinary URL:', e);
    return null;
  }
};

// Helper to delete image from Cloudinary
const deleteCloudinaryImage = async (url) => {
  const publicId = getPublicIdFromUrl(url);
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
      console.log(`Deleted Cloudinary image: ${publicId}`);
    } catch (error) {
      console.error(`Failed to delete Cloudinary image ${publicId}:`, error);
    }
  }
};


// Helper to generate 8 char alphanumeric code
const generateCode = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

app.use(cors());
app.use(express.json());

// Middleware for auth
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Login Route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await prisma.admin.findUnique({ where: { username } });

  if (!admin) return res.status(400).json({ error: 'Usuario no encontrado' });

  const validPassword = await bcrypt.compare(password, admin.password);
  if (!validPassword) return res.status(400).json({ error: 'Contraseña incorrecta' });

  // Check if setup is required
  if (!admin.isSetup) {
    const tempToken = jwt.sign({ username: admin.username, scope: 'setup' }, SECRET_KEY, { expiresIn: '15m' });
    return res.json({ status: 'SETUP_REQUIRED', token: tempToken });
  }

  // If setup is done, trigger 2FA
  const code = generateCode();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

  await prisma.admin.update({
    where: { username },
    data: {
      verificationCode: code,
      verificationCodeExpiresAt: expiresAt
    }
  });

  // Send 2FA email
  try {
    await resend.emails.send({
      from: 'noreply@podologiaconi.cl', // As requested
      to: [admin.email],
      subject: 'Código de Verificación - Podología Coni',
      text: `Tu código de acceso es: ${code}\n\nEste código expira en 5 minutos.`,
    });
  } catch (error) {
    console.error('Error sending 2FA email:', error);
    // Continue anyway to allow user to enter code if they received it previously or try resend
  }

  const tempToken = jwt.sign({ username: admin.username, scope: '2fa' }, SECRET_KEY, { expiresIn: '15m' });
  res.json({ status: '2FA_REQUIRED', token: tempToken });
});

// Auth Routes

// Send Verification Code (for Setup)
app.post('/api/auth/send-code', authenticateToken, async (req, res) => {
  const { email } = req.body;
  const { username, scope } = req.user;

  if (scope !== 'setup') return res.status(403).json({ error: 'Invalid scope for this action' });
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const code = generateCode();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

  await prisma.admin.update({
    where: { username },
    data: {
      verificationCode: code,
      verificationCodeExpiresAt: expiresAt
    }
  });

  try {
    await resend.emails.send({
      from: 'noreply@podologiaconi.cl',
      to: [email],
      subject: 'Código de Verificación - Configuración Inicial',
      text: `Tu código de validación es: ${code}\n\nEste código expira en 5 minutos.`,
    });
    res.json({ message: 'Code sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error sending email' });
  }
});

// Setup Account (First Time)
app.post('/api/auth/setup', authenticateToken, async (req, res) => {
  const { email, code, newPassword } = req.body;
  const { username, scope } = req.user;

  if (scope !== 'setup') return res.status(403).json({ error: 'Invalid scope' });

  const admin = await prisma.admin.findUnique({ where: { username } });

  if (!admin.verificationCode || admin.verificationCode !== code) {
    return res.status(400).json({ error: 'Código inválido' });
  }

  if (new Date() > admin.verificationCodeExpiresAt) {
    return res.status(400).json({ error: 'El código ha expirado' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.admin.update({
    where: { username },
    data: {
      email,
      password: hashedPassword,
      isSetup: true,
      verificationCode: null,
      verificationCodeExpiresAt: null
    }
  });

  res.json({ message: 'Setup completed successfully' });
});

// Verify 2FA
app.post('/api/auth/verify-2fa', authenticateToken, async (req, res) => {
  const { code } = req.body;
  const { username, scope } = req.user;

  if (scope !== '2fa') return res.status(403).json({ error: 'Invalid scope' });

  const admin = await prisma.admin.findUnique({ where: { username } });

  if (!admin.verificationCode || admin.verificationCode !== code) {
    return res.status(400).json({ error: 'Código inválido' });
  }

  if (new Date() > admin.verificationCodeExpiresAt) {
    return res.status(400).json({ error: 'El código ha expirado' });
  }

  // Clear code
  await prisma.admin.update({
    where: { username },
    data: { verificationCode: null, verificationCodeExpiresAt: null }
  });

  // Issue full token
  const token = jwt.sign({ username: admin.username, scope: 'full' }, SECRET_KEY, { expiresIn: '8h' });
  res.json({ token });
});


// Routes
// Get all services
app.get('/api/services', async (req, res) => {
  try {
    const services = await prisma.service.findMany({ orderBy: { id: 'asc' } });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching services' });
  }
});

app.get('/api/services/version', async (req, res) => {
  try {
    const latest = await prisma.service.findMany({
      select: { updatedAt: true },
      orderBy: { updatedAt: 'desc' },
      take: 1
    });
    const version = latest[0]?.updatedAt?.toISOString() || 'none';
    res.json({ version });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching version' });
  }
});

// Create a service (Protected)
app.post('/api/services', authenticateToken, async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const service = await prisma.service.create({
      data: { name, description, price: parseFloat(price), category },
    });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Error creating service' });
  }
});

// Update a service (Protected)
app.put('/api/services/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category } = req.body;
    const service = await prisma.service.update({
      where: { id: parseInt(id) },
      data: { name, description, price: parseFloat(price), category },
    });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Error updating service' });
  }
});

// Delete a service (Protected)
app.delete('/api/services/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.service.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting service' });
  }
});

// Send quotation email
app.post('/api/quote', async (req, res) => {
  try {
    const { name, email, phone, services } = req.body;
    const serviceList = Array.isArray(services) ? services.map(s => `- ${s.name}`).join('\n') : '';
    const emailLine = email ? `Email: ${email}\n` : '';

    // Persist contact (create or ignore if exists)
    try {
      await prisma.contact.upsert({
        where: { phone },
        update: { name, email },
        create: { name, email, phone },
      });
    } catch (e) {
      // ignore prisma errors for contact to not block email
    }

    // Send email via Resend
    const fromAddress = process.env.MAIL_FROM || 'onboarding@resend.dev';
    const toAddresses = process.env.MAIL_TO
      ? process.env.MAIL_TO.split(',').map(email => email.trim())
      : ['delivered@resend.dev'];

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: toAddresses,
      subject: `Cliente: ${name}`,
      text: `Nombre: ${name}\n${emailLine}Teléfono: ${phone}\n\nServicios Seleccionados:\n${serviceList}`,
    });

    if (error) {
      return res.status(400).json({ error });
    }

    res.json({ message: 'Email sent successfully', data });
  } catch (error) {
    res.status(500).json({ error: 'Error sending email' });
  }
});

// --- SITE CONTENT ROUTES ---

// Get Site Config (Public)
app.get('/api/config', async (req, res) => {
  try {
    const config = await prisma.siteConfig.findUnique({ where: { id: 1 } });
    res.json(config || {});
  } catch (error) {
    res.status(500).json({ error: 'Error fetching config' });
  }
});

// Update Site Config (Protected)
app.put('/api/config', authenticateToken, async (req, res) => {
  try {
    const data = req.body;
    // Remove id/updatedAt if present
    delete data.id;
    delete data.updatedAt;

    // Fetch current config to check for image changes
    const currentConfig = await prisma.siteConfig.findUnique({ where: { id: 1 } });

    if (currentConfig && currentConfig.aboutImage && data.aboutImage && currentConfig.aboutImage !== data.aboutImage) {
      await deleteCloudinaryImage(currentConfig.aboutImage);
    }

    const config = await prisma.siteConfig.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data }
    });
    res.json(config);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating config' });
  }
});

// Get Success Cases (Public)
app.get('/api/success-cases', async (req, res) => {
  try {
    const cases = await prisma.successCase.findMany({ orderBy: { id: 'asc' } });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching success cases' });
  }
});

// Create Success Case (Protected)
app.post('/api/success-cases', authenticateToken, async (req, res) => {
  try {
    const { title, description, imageBefore, imageAfter } = req.body;
    const newCase = await prisma.successCase.create({
      data: { title, description, imageBefore, imageAfter }
    });
    res.json(newCase);
  } catch (error) {
    res.status(500).json({ error: 'Error creating success case' });
  }
});

// Update Success Case (Protected)
app.put('/api/success-cases/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, imageBefore, imageAfter } = req.body;

    // Fetch current case to check for image changes
    const currentCase = await prisma.successCase.findUnique({ where: { id: parseInt(id) } });

    if (currentCase) {
      if (currentCase.imageBefore && imageBefore && currentCase.imageBefore !== imageBefore) {
        await deleteCloudinaryImage(currentCase.imageBefore);
      }
      if (currentCase.imageAfter && imageAfter && currentCase.imageAfter !== imageAfter) {
        await deleteCloudinaryImage(currentCase.imageAfter);
      }
    }

    const updatedCase = await prisma.successCase.update({
      where: { id: parseInt(id) },
      data: { title, description, imageBefore, imageAfter }
    });
    res.json(updatedCase);
  } catch (error) {
    res.status(500).json({ error: 'Error updating success case' });
  }
});

// Delete Success Case (Protected)
app.delete('/api/success-cases/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const caseItem = await prisma.successCase.findUnique({ where: { id: parseInt(id) } });

    if (caseItem) {
      // Delete images from Cloudinary
      if (caseItem.imageBefore) await deleteCloudinaryImage(caseItem.imageBefore);
      if (caseItem.imageAfter) await deleteCloudinaryImage(caseItem.imageAfter);

      await prisma.successCase.delete({ where: { id: parseInt(id) } });
      res.json({ message: 'Success case deleted' });
    } else {
      res.status(404).json({ error: 'Case not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting success case' });
  }
});

// Upload Image to Cloudinary
app.post('/api/upload', authenticateToken, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'podologiaconi',
      resource_type: 'auto'
    });

    res.json({
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ error: 'Error uploading image' });
  }
});

// Delete Image from Cloudinary (Manual)
app.post('/api/upload/delete', authenticateToken, async (req, res) => {
  const { public_id, url } = req.body;

  // Allow passing url or public_id
  let idToDelete = public_id;
  if (!idToDelete && url) {
    idToDelete = getPublicIdFromUrl(url);
  }

  if (!idToDelete) return res.status(400).json({ error: 'No public_id or valid url provided' });

  try {
    await cloudinary.uploader.destroy(idToDelete);
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    res.status(500).json({ error: 'Error deleting image' });
  }
});

// Profile: Update Password
app.put('/api/admin/profile/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { username } = req.user;
    const admin = await prisma.admin.findUnique({ where: { username } });

    const valid = await bcrypt.compare(currentPassword, admin.password);
    if (!valid) return res.status(400).json({ error: 'Contraseña actual incorrecta' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({ where: { username }, data: { password: hashedPassword } });
    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar contraseña' });
  }
});

// Profile: Request Email Change
app.post('/api/admin/profile/email-request', authenticateToken, async (req, res) => {
  try {
    const { newEmail } = req.body;
    const { username } = req.user;

    // Generate code
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    await prisma.admin.update({
      where: { username },
      data: {
        pendingEmail: newEmail,
        verificationCode: code,
        verificationCodeExpiresAt: expiresAt
      }
    });

    // Send email
    await resend.emails.send({
      from: 'noreply@podologiaconi.cl',
      to: [newEmail],
      subject: 'Código de Verificación - Cambio de Correo',
      text: `Tu código de validación para cambiar tu correo es: ${code}\n\nEste código expira en 5 minutos.`,
    });

    res.json({ message: 'Código de verificación enviado al nuevo correo' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al solicitar cambio de correo' });
  }
});

// Profile: Confirm Email Change
app.post('/api/admin/profile/email-confirm', authenticateToken, async (req, res) => {
  try {
    const { code } = req.body;
    const { username } = req.user;

    const admin = await prisma.admin.findUnique({ where: { username } });

    if (!admin.verificationCode || admin.verificationCode !== code) {
      return res.status(400).json({ error: 'Código inválido' });
    }

    if (new Date() > admin.verificationCodeExpiresAt) {
      return res.status(400).json({ error: 'El código ha expirado' });
    }

    if (!admin.pendingEmail) {
      return res.status(400).json({ error: 'No hay cambio de correo pendiente' });
    }

    await prisma.admin.update({
      where: { username },
      data: {
        email: admin.pendingEmail,
        pendingEmail: null,
        verificationCode: null,
        verificationCodeExpiresAt: null
      }
    });

    res.json({ message: 'Correo actualizado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al confirmar cambio de correo' });
  }
});

// Export app for Vercel
module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
