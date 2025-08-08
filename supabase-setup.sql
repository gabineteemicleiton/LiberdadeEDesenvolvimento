-- SQL script para criar as tabelas necessárias no Supabase
-- Execute este script no SQL Editor do Supabase Dashboard

-- Tabela para cabeçalho do site
CREATE TABLE IF NOT EXISTS cabecalho (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    subtitulo TEXT,
    logo_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para biografia do vereador
CREATE TABLE IF NOT EXISTS biografia (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    conteudo TEXT NOT NULL,
    foto_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para projetos
CREATE TABLE IF NOT EXISTS projetos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Em andamento',
    data_inicio DATE,
    data_fim DATE,
    categoria VARCHAR(100),
    imagem_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para mandatos
CREATE TABLE IF NOT EXISTS mandatos (
    id SERIAL PRIMARY KEY,
    periodo VARCHAR(50) NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    descricao TEXT,
    realizacoes TEXT,
    status VARCHAR(50) DEFAULT 'Atual',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para notícias
CREATE TABLE IF NOT EXISTS noticias (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    conteudo TEXT NOT NULL,
    resumo TEXT,
    autor VARCHAR(100),
    data_publicacao DATE DEFAULT CURRENT_DATE,
    categoria VARCHAR(100),
    imagem_url VARCHAR(500),
    video_url VARCHAR(500),
    publicado BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para galeria
CREATE TABLE IF NOT EXISTS galeria (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    url VARCHAR(500) NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('imagem', 'video')),
    categoria VARCHAR(100),
    data_evento DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para agenda pública
CREATE TABLE IF NOT EXISTS agenda (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    data_evento DATE NOT NULL,
    hora_evento TIME,
    local_evento VARCHAR(255),
    categoria VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Agendado',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para botões de ação rápida
CREATE TABLE IF NOT EXISTS botoes (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    url VARCHAR(500),
    icone VARCHAR(100),
    cor VARCHAR(20),
    ativo BOOLEAN DEFAULT true,
    posicao INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para interações dos cidadãos
CREATE TABLE IF NOT EXISTS interacoes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telefone VARCHAR(20),
    tipo VARCHAR(50) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    protocolo VARCHAR(50) UNIQUE,
    status VARCHAR(50) DEFAULT 'Pendente',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    endereco TEXT,
    bairro VARCHAR(100),
    foto_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_noticias_data_publicacao ON noticias(data_publicacao DESC);
CREATE INDEX IF NOT EXISTS idx_agenda_data_evento ON agenda(data_evento ASC);
CREATE INDEX IF NOT EXISTS idx_interacoes_status ON interacoes(status);
CREATE INDEX IF NOT EXISTS idx_interacoes_tipo ON interacoes(tipo);
CREATE INDEX IF NOT EXISTS idx_projetos_status ON projetos(status);

-- RLS (Row Level Security) policies podem ser adicionadas aqui se necessário
-- Para permitir leitura pública mas escrita apenas autenticada, por exemplo:

-- ALTER TABLE noticias ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public read" ON noticias FOR SELECT USING (publicado = true);
-- CREATE POLICY "Allow authenticated insert" ON noticias FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Dados iniciais de exemplo (opcional)
INSERT INTO cabecalho (titulo, subtitulo) VALUES 
('Liberdade & Desenvolvimento', 'Vereador Emicleiton Rubem da Conceição')
ON CONFLICT DO NOTHING;

-- Tabela para configurações do painel administrativo
CREATE TABLE IF NOT EXISTS painel_site (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    subtitle VARCHAR(255),
    about_text TEXT,
    contact_whatsapp VARCHAR(20),
    contact_email VARCHAR(255),
    banner_image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO biografia (titulo, conteudo) VALUES 
('Sobre o Vereador', 'Emicleiton Rubem da Conceição é vereador de Monte Santo, BA, comprometido com o desenvolvimento da cidade e o bem-estar da população.')
ON CONFLICT DO NOTHING;

-- Inserir dados iniciais na tabela painel_site
INSERT INTO painel_site (title, subtitle, about_text, contact_whatsapp, contact_email) VALUES 
('Liberdade & Desenvolvimento', 
 'Vereador Emicleiton Rubem da Conceição', 
 'Trabalhando pela transformação de Monte Santo com transparência, dedicação e compromisso com o povo.',
 '(74) 99999-9999',
 'contato@emicleiton.com.br')
ON CONFLICT DO NOTHING;

-- ===== NOVAS TABELAS SOLICITADAS =====

-- 1. Tabela: agenda_publica
CREATE TABLE IF NOT EXISTS agenda_publica (
    id SERIAL PRIMARY KEY,
    titulo TEXT NOT NULL,
    descricao TEXT,
    data TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela: mandatos
CREATE TABLE IF NOT EXISTS mandatos (
    id SERIAL PRIMARY KEY,
    titulo TEXT NOT NULL,
    descricao TEXT,
    imagem_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela: projetos
CREATE TABLE IF NOT EXISTS projetos (
    id SERIAL PRIMARY KEY,
    titulo TEXT NOT NULL,
    descricao TEXT,
    imagem_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela: equipe
CREATE TABLE IF NOT EXISTS equipe (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    funcao TEXT,
    foto_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabela: redes_sociais
CREATE TABLE IF NOT EXISTS redes_sociais (
    id SERIAL PRIMARY KEY,
    nome_rede TEXT NOT NULL,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabela: site_conteudo (para conteúdo dinâmico) - ESTRUTURA UNIFICADA
CREATE TABLE IF NOT EXISTS site_conteudo (
    id SERIAL PRIMARY KEY,
    secao VARCHAR(100) NOT NULL,
    chave VARCHAR(100) NOT NULL,
    valor TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== DADOS INICIAIS =====

-- Dados iniciais para agenda_publica
INSERT INTO agenda_publica (titulo, descricao, data) VALUES 
('Sessão Ordinária da Câmara', 'Reunião ordinária para discussão de projetos em tramitação', '2025-01-30'),
('Audiência Pública - Orçamento', 'Discussão do orçamento municipal para 2025', '2025-02-15'),
('Reunião com Secretários', 'Reunião de alinhamento com secretários municipais', '2025-02-20')
ON CONFLICT DO NOTHING;

-- Dados iniciais para mandatos
INSERT INTO mandatos (titulo, descricao, imagem_url) VALUES 
('Mandato 2021-2024', 'Primeiro mandato como vereador de Monte Santo, focado em transparência e desenvolvimento', ''),
('Projetos Aprovados', '15 projetos de lei aprovados em benefício da comunidade', ''),
('Emendas Parlamentares', 'R$ 500 mil em emendas destinadas para saúde e educação', '')
ON CONFLICT DO NOTHING;

-- Dados iniciais para projetos
INSERT INTO projetos (titulo, descricao, imagem_url) VALUES 
('Lei da Transparência Municipal', 'Projeto que garante maior transparência nos gastos públicos', ''),
('Programa Jovem Empreendedor', 'Incentivo ao empreendedorismo jovem com cursos e microcrédito', ''),
('Melhorias na Saúde Básica', 'Ampliação do atendimento médico nos bairros periféricos', '')
ON CONFLICT DO NOTHING;

-- Dados iniciais para equipe
INSERT INTO equipe (nome, funcao, foto_url) VALUES 
('Maria Silva', 'Assessora de Comunicação', ''),
('João Santos', 'Assessor Jurídico', ''),
('Ana Costa', 'Coordenadora de Projetos', '')
ON CONFLICT DO NOTHING;

-- Dados iniciais para redes_sociais
INSERT INTO redes_sociais (nome_rede, link) VALUES 
('Facebook', 'https://facebook.com/emicleitonrubem'),
('Instagram', 'https://instagram.com/emicleitonrubem'),
('WhatsApp', 'https://wa.me/5574999999999'),
('YouTube', 'https://youtube.com/@emicleitonrubem')
ON CONFLICT DO NOTHING;

-- Dados iniciais para site_conteudo (estrutura chave-valor)
INSERT INTO site_conteudo (secao, chave, valor) VALUES 
('cabecalho', 'titulo', 'Liberdade & Desenvolvimento'),
('cabecalho', 'subtitulo', 'Vereador Emicleiton Rubem da Conceição'),
('cabecalho', 'cidade', 'Monte Santo - BA'),
('cabecalho', 'slogan', 'Trabalhando com transparência e dedicação'),

('biografia', 'titulo', 'Sobre o Vereador'),
('biografia', 'conteudo', 'Nascido em Monte Santo, Emicleiton Rubem da Conceição é um vereador comprometido com o desenvolvimento de sua cidade. Com experiência em gestão pública, trabalha incansavelmente pelos cidadãos montessantenses.'),
('biografia', 'foto_url', ''),

('mandato', 'periodo', '2025-2028'),
('mandato', 'cargo', 'Vereador'),
('mandato', 'resumo', 'Primeiro mandato focado em transparência e desenvolvimento'),
('mandato', 'status', 'Em exercício'),

('contato', 'telefone', '+55 75 998264065'),
('contato', 'email', 'gabinete.emicleiton@gmail.com'),
('contato', 'endereco', 'Câmara Municipal de Monte Santo'),
('contato', 'horario', 'Segunda a Sexta: 8h às 17h'),

('redes_sociais', 'facebook', '#'),
('redes_sociais', 'instagram', 'https://instagram.com/emicleitonemys'),
('redes_sociais', 'whatsapp', 'https://wa.me/5575998264065')
ON CONFLICT DO NOTHING;