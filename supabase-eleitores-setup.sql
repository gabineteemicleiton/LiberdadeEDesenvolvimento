-- SETUP COMPLETO PARA ELEITORES NO SUPABASE
-- Execute este script no SQL Editor do Supabase Dashboard

-- Tabela para eleitores cadastrados
CREATE TABLE IF NOT EXISTS eleitores (
    id SERIAL PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    data_nascimento DATE,
    bairro VARCHAR(100),
    cidade VARCHAR(100) DEFAULT 'Monte Santo',
    genero VARCHAR(20),
    cpf VARCHAR(14),
    zona_eleitoral VARCHAR(10),
    secao VARCHAR(10),
    data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'ativo',
    presente BOOLEAN DEFAULT false,
    fonte VARCHAR(50) DEFAULT 'formulario_web',
    senha_hash VARCHAR(255), -- Para autenticação
    ultimo_login TIMESTAMP WITH TIME ZONE,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_eleitores_email ON eleitores(email);
CREATE INDEX IF NOT EXISTS idx_eleitores_cpf ON eleitores(cpf);
CREATE INDEX IF NOT EXISTS idx_eleitores_status ON eleitores(status);
CREATE INDEX IF NOT EXISTS idx_eleitores_bairro ON eleitores(bairro);
CREATE INDEX IF NOT EXISTS idx_eleitores_data_cadastro ON eleitores(data_cadastro DESC);

-- Políticas de segurança (RLS)
ALTER TABLE eleitores ENABLE ROW LEVEL SECURITY;

-- Permitir leitura para usuários autenticados (painel administrativo)
CREATE POLICY "Allow authenticated read" ON eleitores FOR SELECT USING (auth.role() = 'authenticated');

-- Permitir inserção para todos (cadastro público)
CREATE POLICY "Allow public insert" ON eleitores FOR INSERT WITH CHECK (true);

-- Permitir atualização para usuários autenticados (para login)
CREATE POLICY "Allow authenticated update" ON eleitores FOR UPDATE USING (auth.role() = 'authenticated');

-- Tabela para sessões de usuários (controle de login)
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    eleitor_id INTEGER REFERENCES eleitores(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ativo BOOLEAN DEFAULT true
);

-- Índices para sessões
CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_eleitor ON user_sessions(eleitor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON user_sessions(expires_at);

-- Política para sessões
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated access to sessions" ON user_sessions FOR ALL USING (auth.role() = 'authenticated');

-- Função para validar senha (usando MD5 simples por compatibilidade)
CREATE OR REPLACE FUNCTION validate_eleitor_password(email_input TEXT, senha_input TEXT)
RETURNS TABLE(
    eleitor_id INTEGER,
    nome_completo TEXT,
    email TEXT,
    telefone TEXT,
    bairro TEXT,
    cidade TEXT,
    data_cadastro TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.nome_completo,
        e.email,
        e.telefone,
        e.bairro,
        e.cidade,
        e.data_cadastro
    FROM eleitores e
    WHERE e.email = email_input 
    AND (e.senha_hash = MD5(senha_input) OR e.senha_hash IS NULL AND senha_input = e.email)
    AND e.ativo = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para registrar último login
CREATE OR REPLACE FUNCTION update_last_login(eleitor_id_input INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE eleitores 
    SET ultimo_login = NOW(), updated_at = NOW() 
    WHERE id = eleitor_id_input;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_eleitores_updated_at 
    BEFORE UPDATE ON eleitores 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Dados de teste (opcional - remover em produção)
INSERT INTO eleitores (nome_completo, email, telefone, data_nascimento, bairro, genero, senha_hash, fonte) VALUES 
('Admin Sistema', 'admin@sistema.com', '75999999999', '1990-01-01', 'Centro', 'Masculino', MD5('admin123'), 'sistema'),
('Usuário Teste', 'teste@email.com', '75988888888', '1985-05-15', 'Centro', 'Feminino', MD5('teste@email.com'), 'formulario_web')
ON CONFLICT (email) DO NOTHING;

-- View para estatísticas do painel
CREATE OR REPLACE VIEW eleitores_stats AS
SELECT 
    COUNT(*) as total_eleitores,
    COUNT(CASE WHEN status = 'ativo' THEN 1 END) as ativos,
    COUNT(CASE WHEN DATE(data_cadastro) = CURRENT_DATE THEN 1 END) as hoje,
    COUNT(CASE WHEN DATE(data_cadastro) >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as esta_semana,
    COUNT(CASE WHEN DATE(data_cadastro) >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as este_mes,
    COUNT(DISTINCT bairro) as total_bairros
FROM eleitores 
WHERE ativo = true;

-- View para distribuição por bairro
CREATE OR REPLACE VIEW eleitores_por_bairro AS
SELECT 
    bairro,
    COUNT(*) as total,
    COUNT(CASE WHEN status = 'ativo' THEN 1 END) as ativos,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentual
FROM eleitores 
WHERE ativo = true
GROUP BY bairro
ORDER BY total DESC;

-- Comentários nas tabelas para documentação
COMMENT ON TABLE eleitores IS 'Cadastro de eleitores do gabinete digital';
COMMENT ON COLUMN eleitores.nome_completo IS 'Nome completo do eleitor';
COMMENT ON COLUMN eleitores.email IS 'Email único para login';
COMMENT ON COLUMN eleitores.senha_hash IS 'Hash MD5 da senha para login';
COMMENT ON COLUMN eleitores.fonte IS 'Origem do cadastro (formulario_web, sistema, importacao)';
COMMENT ON COLUMN eleitores.presente IS 'Controle de presença em eventos';

COMMENT ON TABLE user_sessions IS 'Controle de sessões de login dos eleitores';
COMMENT ON FUNCTION validate_eleitor_password IS 'Valida credenciais de login do eleitor';
COMMENT ON FUNCTION update_last_login IS 'Atualiza timestamp do último login';