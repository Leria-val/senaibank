// arquivo para inicializañ{ao do server}

import 'dotenv/config'; // Carga variables de entorno (.env)
import express from "express";
import sequelize from "./database/connection.js";

// Importación de Modelos para asegurar que las relaciones se carguen
import "./models/Account.js";
import "./models/Transaction.js";

// Importación de Rutas
import accountRoutes from "./routes/accountRoutes.js";
import operationRoutes from "./routes/operationRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares Globales
app.use(express.json());

// Definición de Rutas (Endpoints)
app.use('/accounts', accountRoutes); 
app.use('/operations', operationRoutes); 

// Conexión a la Base de Datos y Encendido del Servidor
const startServer = async () => {
  try {
    // sync() crea las tablas si no existen según tus modelos
    // En producción se recomienda usar Migrations, pero para desarrollo esto es ideal.
    await sequelize.sync({ force: false }); 
    console.log("✅ Conexão com o banco de datos estabelecida.");

    app.listen(PORT, () => {
      console.log(`🚀 SERVIDOR RODANDO NA PORTA ${PORT}`);
      console.log(`🔗 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Erro ao conectar com o banco de datos:", error.message);
  }
};

startServer();