const express = require('express');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();

// Configurar diretório de uploads
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurar multer para upload de imagens
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Configurar middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Servir arquivos estáticos
app.use('/uploads', express.static(uploadDir));

// Função para gerar protocolo
function generateProtocol() {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 900000) + 100000;
    return `SGT${year}${randomNum}`;
}

// Endpoint para upload de fotos
app.post('/api/upload-foto', upload.single('foto'), (req, res) => {
    try {
        console.log('📸 Upload de foto recebido...');
        
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado' });
        }

        const { nome, bairro, descricao, endereco } = req.body;
        
        if (!nome || !bairro || !descricao) {
            return res.status(400).json({ error: 'Campos obrigatórios: nome, bairro, descricao' });
        }

        const interacao = {
            tipo: 'foto',
            titulo: `Foto enviada por ${nome} - ${bairro}`,
            mensagem: descricao,
            imagem: `/uploads/${req.file.filename}`,
            protocolo: generateProtocol(),
            data: new Date().toISOString(),
            nome: nome,
            bairro: bairro,
            endereco: endereco,
            descricao: descricao,
            nomeArquivo: req.file.originalname,
            tamanhoArquivo: req.file.size,
            status: 'nova'
        };

        // Salvar no arquivo interacoes.json
        const interacoesPath = path.join(__dirname, 'interacoes.json');
        let interacoes = [];
        
        if (fs.existsSync(interacoesPath)) {
            const data = fs.readFileSync(interacoesPath, 'utf8');
            interacoes = JSON.parse(data);
        }
        
        interacoes.push(interacao);
        fs.writeFileSync(interacoesPath, JSON.stringify(interacoes, null, 2));

        console.log('✅ Foto salva com sucesso:', interacao.protocolo);

        res.json({
            success: true,
            protocolo: interacao.protocolo,
            imagePath: interacao.imagem,
            imageUrl: interacao.imagem,
            message: 'Foto enviada com sucesso!'
        });

    } catch (error) {
        console.error('❌ Erro no upload:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Endpoint para marcar local
app.post('/api/marcar-local', (req, res) => {
    try {
        console.log('📍 Marcação de local recebida...');
        
        const { nome, bairro, endereco, problema, descricao } = req.body;
        
        if (!nome || !bairro || !endereco || !problema || !descricao) {
            return res.status(400).json({ error: 'Campos obrigatórios: nome, bairro, endereco, problema, descricao' });
        }

        const interacao = {
            tipo: 'localizacao',
            titulo: `Local marcado por ${nome} - ${bairro}`,
            mensagem: `${problema}: ${descricao}`,
            protocolo: generateProtocol(),
            data: new Date().toISOString(),
            nome: nome,
            bairro: bairro,
            endereco: endereco,
            problema: problema,
            descricao: descricao,
            status: 'nova'
        };

        // Salvar no arquivo interacoes.json
        const interacoesPath = path.join(__dirname, 'interacoes.json');
        let interacoes = [];
        
        if (fs.existsSync(interacoesPath)) {
            const data = fs.readFileSync(interacoesPath, 'utf8');
            interacoes = JSON.parse(data);
        }
        
        interacoes.push(interacao);
        fs.writeFileSync(interacoesPath, JSON.stringify(interacoes, null, 2));

        console.log('✅ Local marcado com sucesso:', interacao.protocolo);

        res.json({
            success: true,
            protocolo: interacao.protocolo,
            message: 'Local marcado com sucesso!'
        });

    } catch (error) {
        console.error('❌ Erro ao marcar local:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota para obter interações
app.get('/api/interacoes', (req, res) => {
    try {
        console.log('📡 GET /api/interacoes - Carregando interações...');
        
        let interacoes = [];
        try {
            const data = fs.readFileSync('interacoes.json', 'utf8');
            interacoes = JSON.parse(data);
        } catch (error) {
            console.log('⚠️ Arquivo interacoes.json não encontrado, criando array vazio');
            interacoes = [];
        }
        
        console.log(`✅ Retornando ${interacoes.length} interações`);
        res.json(interacoes);
    } catch (error) {
        console.error('❌ Erro ao carregar interações:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota para adicionar interação
app.post('/api/interacoes', (req, res) => {
    try {
        console.log('📡 POST /api/interacoes - Nova interação recebida');
        
        const novaInteracao = req.body;
        console.log('📝 Dados recebidos:', novaInteracao);
        
        // Carregar interações existentes
        let interacoes = [];
        try {
            const data = fs.readFileSync('interacoes.json', 'utf8');
            interacoes = JSON.parse(data);
        } catch (error) {
            console.log('⚠️ Criando novo arquivo interacoes.json');
            interacoes = [];
        }
        
        // Adicionar nova interação
        interacoes.push(novaInteracao);
        
        // Salvar arquivo
        fs.writeFileSync('interacoes.json', JSON.stringify(interacoes, null, 2));
        
        console.log(`✅ Interação salva. Total: ${interacoes.length}`);
        res.json({ ok: true, total: interacoes.length });
        
    } catch (error) {
        console.error('❌ Erro ao salvar interação:', error);
        res.status(500).json({ error: 'Erro ao salvar interação' });
    }
});

const PORT = 3003;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor Express rodando na porta ${PORT}`);
    console.log(`📡 API disponível em http://localhost:${PORT}/api/interacoes`);
});