import { DataTypes } from "sequelize";
import sequelize from "../database/connection.js";

const Account = sequelize.define("Account", {
  // El ID se crea automáticamente como PRIMARY KEY e INCREMENTAL
  nome_usuario: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Importante para que no haya dos cuentas iguales
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  saldo: {
    type: DataTypes.DECIMAL(10, 2), // Permite dos decimales para el dinero
    allowNull: false,
    defaultValue: 0,
  },
}, {
  // Opciones adicionales
  tableName: 'accounts', // Nombre de la tabla en la DB
  timestamps: true,      // Crea automaticamente 'createdAt' y 'updatedAt'
});

export default Account;