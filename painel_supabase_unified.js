// ✅ SISTEMA UNIFICADO SUPABASE - Painel Administrativo
// Conecta o painel ao Supabase usando estrutura de site_config (secao, chave, valor)

const SUPABASE_URL = 'https://qirsmhgmkcvbidipnsnw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcnNtaGdta2N2YmlkaXBuc253Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzM4MDUsImV4cCI6MjA2ODk0OTgwNX0.W0JZkkw_2uOPSHsjYthUcbiaVXKCrO2asm96InPwmDc';
const SUPABASE_TABLE = 'site_conteudo';

const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json'
};

// 🔁 Salva automaticamente as seções (ex: cabecalho, biografia, projetos...)
async function salvarSecao(secao, conteudo) {
    try {
        console.log(`💾 Salvando seção: ${secao}`, conteudo);

        // Primeiro, limpar dados existentes da seção
        await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}?secao=eq.${secao}`, {
            method: 'DELETE',
            headers: headers
        });

        // Construir conteúdo HTML estruturado
        let conteudoHtml = '';
        for (const [chave, valor] of Object.entries(conteudo)) {
            // Mapear chaves para tags mais semânticas
            const tag = chave === 'titulo' ? 'title' : 
                       chave === 'subtitulo' ? 'subtitle' :
                       chave === 'conteudo' ? 'content' : chave;
            conteudoHtml += `<${tag}>${valor}</${tag}>`;
        }

        // Inserir dados na estrutura correta
        const payload = {
            secao: secao,
            conteudo_html: conteudoHtml
        };

        await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });

        alert(`✅ ${secao} salvo com sucesso!`);
        console.log(`✅ Seção ${secao} salva no Supabase`);
        
        // Recarregar o site público automaticamente - MELHORADO
        setTimeout(() => {
            // Tentar recarregar o site principal de várias formas
            try {
                // Opção 1: Comunicação com janela pai (iframe)
                if (window.parent && window.parent !== window) {
                    window.parent.postMessage({ action: 'reload' }, '*');
                }
                
                // Opção 2: Recarregar aba específica (se for uma nova aba)
                if (window.opener) {
                    window.opener.location.reload();
                }
                
                // Opção 3: Forçar atualização usando localStorage para comunicação
                localStorage.setItem('supabase_update_trigger', Date.now().toString());
                
                console.log('🔄 Sinais de atualização enviados para o site principal');
                
            } catch (error) {
                console.log('ℹ️ Não foi possível atualizar automaticamente. Site deve ser recarregado manualmente.');
            }
        }, 1000);

    } catch (error) {
        alert(`❌ Erro ao salvar ${secao}: ${error.message}`);
        console.error('❌ Erro ao salvar:', error);
    }
}

// 📥 Busca dados de uma seção específica
async function buscarSecao(secao) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}?secao=eq.${secao}`, {
            headers: headers
        });
        
        const dados = await response.json();
        const resultado = {};
        
        dados.forEach((item) => {
            resultado[item.chave] = item.valor;
        });
        
        return resultado;
    } catch (error) {
        console.error(`❌ Erro ao buscar seção ${secao}:`, error);
        return {};
    }
}

// 📝 Preenche formulários com dados existentes
async function preencherFormulario(secao, campos) {
    try {
        const dados = await buscarSecao(secao);
        console.log(`📝 Preenchendo formulário ${secao}:`, dados);
        
        campos.forEach(campo => {
            const elemento = document.getElementById(campo);
            if (elemento && dados[campo]) {
                elemento.value = dados[campo];
            }
        });
    } catch (error) {
        console.error(`❌ Erro ao preencher formulário ${secao}:`, error);
    }
}

// 🎯 Funções específicas para cada seção
function salvarCabecalho() {
    const dados = {
        titulo: document.getElementById('titulo')?.value || '',
        subtitulo: document.getElementById('subtitulo')?.value || '',
        cidade: document.getElementById('cidade')?.value || '',
        slogan: document.getElementById('slogan')?.value || '',
        whatsapp: document.getElementById('whatsapp')?.value || ''
    };
    salvarSecao('cabecalho', dados);
}

function salvarBiografia() {
    const dados = {
        titulo: document.getElementById('bio_titulo')?.value || '',
        conteudo: document.getElementById('bio_conteudo')?.value || '',
        foto_url: document.getElementById('bio_foto')?.value || ''
    };
    salvarSecao('biografia', dados);
}

function salvarMandato() {
    const dados = {
        periodo: document.getElementById('mandato_periodo')?.value || '',
        cargo: document.getElementById('mandato_cargo')?.value || '',
        resumo: document.getElementById('mandato_resumo')?.value || '',
        status: document.getElementById('mandato_status')?.value || 'ativo'
    };
    salvarSecao('mandato', dados);
}

function adicionarProjeto() {
    const titulo = document.getElementById('projeto_titulo')?.value;
    const descricao = document.getElementById('projeto_descricao')?.value;
    const categoria = document.getElementById('projeto_categoria')?.value || 'geral';
    
    if (!titulo || !descricao) {
        alert('Por favor, preencha título e descrição do projeto');
        return;
    }

    const novoProjeto = {
        titulo: titulo,
        descricao: descricao,
        categoria: categoria,
        status: 'ativo',
        data_inicio: new Date().toISOString().split('T')[0],
        imagem_url: ''
    };

    // Usar a tabela projetos diretamente para novos projetos
    fetch(`${SUPABASE_URL}/rest/v1/projetos`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(novoProjeto)
    }).then(response => {
        if (response.ok) {
            alert('✅ Projeto adicionado com sucesso!');
            document.getElementById('projeto_titulo').value = '';
            document.getElementById('projeto_descricao').value = '';
            console.log('✅ Novo projeto adicionado');
        }
    }).catch(error => {
        alert('❌ Erro ao adicionar projeto');
        console.error('❌ Erro:', error);
    });
}

// 🚀 Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Sistema Supabase Unificado carregado');
    
    // Carregar dados existentes nos formulários
    setTimeout(() => {
        preencherFormulario('cabecalho', ['titulo', 'subtitulo', 'cidade', 'slogan', 'whatsapp']);
        preencherFormulario('biografia', ['bio_titulo', 'bio_conteudo', 'bio_foto']);
        preencherFormulario('mandato', ['mandato_periodo', 'mandato_cargo', 'mandato_resumo', 'mandato_status']);
    }, 1000);

    // Adicionar event listeners para botões de salvar
    const setupButton = (id, callback) => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', callback);
            console.log(`✅ Event listener adicionado para ${id}`);
        }
    };

    setupButton('btnSalvarCabecalho', salvarCabecalho);
    setupButton('btnSalvarBiografia', salvarBiografia);
    setupButton('btnSalvarMandato', salvarMandato);
    setupButton('btnAdicionarProjeto', adicionarProjeto);
});

// Funções globais para acesso direto
window.salvarCabecalho = salvarCabecalho;
window.salvarBiografia = salvarBiografia;
window.salvarMandato = salvarMandato;
window.adicionarProjeto = adicionarProjeto;
window.salvarSecao = salvarSecao;
window.buscarSecao = buscarSecao;