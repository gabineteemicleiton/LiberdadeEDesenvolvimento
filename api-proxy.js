// Proxy simples para conectar painel com API
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Rota para obter interações
    if (req.url === '/api/interacoes' && req.method === 'GET') {
        try {
            const interacoes = JSON.parse(fs.readFileSync('interacoes.json', 'utf8'));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(interacoes));
        } catch (error) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end('[]');
        }
        return;
    }

    // Rota para adicionar interações
    if (req.url === '/api/interacoes' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const novaInteracao = JSON.parse(body);
                let interacoes = [];
                
                try {
                    interacoes = JSON.parse(fs.readFileSync('interacoes.json', 'utf8'));
                } catch (error) {
                    // Se o arquivo não existe, começar com array vazio
                }
                
                interacoes.push(novaInteracao);
                fs.writeFileSync('interacoes.json', JSON.stringify(interacoes, null, 2));
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ ok: true }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
        return;
    }

    // 404 para outras rotas
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
});

const port = 3002;
server.listen(port, '0.0.0.0', () => {
    console.log(`Proxy API rodando na porta ${port}`);
});