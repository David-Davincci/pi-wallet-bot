const { DataTypes } = require('sequelize');
const { sequelize } = require('../services/dbService');

const Transaction = sequelize.define('Transaction', {
  walletAddress: { type: DataTypes.STRING, allowNull: false },
  txId: { type: DataTypes.STRING, allowNull: false, unique: true },
  amount: { type: DataTypes.DECIMAL(20, 6), allowNull: false },
  recipient: { type: DataTypes.STRING, allowNull: false },
  memo: { type: DataTypes.TEXT },
  timestamp: { type: DataTypes.DATE, allowNull: false },
  status: { 
    type: DataTypes.ENUM('pending', 'approved', 'rejected'), 
    defaultValue: 'pending' 
  },
  processedAt: { type: DataTypes.DATE }
});

module.exports = Transaction;