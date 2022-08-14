
const login = {
    tags: ['auth'],
    description: 'Login with username and password',
    operationId: 'login',
    security: [],
    requestBody: {
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/Login'
                }
            }
        },
        required: true
    },
    responses: {
        '200': {
            description: 'The user',
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/Auth'
                    }
                }
            }
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

const LoginComponent = {
    type: 'object',
    properties: {
        username: {
            type: 'string',
            example: 'jperez',
            nullable: false
        },
        password: {
            type: 'string',
            example: '123456',
            nullable: false
        }

    },
    required: [
        'username',
        'password'
    ]
}

const AuthComponent = {
    type: 'object',
    properties: {
        id: {
            $ref: '#/components/schemas/Id',
            example: {
                $ref: '#/components/examples/Id',
            }
        },
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
        },
        token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI.eyJpZCI6MiwiaWzg1NDcyfQ.GfJZQCO4kiTwsWSJXGPTWFqmcD3',
            nullable: false
        }
    },
    required: [
        'id',
        'username',
        'fist_name',
        'last_name',
        'email'
    ]
}

const examples = {
}


export = {
    paths: {
        '/auth/login': {
            post: login
        }
    },
    components: {
        Login: LoginComponent,
        Auth: AuthComponent
    },
    examples
}
