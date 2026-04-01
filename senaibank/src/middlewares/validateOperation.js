import Account from "../models/Account.js";

const validateOperation = async (req, res, next) => {
    // Corregimos los nombres de las variables (amount con 'n')
    const { accountNumber, amount, type } = req.body;

    // 1. Validar campos obligatorios
    if (!accountNumber || !amount) {
        return res.status(400).json({
            success: false,
            message: "Número da conta e valor são obrigatórios."
        });
    }

    // 2. Validar que el valor sea positivo y numérico
    if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({
            success: false,
            message: "O valor da operação deve ser um número maior que zero."
        });
    }

    try {
        // 3. Buscar la cuenta usando Sequelize (findByPk o findOne)
        const account = await Account.findByPk(accountNumber);
        
        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Conta não encontrada."
            });
        }

        // 4. Validar tipos de operación (Opcional si usas rutas separadas, pero bueno por seguridad)
        const validTypes = ["DEPOSITO", "SAQUE", "TRANSFERENCIA"];
        if (type && !validTypes.includes(type.toUpperCase())) {
            return res.status(400).json({
                success: false,
                message: "Tipo de operação inválido."
            });
        }

        // 5. Validar saldo suficiente (Solo para Saques o Transferencias)
        // Usamos 'saldo' que es el nombre en tu modelo
        if ((type === "SAQUE" || type === "TRANSFERENCIA") && account.saldo < amount) {
            return res.status(400).json({
                success: false,
                message: "Saldo insuficiente para realizar esta operação."
            });
        }

        // Guardamos la cuenta en el objeto request para que el controlador no tenga que buscarla de nuevo
        req.account = account;
        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro interno na validação da operação.",
            error: error.message
        });
    }
};

export default validateOperation;