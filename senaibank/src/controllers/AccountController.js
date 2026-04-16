// Criar, editar, deletar, saldo
import Account from "../models/Account.js";
import sequelize from "../database/connection.js"; 
import bcrypt from "bcrypt"; // Importante para seguridad
import jwt from "jsonwebtoken";


const accountController = {

  login: async (req, res) => {
    try {
        const { email, senha } = req.body;

        // 1. Buscar al usuario por email
        const account = await Account.findOne({ where: { email } });
        if (!account) {
            return res.status(401).json({ success: false, message: "E-mail ou senha inválidos" });
        }

        // 2. Comparar la contraseña usando bcrypt
        const isMatch = await bcrypt.compare(senha, account.senha);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "E-mail ou senha inválidos" });
        }

        // 3. Generar el Token JWT
        // Usa una palabra secreta (puedes ponerla en tu .env como JWT_SECRET)
        const token = jwt.sign(
            { id: account.id, email: account.email },
            process.env.JWT_SECRET || "segredo", 
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            success: true,
            message: "Login realizado com sucesso",
            token: token
        });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
},


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
          success: false,
          message: "error ao listar contas",
          error: error.message,
        });
      }
    },

  // Criar conta bancária

create: async (req, res) => {
  try {
    const { nome_usuario, cpf, email, senha } = req.body;

    if (!nome_usuario || !cpf || !email || !senha) {
      return res.status(400).json({ success: false, message: "Campos obrigatórios faltando" });
    }

    // Hash de la contraseña (Seguridad)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    const account = await Account.create({
      nome_usuario,
      cpf,
      email,
      senha: hashedPassword,
      saldo: 0
    });

    // Eliminar la contraseña de la respuesta por seguridad
    const accountData = account.toJSON();
    delete accountData.senha;

    return res.status(201).json({
      success: true,
      data: accountData,
      message: "Conta criada com sucesso"
    });
  } catch (error) {
    
    return res.status(500).json({ success: false, error: error.message });
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
let updatedData = {
        nome_usuario: nome_usuario ?? account.nome_usuario,
        email: email ?? account.email,
      };

      if (senha) {
        const salt = await bcrypt.genSalt(10);
        updatedData.senha = await bcrypt.hash(senha, salt);
      }

      await account.update(updatedData);

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
message: "Não é possível excluir uma conta com saldo positivo. Saque o dinheiro primeiro",
});
}

await account.destroy();

return res.status(200).json({
success: true,
data: null,
message: "Conta excluída com sucesso",
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


export default accountController;


