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
      name: 'admin',
      description: 'Operations abount Admin',
    },
    {
      name: 'staff',
      description: 'Operations abount Staff',
    },
    {
      name: 'customer',
      description: 'Operations abount Customer',
    },
    {
      name: 'category',
      description: 'Operations abount Category',
    },
    {
      name: 'product',
      description: 'Operations abount Category',
    },
    {
      name: 'comment',
      description: 'Operations abount Comment',
    },
    {
      name: 'productSeen',
      description: 'Operations abount Product that customer saw',
    },
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
