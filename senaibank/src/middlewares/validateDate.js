const validateDate = (req, res, next) => {
    const { date } = req.body;

    if (!date) {
        return res.status(400).json({
            success: false,
            message: "A data é obrigatória.",
        });
    }

    const inputDate = new Date(date);

    if (isNaN(inputDate.getTime())) {
        return res.status(400).json({
            success: false,
            message: "Formato de data inválido. Use o formato YYYY-MM-DD.",
        });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 30);

    if (inputDate <= today) {
        return res.status(400).json({
            success: false,
            message: "A data deve ser maior que o dia atual.",
        });
    }

    if (inputDate > maxDate) {
        return res.status(400).json({
            success: false,
            message: "A data deve ser menor que 30 dias a partir de hoje.",
        });
    }

    next();
};

export default validateDate;