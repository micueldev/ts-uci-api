const getBeds = {
  tags: ['bed'],
  description: 'Get all beds',
  operationId: 'getBeds',
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
      name: 'name',
      description: 'Filter for name',
      in: 'query',
      schema: {
        type: 'string',
        example: 'A1',
      },
      required: false,
    },
  ],
  responses: {
    '200': {
      description: 'All beds',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/BedList',
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

const getBed = {
  tags: ['bed'],
  description: 'Get a bed by ID',
  operationId: 'getBed',
  security: [
    {
      BearerAuth: [],
    },
  ],
  parameters: [
    {
      name: 'bed_id',
      description: 'Use /beds/{bed_id} instead',
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
      description: 'The bed',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Bed',
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

const postBed = {
  tags: ['bed'],
  description: 'Create a bed',
  operationId: 'postBed',
  security: [
    {
      BearerAuth: [],
    },
  ],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/NewBed',
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

const putBed = {
  tags: ['bed'],
  description: 'Update an existing bed',
  operationId: 'putBed',
  security: [
    {
      BearerAuth: [],
    },
  ],
  parameters: [
    {
      name: 'bed_id',
      description: 'Use /beds/{bed_id} instead',
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
          $ref: '#/components/schemas/NewBed',
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

const deleteBed = {
  tags: ['bed'],
  description: 'Delete a bed by ID',
  operationId: 'deleteBed',
  security: [
    {
      BearerAuth: [],
    },
  ],
  parameters: [
    {
      name: 'bed_id',
      description: 'Use /beds/{bed_id} instead',
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

const NewBedSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      example: 'A1',
      nullable: false,
    },
    description: {
      type: 'string',
      example: 'bed for not covid',
      nullable: true,
    },
  },
  required: ['name', 'description'],
};

const BedSchema = {
  type: 'object',
  allOf: [
    {
      $ref: '#/components/schemas/NewBed',
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

const BedListSchema = {
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
        $ref: '#/components/schemas/Bed',
      },
    },
  },
  required: ['items'],
};

const examples = {};

export = {
  paths: {
    '/beds/': {
      get: getBeds,
      post: postBed,
    },
    '/beds/{bed_id}': {
      get: getBed,
      put: putBed,
      delete: deleteBed,
    },
  },
  schemas: {
    NewBed: NewBedSchema,
    Bed: BedSchema,
    BedList: BedListSchema,
  },
  examples,
};
