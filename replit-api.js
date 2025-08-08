const express = require('express');
const fs = require('fs').promises;
const app = express();
const PORT = process.env.PORT || 3000;

// Configurar CORS para permitir requisições de outras portas
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(express.json());
app.use(express.static('.'));

const FILE = 'interacoes.json';

app.post('/api/interacoes', async (req, res) => {
  try {
    const nova = req.body;
    const dados = await fs.readFile(FILE, 'utf8');
    const lista = JSON.parse(dados);
    lista.push(nova);
    await fs.writeFile(FILE, JSON.stringify(lista, null, 2));
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao salvar interação' });
  }
});

app.get('/api/interacoes', async (req, res) => {
  try {
    const dados = await fs.readFile(FILE, 'utf8');
    res.status(200).json(JSON.parse(dados));
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao ler interações' });
  }
});

app.listen(PORT, () => console.log(`Servidor iniciado na porta ${PORT}`));