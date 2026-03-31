// ARQUIVO BASE -- Rotas de gerenciamento de conta



import express from "express";
import algoController from "../controllers/algoController.js";

const algoRouter = express.Router();

algoRouter.get('/', algoController.getAll)
algoRouter.get('/:id', algoController.getById)
algoRouter.post('/', algoController.create)
algoRouter.put('/:id', algoController.update)
algoRouter.delete('/:id', algoController.delete)

export default algoRouter;