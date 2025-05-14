const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Sistem Donor Darah x Sistem Rumah Sakit API',
      version: '1.0.0',
      description: 'API documentation for the Sistem Rumah Sakit dan Sistem Donor Darah',
    },
    servers: [
      {
        url: 'http://localhost:3000', // change this to your API base URL
      },
    ],
    tags: [
        { name: 'Blood Stock', description: 'Blood stock related endpoints' },
        { name: 'Donor', description: 'Donor related endpoints' },
        { name: 'Request', description: 'Blood request endpoints' },
        { name: 'Auth', description: 'Authentication endpoints' }
    ]
  },
  apis: ['./routes/*.js'], // Path to your route files with Swagger comments
};

const specs = swaggerJsdoc(options);
module.exports = specs;
