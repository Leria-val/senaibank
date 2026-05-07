const isValidCPF = (cpf) => {
    // Remove caracteres não numéricos
    const stripped = cpf.replace(/\D/g, "");

    if (stripped.length !== 11) return false;

    // Rejeita sequências de dígitos iguais (ex: 111.111.111-11)
    if (/^(\d)\1{10}$/.test(stripped)) return false;

    // Validação do 1º dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(stripped[i]) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(stripped[9])) return false;

    // Validação do 2º dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(stripped[i]) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(stripped[10])) return false;

    return true;
};

const validateCPF = (req, res, next) => {
    const { cpf } = req.body;

    if (!cpf) {
        return res.status(400).json({
            success: false,
            message: "O CPF é obrigatório.",
        });
    }

    if (!isValidCPF(cpf)) {
        return res.status(400).json({
            success: false,
            message: "CPF inválido.",
        });
    }

    next();
};

export { isValidCPF };
export default validateCPF;