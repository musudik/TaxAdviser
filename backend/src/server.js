const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Enable middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Set up API prefix
app.use('/api', (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Sample data
const taxForms = [
  {
    id: '1',
    applicationId: 'TAX-2023-001',
    userId: 'user123',
    status: 'submitted',
    submissionYear: '2023',
    taxYear: { year: '2023' },
    submittedAt: new Date().toISOString()
  },
  {
    id: '2',
    applicationId: 'TAX-2023-002',
    userId: 'user123',
    status: 'pending',
    submissionYear: '2023',
    taxYear: { year: '2023' },
    submittedAt: new Date().toISOString()
  }
];

// Mock API routes
app.get('/api/tax-forms', (req, res) => {
  res.json(taxForms);
});

app.get('/api/tax-forms/:id', (req, res) => {
  const form = taxForms.find(f => f.id === req.params.id);
  if (!form) return res.status(404).json({ message: 'Form not found' });
  res.json(form);
});

app.post('/api/tax-forms', (req, res) => {
  const newForm = {
    id: String(taxForms.length + 1),
    applicationId: `TAX-${Date.now()}`,
    ...req.body,
    submittedAt: new Date().toISOString()
  };
  taxForms.push(newForm);
  res.status(201).json(newForm);
});

app.get('/api/tax-forms/user/:userId', (req, res) => {
  const userForms = taxForms.filter(f => f.userId === req.params.userId);
  res.json(userForms);
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Express mock server running at http://localhost:${PORT}/api`);
  console.log('Press CTRL+C to stop');
}); 