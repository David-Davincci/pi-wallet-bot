const { DataTypes } = require('sequelize');
const { sequelize } = require('../services/dbService');

const Wallet = sequelize.define('Wallet', {
  userId: { type: DataTypes.BIGINT, allowNull: false },
  walletAddress: { type: DataTypes.STRING, allowNull: false, unique: true },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = Wallet;