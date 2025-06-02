const DataStore = require('nedb');
const path = require('path');

const db = new DataStore({
    filename: path.join(__dirname, 'destinos.db'),
    autoload: true,                               
    timestampData: true                          
});

module.exports = db;
