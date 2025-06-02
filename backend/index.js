const express = require('express');
const cors = require('cors');
const destinosRoutes = require('./routes/destinoRoutes');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Olá! O servidor backend está funcionando! 🚀');
});

app.use('/api/destinos', destinosRoutes)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});