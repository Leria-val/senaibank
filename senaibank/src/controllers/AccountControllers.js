// Criar, editar, deletar, saldo
import Account from "../models/Account.js";
import sequelize from "../config/database.js"; // Seu arquivo de conexão

class AccountController {
  
  // Criar conta bancária
  async create(req, res) {
    try {
      const { nome_usuario, cpf, email, senha } = req.body;

      // Validação básica (Requisitos obrigatórios)
      if (!nome_usuario || !cpf || !email || !senha) {
        return res.status(400).json({
          success: false,
          message: "Todos os campos (nome, cpf, email, senha) são obrigatórios"
        });
      }

      const account = await Account.create({
        nome_usuario,
        cpf,
        email,
        senha, // Lembre-se de usar bcrypt no futuro!
        saldo: 0
      });

      return res.status(201).json({
        success: true,
        data: account
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erro ao criar conta bancária",
        error: error.message
      });
    }
  }

  // Consultar saldo
  async getBalance(req, res) {
    try {
      const { id } = req.params;
      const account = await Account.findByPk(id);

      if (!account) {
        return res.status(404).json({ success: false, message: "Conta não encontrada" });
      }

      return res.json({
        success: true,
        saldo: account.saldo
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Erro ao consultar saldo" });
    }
  }

  // Transferência (Operação Complexa com Transaction)
  async transfer(req, res) {
    const t = await sequelize.transaction(); // Inicia transação

    try {
      const { origenId, destinoId, valor } = req.body;

      const contaOrigem = await Account.findByPk(origenId, { transaction: t });
      const contaDestino = await Account.findByPk(destinoId, { transaction: t });

      if (!contaOrigem || !contaDestino) {
        throw new Error("Uma das contas não foi encontrada");
      }

      if (contaOrigem.saldo < valor) {
        throw new Error("Saldo insuficiente");
      }

      // Realiza a movimentação
      await contaOrigem.update({ saldo: contaOrigem.saldo - valor }, { transaction: t });
      await contaDestino.update({ saldo: contaDestino.saldo + valor }, { transaction: t });

      await t.commit(); // Salva as alterações no banco

      return res.json({ success: true, message: "Transferência realizada com sucesso" });

    } catch (error) {
      await t.rollback(); // Cancela tudo se der erro
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default new AccountController();