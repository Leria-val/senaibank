// accountRoutes.js - MEJORADO
import express from "express";
import accountController from "../controllers/AccountController.js";
import validateAccount from "../middlewares/validateAccount.js";

const accountRoutes = express.Router();

accountRoutes.post("/login", accountController.login);

accountRoutes.get('/', accountController.getAll);
accountRoutes.post('/', validateAccount, accountController.create); 
accountRoutes.put('/:id', validateAccount, accountController.update);
accountRoutes.delete('/:id', accountController.delete);

export default accountRoutes;