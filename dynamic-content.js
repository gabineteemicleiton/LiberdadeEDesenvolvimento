// Sistema de Conteúdo Dinâmico - Carrega conteúdo do Supabase automaticamente
import { supabase, getFromSupabase } from './supabaseClient.js';

// Cache do conteúdo para evitar múltiplas requisições
let contentCache = {};
let lastCacheUpdate = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

/**
 * Carrega conteúdo de uma seção específica do Supabase
 * @param {string} secao - Nome da seção (cabecalho, apresentacao, etc.)
 * @returns {Object} Dados da seção
 */
async function carregarConteudoSecao(secao) {
    try {
        // Verifica cache
        if (contentCache[secao] && (Date.now() - lastCacheUpdate) < CACHE_DURATION) {
            return contentCache[secao];
        }

        console.log(`Carregando conteúdo da seção: ${secao}`);
        
        const data = await getFromSupabase('site_conteudo', { secao });
        
        if (data && data.length > 0) {
            const conteudo = data[0];
            
            // Parse dos dados JSON se existir
            let dadosParsed = {};
            if (conteudo.dados) {
                try {
                    dadosParsed = JSON.parse(conteudo.dados);
                } catch (e) {
                    console.warn(`Erro ao fazer parse dos dados da seção ${secao}:`, e);
                }
            }
            
            const resultado = {
                id: conteudo.id,
                secao: conteudo.secao,
                conteudo_html: conteudo.conteudo_html,
                dados: dadosParsed,
                created_at: conteudo.created_at,
                updated_at: conteudo.updated_at
            };
            
            // Atualiza cache
            contentCache[secao] = resultado;
            lastCacheUpdate = Date.now();
            
            return resultado;
        }
        
        return null;
        
    } catch (error) {
        console.error(`Erro ao carregar conteúdo da seção ${secao}:`, error);
        return null;
    }
}

/**
 * Substitui o conteúdo HTML de um elemento com dados do Supabase
 * @param {string} elementId - ID do elemento HTML
 * @param {string} secao - Seção do conteúdo no Supabase
 * @param {Function} formatFunction - Função opcional para formatar o conteúdo
 */
async function substituirConteudo(elementId, secao, formatFunction = null) {
    try {
        const elemento = document.getElementById(elementId);
        if (!elemento) {
            console.warn(`Elemento ${elementId} não encontrado`);
            return;
        }

        const conteudo = await carregarConteudoSecao(secao);
        
        if (conteudo) {
            if (formatFunction && typeof formatFunction === 'function') {
                // Usa função customizada para formatar
                const htmlFormatado = formatFunction(conteudo);
                elemento.innerHTML = htmlFormatado;
            } else if (conteudo.conteudo_html) {
                // Usa HTML pré-formatado do banco
                elemento.innerHTML = conteudo.conteudo_html;
            } else {
                console.warn(`Conteúdo da seção ${secao} está vazio`);
            }
            
            console.log(`Conteúdo da seção ${secao} carregado em #${elementId}`);
        } else {
            console.warn(`Nenhum conteúdo encontrado para a seção: ${secao}`);
        }
        
    } catch (error) {
        console.error(`Erro ao substituir conteúdo do elemento ${elementId}:`, error);
    }
}

/**
 * Formata o conteúdo do cabeçalho
 */
function formatarCabecalho(conteudo) {
    const dados = conteudo.dados || {};
    return `
        <div class="brand">
            <h1>${dados.titulo || 'Liberdade & Desenvolvimento'}</h1>
            <h2>${dados.subtitulo || 'Vereador Emicleiton Rubem da Conceição'}</h2>
            <p>${dados.cidade || 'Monte Santo - BA'}</p>
            ${dados.slogan ? `<span class="slogan">${dados.slogan}</span>` : ''}
        </div>
    `;
}

/**
 * Formata o conteúdo da apresentação/biografia
 */
function formatarApresentacao(conteudo) {
    const dados = conteudo.dados || {};
    return `
        <div class="vereador-info">
            ${dados.foto ? `<img src="${dados.foto}" alt="${dados.nome}" class="foto-vereador">` : ''}
            <div class="texto-apresentacao">
                <h3 class="vereador-nome">${dados.nome || 'Emicleiton Rubem da Conceição'}</h3>
                <p class="biografia">${dados.biografia || 'Trabalhando pelo desenvolvimento de Monte Santo com transparência e dedicação.'}</p>
            </div>
        </div>
    `;
}

/**
 * Carrega e exibe projetos em destaque
 * @param {string} containerId - ID do container dos projetos
 * @param {number} limite - Número máximo de projetos a exibir
 */
async function carregarProjetosDestaque(containerId, limite = 3) {
    try {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Container ${containerId} não encontrado`);
            return;
        }

        console.log('Carregando projetos em destaque...');
        
        const projetos = await getFromSupabase('projetos');
        
        if (projetos && projetos.length > 0) {
            // Pega os projetos mais recentes (limitado)
            const projetosLimitados = projetos
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, limite);
            
            const htmlProjetos = projetosLimitados.map(projeto => `
                <div class="projeto-card">
                    ${projeto.imagem_url ? `<img src="${projeto.imagem_url}" alt="${projeto.titulo}">` : ''}
                    <h4>${projeto.titulo}</h4>
                    <p>${projeto.descricao}</p>
                    ${projeto.status ? `<span class="status status-${projeto.status}">${projeto.status}</span>` : ''}
                </div>
            `).join('');
            
            container.innerHTML = htmlProjetos;
            console.log(`${projetosLimitados.length} projetos carregados em #${containerId}`);
        } else {
            container.innerHTML = '<p>Nenhum projeto encontrado.</p>';
        }
        
    } catch (error) {
        console.error('Erro ao carregar projetos:', error);
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '<p>Erro ao carregar projetos. Verifique a conexão com o banco de dados.</p>';
        }
    }
}

/**
 * Carrega e exibe agenda pública
 * @param {string} containerId - ID do container da agenda
 * @param {number} limite - Número máximo de eventos a exibir
 */
async function carregarAgendaPublica(containerId, limite = 5) {
    try {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Container ${containerId} não encontrado`);
            return;
        }

        console.log('Carregando agenda pública...');
        
        const eventos = await getFromSupabase('agenda_publica');
        
        if (eventos && eventos.length > 0) {
            // Ordena por data e pega os próximos eventos
            const eventosOrdenados = eventos
                .sort((a, b) => new Date(a.data) - new Date(b.data))
                .slice(0, limite);
            
            const htmlEventos = eventosOrdenados.map(evento => {
                const dataFormatada = new Date(evento.data).toLocaleDateString('pt-BR');
                return `
                    <div class="evento-card">
                        <div class="evento-data">${dataFormatada}</div>
                        <h4>${evento.titulo}</h4>
                        <p>${evento.descricao}</p>
                    </div>
                `;
            }).join('');
            
            container.innerHTML = htmlEventos;
            console.log(`${eventosOrdenados.length} eventos carregados em #${containerId}`);
        } else {
            container.innerHTML = '<p>Nenhum evento na agenda.</p>';
        }
        
    } catch (error) {
        console.error('Erro ao carregar agenda:', error);
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '<p>Erro ao carregar agenda. Verifique a conexão com o banco de dados.</p>';
        }
    }
}

/**
 * Carrega e exibe mandatos anteriores
 * @param {string} containerId - ID do container dos mandatos
 */
async function carregarMandatos(containerId) {
    // DESABILITADO: Manter cards HTML estáticos
    console.log('Carregamento dinâmico de mandatos desabilitado - usando HTML estático');
    return;
    
    try {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Container ${containerId} não encontrado`);
            return;
        }

        console.log('Carregando mandatos...');
        
        const mandatos = await getFromSupabase('mandatos');
        
        if (mandatos && mandatos.length > 0) {
            const htmlMandatos = mandatos.map(mandato => `
                <div class="mandato-card">
                    ${mandato.imagem_url ? `<img src="${mandato.imagem_url}" alt="${mandato.titulo}">` : ''}
                    <h4>${mandato.titulo}</h4>
                    <p>${mandato.descricao}</p>
                </div>
            `).join('');
            
            container.innerHTML = htmlMandatos;
            console.log(`${mandatos.length} mandatos carregados em #${containerId}`);
        } else {
            container.innerHTML = '<p>Nenhum mandato cadastrado.</p>';
        }
        
    } catch (error) {
        console.error('Erro ao carregar mandatos:', error);
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '<p>Erro ao carregar mandatos. Verifique a conexão com o banco de dados.</p>';
        }
    }
}

/**
 * Inicializa o sistema de conteúdo dinâmico
 */
async function inicializarConteudoDinamico() {
    console.log('Inicializando sistema de conteúdo dinâmico...');
    
    try {
        // Carrega conteúdo das seções principais
        await Promise.all([
            // Cabeçalho
            substituirConteudo('site-header', 'cabecalho', formatarCabecalho),
            
            // Apresentação/Biografia
            substituirConteudo('vereador-apresentacao', 'apresentacao', formatarApresentacao),
            
            // Projetos em destaque
            carregarProjetosDestaque('projetos-destaque', 3),
            
            // Agenda pública
            carregarAgendaPublica('agenda-eventos', 5),
            
            // Mandatos anteriores
            carregarMandatos('mandatos-lista'),
            
            // Rodapé
            substituirConteudo('site-footer', 'rodape')
        ]);
        
        console.log('Sistema de conteúdo dinâmico inicializado com sucesso!');
        
    } catch (error) {
        console.error('Erro ao inicializar conteúdo dinâmico:', error);
    }
}

/**
 * Recarrega todo o conteúdo (útil após atualizações no painel)
 */
async function recarregarConteudo() {
    // Limpa cache
    contentCache = {};
    lastCacheUpdate = 0;
    
    // Reinicializa
    await inicializarConteudoDinamico();
}

/**
 * Verifica se há atualizações no conteúdo (polling)
 */
async function verificarAtualizacoes() {
    try {
        // Implementar verificação de última atualização
        // Por enquanto, apenas recarrega se o cache estiver expirado
        if ((Date.now() - lastCacheUpdate) > CACHE_DURATION) {
            await recarregarConteudo();
        }
    } catch (error) {
        console.error('Erro ao verificar atualizações:', error);
    }
}

// Exporta as funções principais
export {
    carregarConteudoSecao,
    substituirConteudo,
    carregarProjetosDestaque,
    carregarAgendaPublica,
    carregarMandatos,
    inicializarConteudoDinamico,
    recarregarConteudo,
    verificarAtualizacoes,
    formatarCabecalho,
    formatarApresentacao
};

// Auto-inicialização quando o DOM estiver pronto
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarConteudoDinamico);
    } else {
        inicializarConteudoDinamico();
    }
    
    // Verifica atualizações a cada 2 minutos
    setInterval(verificarAtualizacoes, 2 * 60 * 1000);
}