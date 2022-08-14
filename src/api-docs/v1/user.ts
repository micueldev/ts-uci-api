
const getUsers = {
    tags: ['user'],
    description: 'Get all users',
    operationId: 'getUsers',
    security: [
        {
            BearerAuth: []
        }
    ],
    parameters: [
        {
            $ref: '#/components/parameters/Page'
        },
        {
            $ref: '#/components/parameters/Limit'
        },
        {
            $ref: '#/components/parameters/Pagination'
        },
        {
            $ref: '#/components/parameters/Sorting'
        },
        {
            name: 'username',
            description: 'Filter for username',
            in: 'query',
            schema: {
                type: 'string',
                example: 'jperez'
            },
            required: false
        },
        {
            name: 'email',
            description: 'Filter for email',
            in: 'query',
            schema: {
                type: 'string',
                example: 'jperez@email.com'
            },
            required: false
        }
    ],
    responses: {
        '200': {
            description: 'All users',
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/UserList'
                    }
                }
            }
        },
        '401': {
            $ref: "#/components/responses/401"
        },
        '500': {
            $ref: "#/components/responses/500"
        }
    }
}

const getUser = {
    tags: ['user'],
    description: 'Get a user by ID',
    operationId: 'getUser',
    security: [
        {
            BearerAuth: []
        }
    ],
    parameters: [
        {
            name: 'user_id',
            description: 'Use /users/{user_id} instead',
            in: 'path',
            schema: {
                type: 'integer',
                example: 123
            },
            required: true
        }
    ],
    responses: {
        '200': {
            description: 'The user',
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/User'
                    }
                }
            }
        },
        '401': {
            $ref: "#/components/responses/401"
        },
        '404': {
            $ref: "#/components/responses/404"
        },
        '500': {
            $ref: "#/components/responses/500"
        }
    }
}

const postUser = {
    tags: ['user'],
    description: 'Create a user',
    operationId: 'postUser',
    security: [
        {
            BearerAuth: []
        }
    ],
    requestBody: {
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/NewUser'
                }
            }
        },
        required: true
    },
    responses: {
        '201': {
            $ref: "#/components/responses/201"
        },
        '400': {
            $ref: "#/components/responses/400"
        },
        '401': {
            $ref: "#/components/responses/401"
        },
        '500': {
            $ref: "#/components/responses/500"
        },
    }
}

const putUser = {
    tags: ['user'],
    description: 'Update an existing user',
    operationId: 'putUser',
    security: [
        {
            BearerAuth: []
        }
    ],
    requestBody: {
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/EditUser'
                }
            }
        },
        required: true
    },
    responses: {
        '204': {
            $ref: "#/components/responses/204"
        },
        '400': {
            $ref: "#/components/responses/400"
        },
        '401': {
            $ref: "#/components/responses/401"
        },
        '404': {
            $ref: "#/components/responses/404"
        },
        '500': {
            $ref: "#/components/responses/500"
        },
    }
}

const EditUserComponent = {
    type: 'object',
    properties: {
        username: {
            type: 'string',
            example: 'jperez',
            nullable: false
        },
        fist_name: {
            type: 'string',
            example: 'Juan',
            nullable: false
        },
        last_name: {
            type: 'string',
            example: 'Perez',
            nullable: false
        },
        email: {
            type: 'string',
            example: 'jperez@email.com',
            nullable: false
        }
    },
    required: [
        'username',
        'fist_name',
        'last_name',
        'email'
    ]
}

const NewUserComponent = {
    type: 'object',
    allOf: [
        {
            $ref: '#/components/schemas/EditUser'
        }
    ],
    properties: {
        password: {
            type: 'string',
            example: '1234567',
            nullable: false
        }
    },
    required: [
        'password'
    ]
}

const UserComponent = {
    type: 'object',
    allOf: [
        {
            $ref: '#/components/schemas/EditUser'
        }
    ],
    properties: {
        id: {
            $ref: '#/components/schemas/Id',
            example: {
                $ref: '#/components/examples/Id',
            }
        },
        created_at: {
            $ref: '#/components/schemas/CreatedAt',
            example: {
                $ref: '#/components/examples/CreatedAt',
            }
        },
        updated_at: {
            $ref: '#/components/schemas/UpdatedAt',
            example: {
                $ref: '#/components/examples/UpdatedAt',
            }
        }
    },
    required: [
        'id',
        'created_at',
        'updated_at'
    ]
}

const UserListComponent = {
    type: 'object',
    allOf: [
        {
            $ref: '#/components/schemas/ListResources'
        }
    ],
    properties: {
        items: {
            type: 'array',
            items: {
                $ref: '#/components/schemas/User'
            }
        }
    },
    required: ['items']
}

const examples = {
}


export = {
    paths: {
        '/users/': {
            get: getUsers,
            post: postUser
        },
        '/users/{user_id}': {
            get: getUser,
            put: putUser
        },
    },
    components: {
        EditUser: EditUserComponent,
        NewUser: NewUserComponent,
        User: UserComponent,
        UserList: UserListComponent,
    },
    examples
}
