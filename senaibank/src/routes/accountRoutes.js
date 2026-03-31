// Rotas de gerenciamento de conta
import express from "express";
import accountController from "../controllers/AccountController.js";
import validateAccount from "../middlewares/validateAccount.js";

const accountRoutes = express.Router();

accountRoutes.get('/', accountController.getAll)
accountRoutes.post('/', accountController.create)
accountRoutes.put('/:id', accountController.update)
accountRoutes.delete('/:id', accountController.delete)

export default accountRoutes;