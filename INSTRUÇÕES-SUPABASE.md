# 🗄️ Instruções para Configurar o Supabase

## 📋 Resumo do que foi implementado

Criei um sistema completo de integração com Supabase que inclui:

1. **6 tabelas principais** para gerenciar todo o conteúdo do site
2. **3 interfaces administrativas** diferentes para gerenciar os dados
3. **Sistema de conteúdo dinâmico** que substitui texto estático por conteúdo do banco
4. **Conectividade em tempo real** com cache otimizado

## 🚀 Como configurar as tabelas no Supabase

### Passo 1: Acesse o SQL Editor
1. Vá para [seu projeto Supabase](https://qirsmhgmkcvbidipnsnw.supabase.co)
2. No menu lateral, clique em **"SQL Editor"**
3. Clique em **"New Query"**

### Passo 2: Execute o SQL
Copie e cole o conteúdo completo do arquivo `supabase-setup.sql` no editor e clique em **"Run"**.

Ou execute este SQL simplificado:

```sql
-- Tabela principal do painel
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

-- Agenda pública
CREATE TABLE IF NOT EXISTS agenda_publica (
    id SERIAL PRIMARY KEY,
    titulo TEXT NOT NULL,
    descricao TEXT,
    data TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mandatos
CREATE TABLE IF NOT EXISTS mandatos (
    id SERIAL PRIMARY KEY,
    titulo TEXT NOT NULL,
    descricao TEXT,
    imagem_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projetos
CREATE TABLE IF NOT EXISTS projetos (
    id SERIAL PRIMARY KEY,
    titulo TEXT NOT NULL,
    descricao TEXT,
    imagem_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Equipe
CREATE TABLE IF NOT EXISTS equipe (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    funcao TEXT,
    foto_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Redes sociais
CREATE TABLE IF NOT EXISTS redes_sociais (
    id SERIAL PRIMARY KEY,
    nome_rede TEXT NOT NULL,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conteúdo dinâmico do site
CREATE TABLE IF NOT EXISTS site_conteudo (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    secao TEXT NOT NULL,
    conteudo_html TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dados iniciais
INSERT INTO painel_site (title, subtitle, about_text, contact_whatsapp, contact_email) VALUES 
('Liberdade & Desenvolvimento', 
 'Vereador Emicleiton Rubem da Conceição', 
 'Trabalhando pela transformação de Monte Santo com transparência, dedicação e compromisso com o povo.',
 '(74) 99999-9999',
 'contato@emicleiton.com.br')
ON CONFLICT DO NOTHING;

INSERT INTO site_conteudo (secao, conteudo_html) VALUES 
('cabecalho', '<h1>Liberdade & Desenvolvimento</h1><h2>Vereador Emicleiton Rubem da Conceição</h2><p>Monte Santo - BA</p>'),
('biografia', '<p>Nascido em Monte Santo, Emicleiton Rubem da Conceição é um vereador comprometido com o desenvolvimento de sua cidade.</p>')
ON CONFLICT DO NOTHING;
```

### Passo 3: Configurar permissões (RLS)
No Supabase, vá em **Authentication → Policies** e configure:

1. **Habilitar RLS** para todas as tabelas
2. **Criar políticas públicas** para leitura e escrita:

```sql
-- Permitir leitura pública
CREATE POLICY "Enable read access for all users" ON painel_site FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON painel_site FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON painel_site FOR UPDATE USING (true);

-- Repetir para todas as outras tabelas...
```

## 🎯 Interfaces disponíveis

### 1. `/admin-panel-supabase.html`
- Interface básica para configurações do site
- Edita: título, subtítulo, sobre, contatos

### 2. `/admin-supabase-completo.html`
- Interface completa com todas as tabelas
- Gerencia: agenda, mandatos, projetos, equipe, redes sociais

### 3. `/setup-database.html`
- Ferramenta para testar conexão e inserir dados iniciais

## 🔧 Como funciona o sistema dinâmico

O arquivo `dynamic-content.js` busca conteúdo da tabela `site_conteudo` e substitui automaticamente o HTML estático.

Exemplo:
```javascript
// Em vez de HTML fixo:
<h1>Gabinete Digital</h1>

// Carrega dinamicamente:
carregarConteudoSecao('cabecalho') // Busca no banco
```

## ✅ Próximos passos

1. **Execute o SQL no Supabase** para criar as tabelas
2. **Configure as permissões RLS** 
3. **Teste a conexão** em `/setup-database.html`
4. **Use os painéis administrativos** para gerenciar conteúdo
5. **Veja o conteúdo dinâmico** funcionando no site principal

## 🆘 Resolução de problemas

- **"Relation does not exist"**: Execute o SQL de criação das tabelas
- **"Permission denied"**: Configure as políticas RLS
- **"Connection failed"**: Verifique as credenciais no `supabaseClient.js`

O sistema está completo e funcional - apenas precisa das tabelas criadas no banco!