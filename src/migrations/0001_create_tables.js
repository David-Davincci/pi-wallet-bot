const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('Wallets', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      walletAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });

    await queryInterface.createTable('Transactions', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      walletAddress: {
        type: DataTypes.STRING,
        allowNull: false
      },
      txId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      amount: {
        type: DataTypes.DECIMAL(20, 6),
        allowNull: false
      },
      recipient: {
        type: DataTypes.STRING,
        allowNull: false
      },
      memo: {
        type: DataTypes.TEXT
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
      },
      processedAt: {
        type: DataTypes.DATE
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });

    await queryInterface.addIndex('Transactions', ['walletAddress']);
    await queryInterface.addIndex('Transactions', ['status']);
    await queryInterface.addIndex('Transactions', ['timestamp']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Transactions');
    await queryInterface.dropTable('Wallets');
  }
};