import express from "express";
import operationController from "../controllers/OperationController.js";
import validateOperation from "../middlewares/validateOperation.js";

const operationRoutes = express.Router();

operationRoutes.post('/depositar', validateOperation, operationController.depositar);
operationRoutes.post('/sacar', validateOperation, operationController.sacar);
operationRoutes.post('/transferir', validateOperation, operationController.transferir);
operationRoutes.get('/statement/:id', operationController.getStatement);

export default operationRoutes;