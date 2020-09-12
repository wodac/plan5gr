import { Sequelize } from 'sequelize';
const config = require('../dbConfig.js');

const dbConnection = new Sequelize({
  ...config,
  dialect: 'mysql'
});

export default dbConnection;