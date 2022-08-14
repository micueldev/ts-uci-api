import { Sequelize } from 'sequelize';

import { db } from '../Server/Configs/enviroment';


const connection: Sequelize = new Sequelize(db.name, db.user, db.password, {
    host: db.host,
    dialect: 'mysql',
    // logging: false,
});


export default connection;
