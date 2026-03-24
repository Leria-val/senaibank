// EDITAR ESTE ARCHIVO ESSA É APENAS UMA BASE
import express, {json} from "express";
import './database/sqlConnection.js'
import algoRouter from "./routes/algoRoutes.js"
import algo2Routesr from "./routes/algo2Routes.js";

import 'dotenv/config'

const PORT = process.env.PORT || 3000;
const app = express();

app.use(json());
app.use('/products', productRouter); 
app.use('/categories', categoryRouter); 
  


app.listen(PORT, () => {
    console.log(`SERVIDOR RODANDO ${PORT}, http://localhost:${PORT}`)
});