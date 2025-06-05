const dbUsuarios = require('../database/usuarios.tabela.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error("JWT_SECRET não definido nas variáveis de ambiente.");
}

const findOneUser = (query) => {
    return new Promise((resolve, reject) => {
        dbUsuarios.findOne(query, (err, user) => {
            if (err) return reject({ message: "Erro ao buscar usuário.", statusCode: 500 });
            resolve(user);
        });
    });
};

const registrar = async (username, password) => {
    if (!password || password.length < 6) {
        const error = new Error("A senha deve ter pelo menos 6 caracteres.");
        error.statusCode = 400; 
        throw error;
    }

    const contemLetra = /[a-zA-Z]/.test(password);
    const contemNumero = /[0-9]/.test(password);

    if (!contemLetra || !contemNumero) {
        const error = new Error("A senha deve conter letras e números.");
        error.statusCode = 400;
        throw error;
    }

    const usuarioExistente = await findOneUser({ username: username.toLowerCase() });
    if (usuarioExistente) {
        const error = new Error("Este nome de usuário já está em uso.");
        error.statusCode = 409;
        throw error;
    }

    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt);

    const novoUsuarioDoc = {
        username: username.toLowerCase(), 
        password: hashedPassword,
    };

    return new Promise((resolve, reject) => {
        dbUsuarios.insert(novoUsuarioDoc, (err, usuarioSalvo) => {
            if (err) {
                console.error("Erro ao salvar novo usuário no NeDB:", err);
                return reject({statusCode: 500, message:"Erro interno ao registrar o usuário."})
            }
            const { password, ...usuarioParaRetorno } = usuarioSalvo;
            resolve(usuarioParaRetorno);
        });
    });
};

const login = async (username, password) => {
    if (!JWT_SECRET) {
        throw { message: "Configuração do servidor incompleta para login.", statusCode: 500 };
    }

    const usernameLowerCase = username.toLowerCase();
    const usuario = await findOneUser({ username: usernameLowerCase });

    if (!usuario) {
        throw { message: "Credenciais inválidas (usuário não encontrado).", statusCode: 401 };
    }

    const senhaCorreta = await bcrypt.compare(password, usuario.password);

    if (!senhaCorreta) {
        throw { message: "Credenciais inválidas (senha incorreta).", statusCode: 401 };
    }

    const payload = {
        userId: usuario._id,
        username: usuario.username
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); 

    return {
        token,
        usuario: {
            id: usuario._id,
            username: usuario.username
        }
    };
};

module.exports = {
    registrar,
    login
};