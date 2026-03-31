// Rotas de operações bancárias
import express from "express";
import operationController from "../controllers/OperationController.js";
import validateOperation from "../middlewares/validateOperation.js";

const operationRoutes = express.Router();

operationRoutes.post('/depositar', operationController.depositar)
operationRoutes.post('/:sacar', operationController.sacar)
operationRoutes.post('/transferir', validateOperation, operationController.transferir)
operationRoutes.get('statement','/:id', operationController.getStatement) //rota de consultas

export default operationRoutes;