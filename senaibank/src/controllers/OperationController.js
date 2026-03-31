// Sacar, depositar, transferir

import Account from "../models/Account.js";
import Transaction from "../models/Transaction.js";
import sequelize from "../database/connection.js";


const operationController = {

  depositar: async (req, res) => {
        const t = await sequelize.transaction()
        try {
            const {accountNumber, amount } = req.body;

            const account = await Account.findOne({
                where: {number: accountNumber}
            });

            if (!account) {
                return res.status(404).json({
                    succes: false,
                    message:"conta não encontrada"
                });
            }
//Atualizar saldo

            await account.update
            ({balance: account.balance + amount} , {transaction: t});
            
            //Registrar no extrato
            await Transaction.create({
            accountId: account.id,
            type: "DEPOSITAR",
            amount: amount,
            }, {transaction: t})
            await t.commit();

            return res.status(200).json
            ({
                success: true,
                data: account,
                message: "deposito realizado com sucesso",
            });
        } catch (error) {
        await t.rollback();
      return res.status(500).json({
        success: false,
        message: "Erro ao realizar deposito",
        error: error.message,
      });
    }
  },


//SACAR DINHEIRO 
  
  sacar: async (req, res) => {
    const t = await sequelize.transaction()
        try {
            const {accountNumber, amount } = req.body;

            const account = await Account.findOne({
                where: {number: accountNumber}
            });

            if (!account || account.balance < amount) {
                return res.status(400).json({
                    succes: false,
                    message:"saldo insuficiente ou conta não inexistente"
                });
            }
//Atualizar
            await account.update
            ({balance: account.balance = amount} , {transaction: t});
            
//Registrar
            await Transaction.create({
            accountId: account.id,
            type: "SACAR",
            amount: -amount,
            }, {transaction: t})
            await t.commit();

            return res.status(200).json
            ({
                success: true,
                data: account,
                message: "saque realizado com sucesso",
            });
        } catch (error) {
        await t.rollback();
            return res.status(500).json({
            success: false,
            message: "Erro ao realizar saque",
            error: error.message,
      });
    }
  },

//TRANSFERIR
  
  transferir: async (req, res) => {
    const t = await sequelize.transaction()
        try {
            const {fromNumber, toNumber, amount } = req.body;

            const sourceAccount = await Account.findOne({
                where: {number: fromNumberNumber} });
            const targetAccount = await Account.findOne({
                where: {number: toNumber}
            });

            if (!sourceAccount || !targetAccount) {
                return res.status(400).json({
                    success: false,
                    message:"UMA OU AMBAS CONTAS NÃO FORAM ENCONTRADAS"
                });
            }
            if (sourceAccount.balance < amount) {
                return res.status(400).json({
                    success: false,
                    message:"saldo insuficiente PARA TRANSFERENCIA"
                });
            }
            
//Operação saída e entrada
        await sourceAccount.update({
            balance: sourceAccount.balance - amount},
            {transaction: t});
            await targetAccount.update({
            balance: targetAccount.balance + amount},
            {transaction: t});


        await Transaction.bulkCreate([
            {accountId: sourceAccount.id, type : "TRANSFERIR_OUT", amount: -amount },
            {accountId: targetAccount.id, type: "TRANSFERIR_IN", amount: amount},
        ], {transaction: t});

            await t.commit();

            return res.status(200).json
            ({
                success: true,
                message: "transferencia realizada com sucesso",
            });
        } catch (error) {
        await t.rollback();
      return res.status(500).json({
        success: false,
        message: "Erro ao realizar tranferencia",
        error: error.message,
      });
    }
  },

  //CPONSULTAR SALDO E EXTRATO

  getStatement: async (req, res) => {
    try{
        const {id} = req.params;

        const account = await Account.findByPk(id, {
            include: {
                model: Transaction,
                as: "transactions",
            },
        });

        if (!account) {
                return res.status(404).json({
                    succes: false,
                    message:"conta não encontrada",
                });
            }
            return res.status(200).json
            ({
                success: true,
                data: { balance: account.balance,
                        statement: account.transactions
                },
                message: "extrato gerado com sucesso",
            });
        } 
        catch (error) {
        return res.status(500).json({
        success: false,
        message: "Erro ao buscar extrato",
        error: error.message,
      });
    }
  },
}


export default operationController;