// ARQUIVO BASE -- Rotas de gerenciamento de conta



import express from "express";
import accountController from "../controllers/AccountControllers.js";
import validateAccount from "../middlewares/validateAccount.js";

const accountRouter = express.Router();

accountRouter.get('/', accountController.getAll)
accountRouter.get('/:id', accountController.getById)
accountRouter.post('/', validateAccount, accountController.create)
accountRouter.put('/:id', accountController.update)
accountRouter.delete('/:id', accountController.delete)

export default accountRouter;