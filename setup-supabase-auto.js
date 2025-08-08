// Script para configurar Supabase automaticamente
const SUPABASE_URL = 'https://qirsmhgmkcvbidipnsnw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcnNtaGdta2N2YmlkaXBuc253Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzM4MDUsImV4cCI6MjA2ODk0OTgwNX0.W0JZkkw_2uOPSHsjYthUcbiaVXKCrO2asm96InPwmDc';

const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json'
};

async function setupSupabase() {
    console.log('🚀 Iniciando configuração do Supabase...');
    
    try {
        // 1. Testar conexão
        console.log('1️⃣ Testando conexão...');
        const testResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
            headers: headers
        });
        
        if (!testResponse.ok) {
            throw new Error('Erro na conexão com Supabase');
        }
        console.log('✅ Conexão estabelecida!');

        // 2. Verificar se tabela existe
        console.log('2️⃣ Verificando tabela site_conteudo...');
        const tableCheck = await fetch(`${SUPABASE_URL}/rest/v1/site_conteudo?limit=1`, {
            headers: headers
        });

        if (tableCheck.ok) {
            console.log('✅ Tabela site_conteudo já existe!');
            
            // 3. Inserir dados iniciais (se não existirem)
            await inserirDadosIniciais();
        } else {
            console.log('⚠️ Tabela não encontrada. Execute o SQL setup no dashboard do Supabase.');
            return false;
        }

        return true;
    } catch (error) {
        console.error('❌ Erro:', error);
        return false;
    }
}

async function inserirDadosIniciais() {
    console.log('3️⃣ Inserindo dados iniciais...');
    
    const dadosIniciais = [
        // Cabeçalho
        { secao: 'cabecalho', chave: 'titulo', valor: 'Liberdade & Desenvolvimento' },
        { secao: 'cabecalho', chave: 'subtitulo', valor: 'Vereador Emicleiton Rubem da Conceição' },
        { secao: 'cabecalho', chave: 'cidade', valor: 'Monte Santo - BA' },
        { secao: 'cabecalho', chave: 'slogan', valor: 'Trabalhando com transparência e dedicação' },

        // Biografia
        { secao: 'biografia', chave: 'titulo', valor: 'Sobre o Vereador' },
        { secao: 'biografia', chave: 'conteudo', valor: 'Eleito para seu primeiro mandato (2025-2028), Emicleiton Rubem da Conceição é um vereador comprometido com o desenvolvimento de Monte Santo. Natural da cidade, destaca-se pela proximidade com a população e pelo compromisso com projetos focados no desenvolvimento econômico, melhoria da saúde pública e promoção do esporte como ferramenta de inclusão social.' },
        { secao: 'biografia', chave: 'foto_url', valor: 'vereador.png' },

        // Mandato
        { secao: 'mandato', chave: 'periodo', valor: '2025-2028' },
        { secao: 'mandato', chave: 'cargo', valor: 'Vereador' },
        { secao: 'mandato', chave: 'resumo', valor: 'Primeiro mandato focado em transparência e desenvolvimento' },
        { secao: 'mandato', chave: 'status', valor: 'Em exercício' },

        // Contato
        { secao: 'contato', chave: 'telefone', valor: '+55 75 998264065' },
        { secao: 'contato', chave: 'email', valor: 'gabinete.emicleiton@gmail.com' },
        { secao: 'contato', chave: 'endereco', valor: 'Câmara Municipal de Monte Santo' },
        { secao: 'contato', chave: 'horario', valor: 'Segunda a Sexta: 8h às 17h' },

        // Redes Sociais
        { secao: 'redes_sociais', chave: 'facebook', valor: '#' },
        { secao: 'redes_sociais', chave: 'instagram', valor: 'https://instagram.com/emicleitonemys' },
        { secao: 'redes_sociais', chave: 'whatsapp', valor: 'https://wa.me/5575998264065' }
    ];

    for (const dado of dadosIniciais) {
        try {
            // Verificar se já existe
            const existeResponse = await fetch(
                `${SUPABASE_URL}/rest/v1/site_conteudo?secao=eq.${dado.secao}&chave=eq.${dado.chave}`,
                { headers: headers }
            );
            
            const existeData = await existeResponse.json();
            
            if (existeData.length === 0) {
                // Inserir se não existe
                const response = await fetch(`${SUPABASE_URL}/rest/v1/site_conteudo`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(dado)
                });

                if (response.ok) {
                    console.log(`✅ Inserido: ${dado.secao} - ${dado.chave}`);
                } else {
                    console.error(`❌ Erro ao inserir ${dado.secao}:`, await response.text());
                }
            } else {
                console.log(`ℹ️ Já existe: ${dado.secao} - ${dado.chave}`);
            }
        } catch (error) {
            console.error(`❌ Erro ao processar ${dado.secao}:`, error);
        }
    }
}

// Executar setup quando chamado
if (typeof window !== 'undefined') {
    window.setupSupabase = setupSupabase;
    window.inserirDadosIniciais = inserirDadosIniciais;
}

// Para Node.js
if (typeof module !== 'undefined') {
    module.exports = { setupSupabase, inserirDadosIniciais };
}

console.log('📋 Script de setup do Supabase carregado. Use setupSupabase() para executar.');