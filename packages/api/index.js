// server/index.js
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { Resend } = require('resend');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);
const SECRET_KEY = process.env.SECRET_KEY || 'supersecretkey';

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

  const token = jwt.sign({ username: admin.username }, SECRET_KEY, { expiresIn: '1h' });
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
    const serviceList = services.map(s => `- ${s.name}: $${s.price}`).join('\n');
    const total = services.reduce((acc, s) => acc + s.price, 0);

    const { data, error } = await resend.emails.send({
      from: 'Podología Coni <onboarding@resend.dev>',
      to: ['alvarocortesdev@gmail.com'], // Replace with admin email
      subject: `Nueva Cotización de ${name}`,
      text: `Nombre: ${name}\nEmail: ${email}\nTeléfono: ${phone}\n\nServicios Cotizados:\n${serviceList}\n\nTotal Estimado: $${total}`,
    });

    if (error) {
      return res.status(400).json({ error });
    }

    res.json({ message: 'Email sent successfully', data });
  } catch (error) {
    res.status(500).json({ error: 'Error sending email' });
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
