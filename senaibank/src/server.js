import 'dotenv/config'; 
import express from "express";
import sequelize, { connect } from "./database/connection.js"; 
import "./models/Account.js";
import "./models/Transaction.js";
import accountRoutes from "./routes/accountRoutes.js";
import operationRoutes from "./routes/operationRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Endpoints
app.use('/accounts', accountRoutes); 
app.use('/operations', operationRoutes); 

const startServer = async () => {
  try {
    await connect(); 

    await sequelize.sync({ force: false }); 
    console.log("Tabelas sincronizadas com sucesso.");

    app.listen(PORT, () => {
      console.log(`SERVIDOR RODANDO EM: http://localhost:${PORT}`);
    });
    
  } catch (error) {
    console.error("Erro crítico ao iniciar o servidor:", error.message);
  }
};

startServer();

