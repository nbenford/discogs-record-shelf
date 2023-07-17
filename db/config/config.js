module.exports = {
  development: {
    username: 'postgres',
    password: null,
    database: 'discogsshelf',
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
  },
  test: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    ssl: 'true',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  },

  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    use_env_variable: 'DATABASE_URL',
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  },
};
