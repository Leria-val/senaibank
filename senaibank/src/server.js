// EDITAR ESTE ARCHIVO ESSA É APENAS UMA BASE

// arquivo para inicializañ{ao do server}

import express, {json} from "express";
import './database/connection.js'
import operationRoutes from "./routes/operationRoutes.js"
import accountRoutes from "./routes/accountRoutes.js";

import 'dotenv/config'

const PORT = process.env.PORT || 3000;
const app = express();

app.use(json());
app.use('/accounts', accountRoutes); 
app.use('/operations', operationRoutes); 
  


app.listen(PORT, () => {
    console.log(`SERVIDOR RODANDO ${PORT}, http://localhost:${PORT}`)
});