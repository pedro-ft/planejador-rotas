const authService = require('../services/authService'); // Criaremos em breve

const registrarUsuario = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Nome de usuário e senha são obrigatórios." });
        }

        // Idealmente, adicione mais validações para username e password (tamanho, caracteres, etc.)
        // Ex: if (password.length < 6) { return res.status(400).json({ message: "Senha deve ter pelo menos 6 caracteres."})}

        const novoUsuario = await authService.registrar(username, password);

        res.status(201).json({ 
            message: "Usuário registrado com sucesso!",
            data: { userId: novoUsuario._id, username: novoUsuario.username }
        });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message || "Ocorreu um erro no servidor ao registrar o usuário."
        });
    }
};

const loginUsuario = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Nome de usuário e senha são obrigatórios." });
        }

        const resultadoLogin = await authService.login(username, password);

        res.status(200).json({
            message: "Login bem-sucedido.",
            data: resultadoLogin
        });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message || "Ocorreu um erro no servidor durante o login."
        });
    }
};

module.exports = {
    registrarUsuario,
    loginUsuario
};