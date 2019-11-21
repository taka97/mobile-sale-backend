import swaggerJsdoc from 'swagger-jsdoc';
import config from 'config';

const host = process.env.NODE_ENV === 'production' ? config.get('host') : 'localhost:3030';

const swaggerDefinition = {
  info: {
    title: 'Mobile Sale - API',
    version: '1.0.0',
    description: 'API For Mobile Sale',
    contact: {
      email: 'vanhoang0609@gmail.com',
    },
  },
  host,
  basePath: '/api',
  tags: [
    {
      name: 'authentications',
      description: 'Operations for authentication',
    },
    {
      name: 'users',
      description: 'Operations abount User',
    },
    // {
    //   name: 'authmanagement',
    //   description: 'Operataions for auth management',
    // },
  ],
  schemes: [
    'https',
    'http',
  ],
  securityDefinitions: {
    Basic: {
      type: 'basic',
    },
    Bearer: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
    },
  },
};

const options = {
  swaggerDefinition,
  // List of files to be processes. You can also set globs './routes/*.js'
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

export default specs;
