const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const protegerRota = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Acesso negado. Nenhum token fornecido." });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Acesso negado. Token malformado." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        console.error("Erro na verificação do token:", error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expirado. Por favor, faça login novamente." });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Token inválido." });
        }
        return res.status(500).json({ message: "Erro interno ao validar autenticação." });
    }
};

module.exports = protegerRota;