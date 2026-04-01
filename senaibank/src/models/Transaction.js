import { DataTypes } from "sequelize";
import sequelize from "../database/connection.js";
import Account from "./Account.js"; // Importamos para crear la relación

const Transaction = sequelize.define("Transaction", {
  // ID autoincremental automático
  accountId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'accounts', // Nombre de la tabla de destino
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM(
      "DEPOSITO", 
      "SAQUE", 
      "TRANSFERENCIA_ENVIADA", 
      "TRANSFERENCIA_RECEBIDA"
    ),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  }
}, {
  tableName: 'transactions',
  timestamps: true, // Esto nos da la fecha exacta de la transacción (Extrato)
});

// Configuración de la Relación 
Account.hasMany(Transaction, { foreignKey: 'accountId', as: 'transactions' });
Transaction.belongsTo(Account, { foreignKey: 'accountId' });

export default Transaction;