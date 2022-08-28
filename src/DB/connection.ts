import { Sequelize } from 'sequelize';

import { db, env } from '@/Server/Configs/enviroment';

const connection: Sequelize =
  env !== 'test'
    ? new Sequelize(db.name, db.user, db.password, {
        host: db.host,
        dialect: 'mysql',
        logging: env === 'development' ? console.log : false,
      })
    : new Sequelize('sqlite::memory:', {
        logging: false,
      });

export default connection;
