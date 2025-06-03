const DataStore = require('nedb');
const path = require('path');

const dbRotas = new DataStore({
    filename: path.join(__dirname, 'rotas.db'), 
    autoload: true,
    timestampData: true
});

module.exports = dbRotas;