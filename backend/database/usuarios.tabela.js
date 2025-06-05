const DataStore = require('nedb');
const path = require('path');

const dbUsuarios = new DataStore({
    filename: path.join(__dirname, 'usuarios.db'),
    autoload: true,
    timestampData: true
});

dbUsuarios.ensureIndex({ fieldName: 'username', unique: true }, (err) => {
    if (err) {
        console.error("Erro ao criar índice de unicidade para username:", err);
    }
});

module.exports = dbUsuarios;