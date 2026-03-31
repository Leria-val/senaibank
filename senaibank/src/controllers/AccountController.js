// Criar, editar, deletar, saldo
import Account from "../models/Account.js";
import sequelize from "../database/connection.js"; 

const accountController = {

   //listar
   getAll: async (req, res) => {
    try {
      const accounts = await Account.findAll();

        return res.status(200).json({
          success: true,
          data: accounts,
          message: "contas listadas com sucesso",
        });
      } catch (error) {
        return res.status(500).json({
          success: true,
          message: "error ao listar contas",
          error: error.message,
        });
      }
    },

  // Criar conta bancária
  create: async (req, res) => {
    try {
      const { nome_usuario, cpf, email, senha } = req.body;

      // Validação básica (Requisitos obrigatórios)
      if (!nome_usuario || !cpf || !email || !senha) {
        return res.status(400).json({
          success: false,
          message: "Todos os campos são obrigatórios"
        });
      }

      const account = await Account.create({
        nome_usuario,
        cpf,
        email,
        senha, //aqui vai o hash
        saldo: 0
      });

      return res.status(201).json({
        success: true,
        data: account,
        message: "conta criada com sucesso"
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erro ao criar conta bancária",
        error: error.message
      });
    }
  },

  
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { nome_usuario, email, senha } = req.body;

      const account = await Account.findByPk(id);

      if (!account) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "Conta não encontrada",
        });
      }

      await account.update({
        nome_usuario: nome_usuario ?? account.nome_usuario,
        email: email ?? account.email,
        senha: senha ?? account.senha,
      });

      return res.status(200).json({
        success: true,
        data: account,
        message: "dados da conta atualizada com sucesso!",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erro ao atualizar conta",
        error: error.message,
      });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const account = await Account.findByPk(id);

      if (!account) {
        return res.status(404).json({
          success: false,
          data: null,
          message: "Conta não encontrada",
        });
      }
      //verificação de segrurança: nao permite excluir contas com saldo positivo
      if (account.saldo > 0) {
        return res.status(400).json({
        success: false,
        message: "nao e possivel excluir uma conta com saldo positivo. Saque o dinheiro primeiro",
      });

    } await account.destroy();

     return res.status(200).json({
        success: true,
        data: null,
        message: "conta excluida com successo",
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erro ao remover conta",
        error: error.message,
      });
    }
  },
};


export default accountController();