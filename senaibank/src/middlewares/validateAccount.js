const Account = require('../models/Account');

async function validateAccount(req, res, next) {
    const{ nome, cpf, balance } = req.body; 

    if(!nome || !cpf || balance === undefined) {
        return res.status(400).json({
            error: 'Campos obrigatorios nao preenchidos'
        });
    }

    try{
        const existingAccount = await
Account.findOne({ cpf});

        if (existingAccount) {
            return res.status(400).json({
                error: ' CPF ja cadastrado'
            });
        }

        next();
    } catch (err) {
        return res.status(500).json({
            error: 'Erro interno no servidor'
        });
    }
}

module.exports = validateAccount;