import Account from "../models/Account.js";

const validateOperation = async (req, res, next) => {
    
    const { accountNumber, fromId, toId, amount, type } = req.body;

    // 1. Validar campos obligatorios
    const isTransfer = type === "TRANSFERENCIA" || (fromId && toId);
    const hasAccount = isTransfer ? (fromId && toId) : accountNumber;

    if (!hasAccount || !amount) {
        return res.status(400).json({
            success: false,
            message: "Dados da conta e valor são obrigatórios."
        });
    }

    // 2. Validar que el valor sea positivo y numérico
    if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({
            success: false,
            message: "O valor da operação deve ser um número maior que zero."
        });
    }

    // 3. Validar límite máximo de $1.000.000 (Requisito del prof)
    if (amount > 1000000) {
        return res.status(400).json({
            success: false,
            message: "O valor máximo permitido por operação é R$ 1.000.000,00."
        });
    }

    try {
        // 4. Identificar qual ID de conta validar
        // Se for transferência, validamos a conta de origem (fromId)
        const idToValidate = isTransfer ? fromId : accountNumber;

        const account = await Account.findByPk(idToValidate);
        
        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Conta não encontrada."
            });
        }

        // 5. Validar tipos de operación (Opcional si usas rutas separadas, pero bueno por seguridad)
        const validTypes = ["DEPOSITO", "SAQUE", "TRANSFERENCIA"];
        if (type && !validTypes.includes(type.toUpperCase())) {
            return res.status(400).json({
                success: false,
                message: "Tipo de operação inválido."
            });
        }

        // 6. Validar saldo suficiente (Solo para Saques o Transferencias)
        // Convertemos para Number para garantir que a comparação seja precisa
        if ((type === "SAQUE" || isTransfer) && Number(account.saldo) < Number(amount)) {
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