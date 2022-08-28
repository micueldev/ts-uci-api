const schemas = {
  Id: {
    type: 'integer',
    description: 'id',
    example: {
      $ref: '#/components/examples/Id',
    },
  },
  CreatedAt: {
    type: 'string',
    description: 'date it was created',
    example: {
      $ref: '#/components/examples/CreatedAt',
    },
  },
  UpdatedAt: {
    type: 'string',
    description: 'last date it was modified',
    example: {
      $ref: '#/components/examples/UpdatedAt',
    },
  },
  Params: {
    type: 'object',
    description: 'filter for field',
    properties: {
      field: {
        type: 'string',
        default: 'value',
      },
    },
  },
  Paginated: {
    type: 'object',
    properties: {
      page: {
        type: 'integer',
        default: 1,
      },
      limit: {
        type: 'integer',
        default: 10,
      },
      pages: {
        type: 'integer',
        example: 14,
      },
      total: {
        type: 'integer',
        example: 132,
      },
    },
    required: ['page', 'limit', 'pages', 'total'],
    examples: {
      $ref: '#/components/examples/Paginated',
    },
  },
  ListResources: {
    type: 'object',
    allOf: [
      {
        $ref: '#/components/schemas/Paginated',
      },
    ],
    properties: {
      params: {
        $ref: '#/components/schemas/Params',
      },
    },
    required: ['params'],
  },
};

const parameters = {
  Page: {
    name: 'page',
    in: 'query',
    schema: {
      type: 'number',
      default: 0,
    },
    required: false,
  },
  Limit: {
    name: 'limit',
    in: 'query',
    schema: {
      type: 'number',
      default: 10,
    },
    required: false,
  },
  Pagination: {
    name: 'pagination',
    description: 'Do not use page and limit {page}:{limit}',
    in: 'query',
    schema: {
      type: 'string',
      example: '1:20',
    },
    required: false,
  },
  Sorting: {
    name: 'sorting',
    description: 'Sort by a field {field}:{order}',
    in: 'query',
    schema: {
      type: 'string',
      default: 'id:asc',
      example: 'created_at:desc',
    },
    required: false,
  },
};

const examples = {
  Id: 123,
  CreatedAt: '2022-07-06 15:00:00',
  UpdatedAt: '2022-08-01 18:00:00',
  Paginated: {
    page: 2,
    limit: 20,
    pages: 7,
    total: 132,
  },
};

const responses = {
  '201': {
    description: 'Created',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            id: {
              $ref: '#/components/schemas/Id',
            },
          },
          required: ['id'],
        },
      },
    },
  },
  '204': {
    description: 'No Content',
  },
  '400': {
    description: 'Bad Request',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Resource duplicate or dependency invalid',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  value: {
                    type: 'string',
                    example: 'email.com',
                  },
                  msg: {
                    type: 'string',
                    example: 'The email is invalid',
                  },
                  param: {
                    type: 'string',
                    example: 'email',
                  },
                  location: {
                    type: 'string',
                    example: 'body',
                  },
                },
                required: ['value', 'msg', 'param', 'location'],
              },
            },
          },
          required: ['message'],
        },
      },
    },
  },
  '401': {
    description: 'Unauthorized',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Token invalid',
            },
          },
          required: ['message'],
        },
      },
    },
  },
  '404': {
    description: 'Not Found',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Resource not found',
            },
          },
          required: ['message'],
        },
      },
    },
  },
  '500': {
    description: 'Internal Server Error',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Unknown error',
            },
          },
          required: ['message'],
        },
      },
    },
  },
};

export = {
  schemas,
  parameters,
  examples,
  responses,
};
