const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000; // Define a porta para o backend

// Middlewares
app.use(cors()); // Habilita o CORS
app.use(express.json()); // Habilita o servidor a entender JSON

// Rota de teste
app.get('/', (req, res) => {
  res.send('Olá! O servidor backend está funcionando! 🚀');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});