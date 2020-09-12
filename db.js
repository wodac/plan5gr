const { Sequelize } = require('sequelize');
const config = require('./dbConfig');

const dbConnection = new Sequelize({
  ...config,
  dialect: 'mysql'
});

module.exports = dbConnection;