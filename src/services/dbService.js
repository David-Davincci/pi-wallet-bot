// src/services/dbService.js
const { Sequelize } = require('sequelize');

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not defined');
}

const sequelize = new Sequelize(process.env.POSTGRES_URL, {
  dialect: 'postgres',
  logging: console.log,
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  }
});

const initializeDb = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('Database connection established successfully');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, initializeDb };