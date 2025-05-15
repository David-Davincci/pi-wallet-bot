const { DataTypes } = require('sequelize');
const { sequelize } = require('../services/dbService');
const { TRANSACTION_STATUS } = require('../utils/constants');

const Transaction = sequelize.define('Transaction', {
  walletAddress: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isPiWalletAddress(value) {
        if (!value.startsWith('G') || value.length !== 56) {
          throw new Error('Invalid Pi wallet address format');
        }
      }
    }
  },
  txId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  amount: {
    type: DataTypes.DECIMAL(20, 6),
    allowNull: false,
    validate: {
      isDecimal: true,
      min: 0.000001
    }
  },
  recipient: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isPiWalletAddress(value) {
        if (!value.startsWith('G') || value.length !== 56) {
          throw new Error('Invalid Pi wallet address format');
        }
      }
    }
  },
  memo: {
    type: DataTypes.TEXT,
    validate: {
      len: [0, 500]
    }
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true
    }
  },
  status: {
    type: DataTypes.ENUM(...Object.values(TRANSACTION_STATUS)),
    defaultValue: TRANSACTION_STATUS.PENDING,
    validate: {
      isIn: [Object.values(TRANSACTION_STATUS)]
    }
  },
  processedAt: {
    type: DataTypes.DATE,
    validate: {
      isDate: true
    }
  }
}, {
  indexes: [
    {
      fields: ['walletAddress']
    },
    {
      fields: ['status']
    },
    {
      fields: ['timestamp']
    }
  ],
  hooks: {
    beforeCreate: (transaction) => {
      if (transaction.processedAt && transaction.status === TRANSACTION_STATUS.PENDING) {
        throw new Error('Pending transaction cannot have processedAt date');
      }
    },
    beforeUpdate: (transaction) => {
      if (transaction.changed('status') && 
          transaction.status !== TRANSACTION_STATUS.PENDING && 
          !transaction.processedAt) {
        transaction.processedAt = new Date();
      }
    }
  }
});

// Class methods
Transaction.findByTxId = async function(txId) {
  return this.findOne({ where: { txId } });
};

Transaction.findPendingByWallet = async function(walletAddress) {
  return this.findAll({ 
    where: { 
      walletAddress, 
      status: TRANSACTION_STATUS.PENDING 
    },
    order: [['timestamp', 'DESC']]
  });
};

// Instance methods
Transaction.prototype.approve = async function() {
  if (this.status !== TRANSACTION_STATUS.PENDING) {
    throw new Error('Only pending transactions can be approved');
  }
  this.status = TRANSACTION_STATUS.APPROVED;
  this.processedAt = new Date();
  return this.save();
};

Transaction.prototype.reject = async function() {
  if (this.status !== TRANSACTION_STATUS.PENDING) {
    throw new Error('Only pending transactions can be rejected');
  }
  this.status = TRANSACTION_STATUS.REJECTED;
  this.processedAt = new Date();
  return this.save();
};

module.exports = Transaction;