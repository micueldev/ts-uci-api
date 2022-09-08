const getPatients = {
  tags: ['person', 'patient'],
  description: 'Get all patients',
  operationId: 'getPatients',
  security: [
    {
      BearerAuth: [],
    },
  ],
  parameters: [
    {
      $ref: '#/components/parameters/Page',
    },
    {
      $ref: '#/components/parameters/Limit',
    },
    {
      $ref: '#/components/parameters/Pagination',
    },
    {
      $ref: '#/components/parameters/Sorting',
    },
    {
      name: 'document_number',
      description: 'Filter for document_number',
      in: 'query',
      schema: {
        type: 'string',
        example: '12345',
      },
      required: false,
    },
    {
      name: 'name',
      description: 'Filter for first_name or last_name',
      in: 'query',
      schema: {
        type: 'string',
        example: 'Juan',
      },
      required: false,
    },
  ],
  responses: {
    '200': {
      description: 'All patients',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/PatientList',
          },
        },
      },
    },
    '401': {
      $ref: '#/components/responses/401',
    },
    '500': {
      $ref: '#/components/responses/500',
    },
  },
};

const getPatient = {
  tags: ['person', 'patient'],
  description: 'Get a patient by ID',
  operationId: 'getPatient',
  security: [
    {
      BearerAuth: [],
    },
  ],
  parameters: [
    {
      name: 'patient_id',
      description: 'Use /patients/{patient_id} instead',
      in: 'path',
      schema: {
        type: 'integer',
        example: 123,
      },
      required: true,
    },
  ],
  responses: {
    '200': {
      description: 'The patient',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Patient',
          },
        },
      },
    },
    '401': {
      $ref: '#/components/responses/401',
    },
    '404': {
      $ref: '#/components/responses/404',
    },
    '500': {
      $ref: '#/components/responses/500',
    },
  },
};

const postPatient = {
  tags: ['person', 'patient'],
  description: 'Create a patient',
  operationId: 'postPatient',
  security: [
    {
      BearerAuth: [],
    },
  ],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/NewPatient',
        },
      },
    },
    required: true,
  },
  responses: {
    '201': {
      $ref: '#/components/responses/201',
    },
    '400': {
      $ref: '#/components/responses/400',
    },
    '401': {
      $ref: '#/components/responses/401',
    },
    '500': {
      $ref: '#/components/responses/500',
    },
  },
};

const putPatient = {
  tags: ['person', 'patient'],
  description: 'Update an existing patient',
  operationId: 'putPatient',
  security: [
    {
      BearerAuth: [],
    },
  ],
  parameters: [
    {
      name: 'patient_id',
      description: 'Use /patients/{patient_id} instead',
      in: 'path',
      schema: {
        type: 'integer',
        example: 123,
      },
      required: true,
    },
  ],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/NewPatient',
        },
      },
    },
    required: true,
  },
  responses: {
    '204': {
      $ref: '#/components/responses/204',
    },
    '400': {
      $ref: '#/components/responses/400',
    },
    '401': {
      $ref: '#/components/responses/401',
    },
    '404': {
      $ref: '#/components/responses/404',
    },
    '500': {
      $ref: '#/components/responses/500',
    },
  },
};

const deletePatient = {
  tags: ['person', 'patient'],
  description: 'Delete a patient by ID',
  operationId: 'deletePatient',
  security: [
    {
      BearerAuth: [],
    },
  ],
  parameters: [
    {
      name: 'patient_id',
      description: 'Use /patients/{patient_id} instead',
      in: 'path',
      schema: {
        type: 'integer',
        example: 123,
      },
      required: true,
    },
  ],
  responses: {
    '204': {
      $ref: '#/components/responses/204',
    },
    '401': {
      $ref: '#/components/responses/401',
    },
    '404': {
      $ref: '#/components/responses/404',
    },
    '500': {
      $ref: '#/components/responses/500',
    },
  },
};

const NewPatientSchema = {
  type: 'object',
  properties: {
    fist_name: {
      type: 'string',
      example: 'Juan',
      nullable: false,
    },
    last_name: {
      type: 'string',
      example: 'Perez',
      nullable: false,
    },
    birth_date: {
      type: 'string',
      format: 'date',
      pattern: 'YYYY-MM-DD',
      example: '2022-04-05',
      nullable: false,
    },
    document_number: {
      type: 'string',
      example: '01234321',
      nullable: false,
    },
    account_number: {
      type: 'string',
      example: '4655656',
      nullable: false,
    },
    weight: {
      type: 'number',
      format: 'float',
      example: 24.5,
      nullable: false,
    },
    start_institute: {
      type: 'string',
      format: 'date',
      pattern: 'YYYY-MM-DD',
      example: '2022-07-07',
      nullable: false,
    },
    start_uci: {
      type: 'string',
      format: 'date',
      pattern: 'YYYY-MM-DD',
      example: '2022-08-08',
      nullable: false,
    },
  },
  required: [
    'fist_name',
    'last_name',
    'birth_date',
    'document_number',
    'account_number',
    'weight',
    'start_institute',
    'start_uci',
  ],
};

const PatientSchema = {
  type: 'object',
  allOf: [
    {
      $ref: '#/components/schemas/NewPatient',
    },
  ],
  properties: {
    id: {
      $ref: '#/components/schemas/Id',
      example: {
        $ref: '#/components/examples/Id',
      },
    },
    created_at: {
      $ref: '#/components/schemas/CreatedAt',
      example: {
        $ref: '#/components/examples/CreatedAt',
      },
    },
    updated_at: {
      $ref: '#/components/schemas/UpdatedAt',
      example: {
        $ref: '#/components/examples/UpdatedAt',
      },
    },
  },
  required: ['id', 'created_at', 'updated_at'],
};

const PatientListSchema = {
  type: 'object',
  allOf: [
    {
      $ref: '#/components/schemas/ListResources',
    },
  ],
  properties: {
    items: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/Patient',
      },
    },
  },
  required: ['items'],
};

const examples = {};

export = {
  paths: {
    '/person/patients/': {
      get: getPatients,
      post: postPatient,
    },
    '/person/patients/{patient_id}': {
      get: getPatient,
      put: putPatient,
      delete: deletePatient,
    },
  },
  schemas: {
    NewPatient: NewPatientSchema,
    Patient: PatientSchema,
    PatientList: PatientListSchema,
  },
  examples,
};
