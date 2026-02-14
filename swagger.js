const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
  openapi: '3.0.0',   // 🔥 REQUIRED
  info: {
    title: 'RailwayTrackAPI',
    description: 'Production Grade Railway Track API with JWT',
    version: '1.0.0'
  },
  servers: [
    {
      url: 'http://localhost:5000'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [{
    bearerAuth: []
  }]
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
