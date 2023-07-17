import Sequelize from 'sequelize';
import config from './config/config.js';

let sequelize;

if (process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize(config.production);
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    });
} else if (process.env.NODE_ENV === 'staging') {
  sequelize = new Sequelize(config.staging);
} else if (process.env.NODE_ENV === 'test') {
  sequelize = new Sequelize(config.test);
} else {
  sequelize = new Sequelize(config.development);
}

const connection = sequelize;

export default connection;
