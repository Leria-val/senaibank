import Account from "../models/Account.js";

async function validateOperation(req, res, next) {
    const { accountId, amout, type } =
    req.body;

    if (!accountId || !amout || !typpe) {
        return res.status(400).json({
             error: "Campos obrigatorios nao preenchidos"
        });
    }

    if (amout <= 0) {
        return res.status(400).json({
            error: "O valor deve ser maior que zero"
        });
    }

    try {
        const account = await
Account.findById(accountId);
        
        if (!account) {
            return res.status(404).json({
                error: "Conta nao encontradada"
            });
        }

    const validTypes = ["deposit","withdraw"];
    
    if (!validTypes.includes(type)) {
        return res.status(400).json({
            error: "Tipo de operacao invalido"
        });                
    }

    if (type === "withdraw" && account.balnce < amout) {
        return res.status(400).json({
            error: "Saldo insuficiente"
        });
    }

    req.account = account;

    next();
} catch (err) {
    return res.status(500).json({
        error: "Erro interno no servidor"
     });
   }
}

export default validateOperation;