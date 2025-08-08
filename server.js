// Servidor completo para formulário de sugestões
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3000;

// Configurações
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir arquivos estáticos
app.use(express.static('.'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Criar pasta uploads se não existir
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuração do multer para upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, `${timestamp}-${sanitizedName}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limite
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de arquivo não permitido. Use JPG, PNG ou GIF.'));
        }
    }
});

// Função para gerar protocolo
function generateProtocol() {
    const year = new Date().getFullYear();
    const number = Math.floor(Math.random() * 900000) + 100000;
    return `SGT${year}${number}`;
}

// Função para salvar interação no arquivo JSON
function saveInteraction(interaction) {
    const filePath = path.join(__dirname, 'interacoes.json');
    let interactions = [];
    
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            interactions = JSON.parse(data);
        }
    } catch (error) {
        console.error('Erro ao ler arquivo de interações:', error);
        interactions = [];
    }
    
    interactions.push(interaction);
    
    try {
        fs.writeFileSync(filePath, JSON.stringify(interactions, null, 2));
        return true;
    } catch (error) {
        console.error('Erro ao salvar interação:', error);
        return false;
    }
}

// Rota principal do formulário
app.post('/enviar', upload.single('foto'), async (req, res) => {
    try {
        console.log('📝 Nova submissão recebida');
        console.log('📋 Dados do formulário:', req.body);
        console.log('📸 Arquivo enviado:', req.file ? req.file.filename : 'Nenhum');
        
        const dados = req.body;
        const protocolo = generateProtocol();
        
        // Criar objeto de interação
        const interacao = {
            protocolo: protocolo,
            tipo: (dados.tipo || 'sugestao').toUpperCase(),
            titulo: dados.assunto || 'Sem assunto',
            mensagem: dados.mensagem || 'Sem mensagem',
            nome: dados.nome || 'Não informado',
            email: dados.email || 'Não informado',
            telefone: dados.telefone || 'Não informado',
            bairro: dados.bairro || 'Não informado',
            endereco: dados.localizacao || dados.local || 'Não informado',
            data: new Date().toISOString(),
            status: 'pendente'
        };
        
        // Se há imagem, adicionar informações
        if (req.file) {
            interacao.imagemUrl = `/uploads/${req.file.filename}`;
            interacao.nomeArquivo = req.file.originalname;
            interacao.tamanhoArquivo = req.file.size;
            console.log('📸 Imagem salva:', req.file.filename);
        }
        
        // Salvar no arquivo JSON
        const saved = saveInteraction(interacao);
        
        if (saved) {
            console.log('✅ Interação salva com protocolo:', protocolo);
            
            // Resposta de sucesso
            res.json({
                success: true,
                protocolo: protocolo,
                message: 'Sugestão enviada com sucesso!',
                imagePath: req.file ? `/uploads/${req.file.filename}` : null
            });
        } else {
            throw new Error('Erro ao salvar dados');
        }
        
    } catch (error) {
        console.error('❌ Erro no processamento:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Erro interno do servidor'
        });
    }
});

// Rota para buscar interações
app.get('/api/interacoes', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'interacoes.json');
        let interactions = [];
        
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            interactions = JSON.parse(data);
        }
        
        res.json({
            success: true,
            total: interactions.length,
            data: interactions
        });
    } catch (error) {
        console.error('❌ Erro ao buscar interações:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao buscar dados'
        });
    }
});

// ===== API ENDPOINT PARA LOGIN DE ELEITORES =====
app.post('/api/login-eleitor', (req, res) => {
    try {
        console.log('🔐 Tentativa de login de eleitor...');
        
        const { email, senha } = req.body;
        const filePath = path.join(__dirname, 'eleitores.json');
        
        if (!email || !senha) {
            return res.status(400).json({
                success: false,
                error: 'Email e senha são obrigatórios!'
            });
        }
        
        let eleitores = [];
        
        // Ler eleitores do arquivo
        try {
            if (fs.existsSync(filePath)) {
                const data = fs.readFileSync(filePath, 'utf8');
                eleitores = JSON.parse(data);
            }
        } catch (error) {
            console.error('Erro ao ler arquivo de eleitores:', error);
        }
        
        // Buscar eleitor (senha padrão é o email)
        const eleitor = eleitores.find(e => 
            e.email === email && (e.senha === senha || e.email === senha)
        );
        
        if (!eleitor) {
            console.log(`❌ Login falhou para: ${email}`);
            return res.status(401).json({
                success: false,
                error: 'Email ou senha incorretos!'
            });
        }
        
        // Atualizar último login
        eleitor.lastLogin = new Date().toISOString();
        
        // Salvar arquivo atualizado
        try {
            fs.writeFileSync(filePath, JSON.stringify(eleitores, null, 2));
        } catch (error) {
            console.error('Erro ao atualizar último login:', error);
        }
        
        console.log(`✅ Login bem-sucedido: ${eleitor.nome || eleitor.nomeCompleto} (${eleitor.email})`);
        
        res.json({
            success: true,
            message: 'Login realizado com sucesso!',
            user: {
                id: eleitor.id,
                nome: eleitor.nome || eleitor.nomeCompleto,
                nomeCompleto: eleitor.nomeCompleto || eleitor.nome,
                email: eleitor.email,
                telefone: eleitor.telefone,
                bairro: eleitor.bairro,
                cidade: eleitor.cidade,
                lastLogin: eleitor.lastLogin
            }
        });
        
    } catch (error) {
        console.error('❌ Erro no login de eleitor:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// ===== API ENDPOINT PARA CADASTRO DE ELEITORES =====
app.post('/api/cadastro-eleitor', (req, res) => {
    try {
        console.log('📋 Recebendo cadastro de eleitor...');
        
        const eleitorData = req.body;
        
        // Validar dados obrigatórios
        if (!eleitorData.nomeCompleto || !eleitorData.email || !eleitorData.telefone) {
            return res.status(400).json({
                success: false,
                error: 'Dados obrigatórios não fornecidos'
            });
        }
        
        // Adicionar timestamp e ID único se não existir
        const novoEleitor = {
            ...eleitorData,
            id: eleitorData.id || Date.now(),
            nome: eleitorData.nomeCompleto,
            dataCadastro: eleitorData.dataCadastro || new Date().toISOString(),
            status: eleitorData.status || 'ativo',
            fonte: 'formulario_web',
            // Adicionar campos para login (senha padrão é o email)
            senha: eleitorData.email,
            isActive: true,
            lastLogin: null
        };
        
        // Salvar em arquivo JSON
        const filePath = path.join(__dirname, 'eleitores.json');
        let eleitores = [];
        
        try {
            if (fs.existsSync(filePath)) {
                const data = fs.readFileSync(filePath, 'utf8');
                eleitores = JSON.parse(data);
            }
        } catch (error) {
            console.warn('⚠️ Arquivo de eleitores não existe ou está corrompido, criando novo');
            eleitores = [];
        }
        
        // Verificar se eleitor já existe
        const eleitorExistente = eleitores.find(e => 
            e.email === novoEleitor.email || 
            (e.cpf && novoEleitor.cpf && e.cpf === novoEleitor.cpf)
        );
        
        if (eleitorExistente) {
            return res.status(409).json({
                success: false,
                error: 'Eleitor já cadastrado com este e-mail ou CPF'
            });
        }
        
        // Adicionar novo eleitor
        eleitores.push(novoEleitor);
        
        // Salvar arquivo
        try {
            fs.writeFileSync(filePath, JSON.stringify(eleitores, null, 2));
            console.log(`✅ Eleitor cadastrado: ${novoEleitor.nomeCompleto} (${novoEleitor.email})`);
            
            res.json({
                success: true,
                message: 'Eleitor cadastrado com sucesso!',
                eleitor: {
                    id: novoEleitor.id,
                    nome: novoEleitor.nomeCompleto,
                    email: novoEleitor.email,
                    dataCadastro: novoEleitor.dataCadastro
                },
                total: eleitores.length
            });
            
        } catch (error) {
            throw new Error('Erro ao salvar dados do eleitor');
        }
        
    } catch (error) {
        console.error('❌ Erro no cadastro de eleitor:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Erro interno do servidor'
        });
    }
});

// Rota para buscar eleitores cadastrados
app.get('/api/eleitores', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'eleitores.json');
        let eleitores = [];
        
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            eleitores = JSON.parse(data);
        }
        
        // Remover dados sensíveis da resposta
        const eleitoresSemSenha = eleitores.map(e => {
            const { senha, ...eleitorSemSenha } = e;
            return eleitorSemSenha;
        });
        
        res.json({
            success: true,
            total: eleitoresSemSenha.length,
            data: eleitoresSemSenha
        });
    } catch (error) {
        console.error('❌ Erro ao buscar eleitores:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao buscar dados'
        });
    }
});

// Rota para testar o servidor
app.get('/test', (req, res) => {
    res.json({
        message: 'Servidor funcionando!',
        timestamp: new Date().toISOString(),
        port: port
    });
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                error: 'Arquivo muito grande. Máximo 2MB permitido.'
            });
        }
    }
    
    console.error('❌ Erro:', error);
    res.status(500).json({
        success: false,
        error: error.message || 'Erro interno do servidor'
    });
});

// Iniciar servidor
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Servidor funcionando em http://localhost:${port}`);
    console.log(`📁 Arquivos estáticos servidos da pasta atual`);
    console.log(`📸 Upload de imagens em: ${uploadsDir}`);
    console.log(`📝 Formulário disponível em: http://localhost:${port}/enviar`);
});
// ===== API ENDPOINT PARA NOTÍCIAS DE EMPREENDEDORISMO =====
app.post('/api/fetch-pegn-news', async (req, res) => {
    try {
        console.log('🔍 Buscando notícias de empreendedorismo...');
        
        // Executar script Python para buscar notícias
        const { exec } = require('child_process');
        const path = require('path');
        
        exec('python3 pegn_scraper.py', (error, stdout, stderr) => {
            if (error) {
                console.error('Erro ao executar scraper:', error);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }
            
            if (stderr) {
                console.warn('Warnings do scraper:', stderr);
            }
            
            // Tentar carregar arquivo JSON gerado
            const fs = require('fs');
            try {
                const newsData = fs.readFileSync('pegn_news.json', 'utf8');
                const news = JSON.parse(newsData);
                
                console.log(`✅ ${news.length} notícias encontradas`);
                res.json({
                    success: true,
                    news: news,
                    count: news.length,
                    timestamp: new Date().toISOString()
                });
                
            } catch (fileError) {
                console.error('Erro ao ler arquivo de notícias:', fileError);
                res.status(500).json({ 
                    error: 'Erro ao processar notícias',
                    news: []
                });
            }
        });
        
    } catch (error) {
        console.error('Erro no endpoint de notícias:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
