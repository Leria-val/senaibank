import Account from "../models/Account.js";
import Transaction from "../models/Transaction.js";
import sequelize from "../database/connection.js";

const operationController = {
  depositar: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { accountNumber, amount } = req.body;
      if (amount <= 0) throw new Error("O valor do depósito deve ser positivo");

      const account = await Account.findOne({ where: { id: accountNumber } });
      if (!account) {
        await t.rollback();
        return res.status(404).json({ success: false, message: "Conta não encontrada" });
      }

      await account.update({ saldo: Number(account.saldo) + Number(amount) }, { transaction: t });

      await Transaction.create({
        accountId: account.id,
        type: "DEPOSITO",
        amount: amount,
      }, { transaction: t });

      await t.commit();
      return res.status(200).json({ success: true, message: "Depósito realizado" });
    } catch (error) {
      await t.rollback();
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  sacar: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { accountNumber, amount } = req.body;
      const account = await Account.findOne({ where: { id: accountNumber } });

      if (!account || account.saldo < amount) {
        await t.rollback();
        return res.status(400).json({ success: false, message: "Saldo insuficiente ou conta inexistente" });
      }

      await account.update({ saldo: account.saldo - amount }, { transaction: t });

      await Transaction.create({
        accountId: account.id,
        type: "SAQUE",
        amount: -amount,
      }, { transaction: t });

      await t.commit();
      return res.status(200).json({ success: true, message: "Saque realizado" });
    } catch (error) {
      await t.rollback();
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  transferir: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { fromId, toId, amount } = req.body;
      const source = await Account.findByPk(fromId);
      const target = await Account.findByPk(toId);

      if (!source || !target) {
        await t.rollback();
        return res.status(404).json({ success: false, message: "Contas não encontradas" });
      }

      if (source.saldo < amount) {
        await t.rollback();
        return res.status(400).json({ success: false, message: "Saldo insuficiente" });
      }

      await source.update({ saldo: source.saldo - amount }, { transaction: t });
      await target.update({ saldo: Number(target.saldo) + Number(amount) }, { transaction: t });

      await Transaction.bulkCreate([
        { accountId: source.id, type: "TRANSFERENCIA_ENVIADA", amount: -amount },
        { accountId: target.id, type: "TRANSFERENCIA_RECEBIDA", amount: amount },
      ], { transaction: t });

      await t.commit();
      return res.status(200).json({ success: true, message: "Transferência concluída" });
    } catch (error) {
      await t.rollback();
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  // --- ¡AQUÍ ESTÁ LA FUNCIÓN RECUPERADA! ---
  getStatement: async (req, res) => {
    try {
      const { id } = req.params;

      // Buscamos la cuenta e incluimos sus transacciones
      const account = await Account.findByPk(id, {
        include: {
          model: Transaction,
          as: "transactions", // Debe coincidir con el 'as' definido en el modelo
        },
      });

      if (!account) {
        return res.status(404).json({ success: false, message: "Conta não encontrada" });
      }

      return res.status(200).json({
        success: true,
        data: {
          nome: account.nome_usuario,
          saldo_atual: account.saldo,
          extrato: account.transactions,
        },
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },
};

export default operationController;