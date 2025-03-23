const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const apiRoutes = require('./routes/api');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api', apiRoutes);

// Root route - API documentation
app.get('/', (req, res) => {
  res.json({
    message: 'Firebase Remote Config API Proxy',
    version: '1.0.0',
    endpoints: {
      template: {
        get: { method: 'GET', url: '/api/template', description: 'Get the entire Remote Config template' },
        update: { method: 'PUT', url: '/api/template', description: 'Update the Remote Config template' }
      },
      parameters: {
        list: { method: 'GET', url: '/api/parameters', description: 'List all parameters' },
        get: { method: 'GET', url: '/api/parameters/:name', description: 'Get a specific parameter by name' },
        update: { method: 'PUT', url: '/api/parameters/:name', description: 'Update a specific parameter' },
        delete: { method: 'DELETE', url: '/api/parameters/:name', description: 'Delete a specific parameter' }
      },
      metadata: {
        get: { method: 'GET', url: '/api/metadata', description: 'Get template metadata (version, etag, updateTime)' }
      },
      versions: {
        list: { method: 'GET', url: '/api/versions', description: 'List recent versions' },
        get: { method: 'GET', url: '/api/versions/:version', description: 'Get a specific version' },
        rollback: { method: 'POST', url: '/api/rollback/:version', description: 'Rollback to a specific version' }
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Firebase Remote Config API Proxy running on http://localhost:${PORT}`);
  console.log(`API documentation available at http://localhost:${PORT}`);
});