import Account from "../models/Account.js";

const validateAccount = async (req, res, next) => {
    const { nome_usuario, cpf, email, senha } = req.body;

    // 1. Verificar presencia de campos obligatorios (Requisitos de Senaibank)
    if (!nome_usuario || !cpf || !email || !senha) {
        return res.status(400).json({
            success: false,
            message: 'Todos os campos (nome_usuario, cpf, email, senha) são obrigatórios.'
        });
    }

    try {
        // 2. Verificar duplicidad de CPF (Seguridad y Regla de Negocio)
        const existingAccount = await Account.findOne({ where: { cpf } });

        if (existingAccount) {
            return res.status(400).json({
                success: false,
                message: 'Este CPF já está cadastrado em nosso sistema.'
            });
        }

        // 3. Verificar duplicidad de Email
        const existingEmail = await Account.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: 'Este e-mail já está em uso.'
            });
        }

        // Si todo está bien, pasamos al controlador
        next();
        
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Erro interno ao validar dados da conta.',
            error: err.message
        });
    }
};

export default validateAccount;