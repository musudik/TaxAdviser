const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Sample tax forms data
const taxForms = [
  { id: 1, name: 'Income Tax Return', status: 'pending', createdAt: new Date() },
  { id: 2, name: 'VAT Declaration', status: 'completed', createdAt: new Date() },
  { id: 3, name: 'Corporate Tax Return', status: 'in-progress', createdAt: new Date() }
];

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Tax Forms API
app.get('/api/tax-forms', (req, res) => {
  res.json(taxForms);
});

app.get('/api/tax-forms/:id', (req, res) => {
  const form = taxForms.find(form => form.id === parseInt(req.params.id));
  if (!form) return res.status(404).json({ message: 'Form not found' });
  res.json(form);
});

// Auth mock endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    res.json({
      user: {
        id: 1,
        email,
        name: 'Test User',
        role: 'CLIENT'
      },
      token: 'mock-jwt-token'
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
}); 