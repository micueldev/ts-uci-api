import dotenv from 'dotenv';
dotenv.config();

import Server from './Server/Server';

const server = new Server();

server.listen();
