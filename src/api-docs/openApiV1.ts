import { port } from '@/Server/Configs/enviroment';
import base from '@/api-docs/v1/base';
import auth from '@/api-docs/v1/auth';
import user from '@/api-docs/v1/user';
import bed from '@/api-docs/v1/bed';
import patient from '@/api-docs/v1/person/patient';

const openApiV1 = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'UCI',
    description: 'Api v1',
    termsOfService: 'http://api_url/terms/',
    contact: {
      name: 'UCI',
      email: 'uci@email.com',
      url: 'https://uci.com/',
    },
    license: {
      name: 'Apache 2.0',
      url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
    },
  },
  servers: [
    {
      url: `http://localhost:${port}/api/v1`,
      description: 'Local server',
    },
    {
      url: 'https://api_url_production',
      description: 'Production server',
    },
  ],
  security: [
    {
      BearerAuth: [],
    },
  ],
  tags: [
    {
      name: 'auth',
    },
    {
      name: 'user',
    },
    {
      name: 'bed',
    },
    {
      name: 'person',
    },
    {
      name: 'patient',
    },
  ],
  paths: {
    ...auth.paths,
    ...user.paths,
    ...bed.paths,
    ...patient.paths,
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      ...base.schemas,
      ...auth.schemas,
      ...user.schemas,
      ...bed.schemas,
      ...patient.schemas,
    },
    examples: {
      ...base.examples,
      ...auth.examples,
      ...user.examples,
      ...bed.examples,
      ...patient.examples,
    },
    parameters: {
      ...base.parameters,
    },
    responses: {
      ...base.responses,
    },
  },
};

export default openApiV1;
