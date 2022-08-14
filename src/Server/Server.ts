import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';
import swagger from 'swagger-ui-express'

import db from '../DB/connection';
import { port, env } from './Configs/enviroment';
import authRoutes from '../Http/Routes/auth';
import userRoutes from '../Http/Routes/user';
import bedRoutes from '../Http/Routes/bed';
import handleError from '../Http/Middlewares/handleError';
import openApiV1 from '../api-docs/openApiV1';

class Server
{
    private app: Application;
    private port: string;
    private apiV1Paths = {
        auth: '/api/v1/auth',
        users: '/api/v1/users',
        beds: '/api/v1/beds'
    }

    constructor() {
        this.app = express();
        this.port = port;

        this.dbConnection();
        this.beforeMiddlewares();
        this.routes();
        this.afterMiddlewares();
    }

    async dbConnection() {
        try {
            await db.authenticate();
            console.log('Database online');
            
            if(env !== 'production'){
                // await sequelize.drop();
                // await db.sync({ alter: true });
            }

        } catch (error: any) {
            throw new Error( error );
        }
    }

    beforeMiddlewares() {
        this.app.use( cors() );
        this.app.use( express.json() );
        this.app.use('/api-docs/v1', swagger.serve, swagger.setup(openApiV1));
        this.app.use( express.static(path.resolve(__dirname, '../../public')) );
    }

    routes() {
        this.app.use( this.apiV1Paths.auth, authRoutes );
        this.app.use( this.apiV1Paths.users, userRoutes );
        this.app.use( this.apiV1Paths.beds, bedRoutes );
    }

    afterMiddlewares() {
        this.app.use( handleError );
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log(`Server running in port ${this.port}`);
        });   
    }
}


export default Server;
