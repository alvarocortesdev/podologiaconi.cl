// index.js
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { Resend } = require('resend');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());

// Routes
// Get all services
app.get('/api/services', async (req, res) => {
  try {
    const services = await prisma.service.findMany();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching services' });
  }
});

// Create a service (Admin only - middleware to be added)
app.post('/api/services', async (req, res) => {
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

// Delete a service
app.delete('/api/services/:id', async (req, res) => {
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
