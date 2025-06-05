require('dotenv').config()
const express = require('express')
const cors = require('cors')
const destinosRoutes = require('./routes/destinoRoutes')
const rotaRoutes = require('./routes/rotaRoutes')
const authRoutes = require('./routes/authRoutes')


const app = express()
const PORT = 4000;

app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
  res.send('O servidor backend está funcionando.')
});

app.use('/api/destinos', destinosRoutes)
app.use('/api/rotas', rotaRoutes)
app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`)
});