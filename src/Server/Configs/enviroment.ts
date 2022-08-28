const enviroment = {
  port: process.env.PORT || '3000',
  env: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST || 'localhost',
    name: process.env.DB_NAME || 'app',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
  },
};

export = enviroment;
