// ✅ SCRIPT PARA O SITE PUXAR AUTOMATICAMENTE DADOS DO SUPABASE
// Substitua no seu site onde mostra: cabeçalho, biografia, projetos etc.
// Por esse código que busca os dados do Supabase e exibe na tela

const SUPABASE_URL = "https://qirsmhgmkcvbidipnsnw.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcnNtaGdta2N2YmlkaXBuc253Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzM4MDUsImV4cCI6MjA2ODk0OTgwNX0.W0JZkkw_2uOPSHsjYthUcbiaVXKCrO2asm96InPwmDc";
const SUPABASE_TABLE = "site_conteudo";

async function buscarSecao(secao) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}?secao=eq.${secao}`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    });
    const dados = await res.json();
    
    if (dados.length === 0) {
      console.log(`ℹ️ Nenhum dado encontrado para seção: ${secao}`);
      return {};
    }
    
    // Parsear o conteúdo HTML estruturado
    const conteudoHtml = dados[0].conteudo_html;
    const resultado = {};
    
    // Extrair dados usando regex para tags XML-like
    const extractTag = (tag) => {
      const regex = new RegExp(`<${tag}>(.*?)</${tag}>`, 'i');
      const match = conteudoHtml.match(regex);
      return match ? match[1] : '';
    };
    
    // Mapear tags comuns
    resultado.titulo = extractTag('title') || extractTag('titulo');
    resultado.subtitulo = extractTag('subtitle') || extractTag('subtitulo');
    resultado.cidade = extractTag('cidade');
    resultado.slogan = extractTag('slogan');
    resultado.conteudo = extractTag('content') || extractTag('conteudo');
    resultado.foto_url = extractTag('foto') || extractTag('foto_url');
    
    console.log(`✅ Dados extraídos da seção ${secao}:`, resultado);
    return resultado;
  } catch (error) {
    console.error(`❌ Erro ao buscar seção ${secao}:`, error);
    return {};
  }
}

// 👇 Preencher o cabeçalho
async function preencherCabecalho() {
  try {
    const cabecalho = await buscarSecao("cabecalho");
    console.log("📝 Dados do cabeçalho:", cabecalho);
    
    // Atualizar elementos do cabeçalho se existirem
    const elementos = {
      'site-title': cabecalho.titulo || 'Liberdade & Desenvolvimento',
      'site-subtitle': cabecalho.subtitulo || 'Vereador Emicleiton Rubem da Conceição',
      'site-cidade': cabecalho.cidade || 'Monte Santo - BA',
      'site-slogan': cabecalho.slogan || 'Trabalhando com transparência e dedicação',
      'header-subtitle': cabecalho.subtitulo || 'Emicleiton Rubem da Conceição',
      'header-cidade': cabecalho.cidade || 'Vereador de Monte Santo - BA'
    };

    Object.entries(elementos).forEach(([id, conteudo]) => {
      const elemento = document.getElementById(id);
      if (elemento) {
        if (id === 'site-header') {
          elemento.innerHTML = conteudo;
        } else {
          elemento.textContent = conteudo;
        }
        console.log(`✅ Atualizado ${id}`);
      }
    });
  } catch (error) {
    console.error("❌ Erro ao preencher cabeçalho:", error);
  }
}

// 👇 Preencher a biografia
async function preencherBiografia() {
  try {
    const bio = await buscarSecao("biografia");
    console.log("📝 Dados da biografia:", bio);
    
    const elementos = {
      'bio-titulo': bio.titulo || 'Emicleiton Rubem da Conceição',
      'bio-texto': bio.conteudo || `
        <p>Natural de Monte Santo, Emicleiton Rubem da Conceição é formado em Administração Pública e tem uma longa trajetória de serviços prestados à comunidade montesantense.</p>
        <p>Antes de assumir o mandato de vereador, atuou como líder comunitário, organizando eventos esportivos e culturais que promoveram a integração social e o desenvolvimento local.</p>
        <p>Eleito para seu primeiro mandato (2025-2028), destaca-se pela proximidade com a população e pelo compromisso com projetos focados no desenvolvimento econômico, melhoria da saúde pública e promoção do esporte como ferramenta de inclusão social.</p>
      `,
      'bio-foto': bio.foto_url || 'vereador.png'
    };

    Object.entries(elementos).forEach(([id, conteudo]) => {
      const elemento = document.getElementById(id);
      if (elemento) {
        if (id === 'bio-foto' && conteudo) {
          elemento.src = conteudo;
        } else if (id === 'bio-texto') {
          elemento.innerHTML = conteudo;
        } else {
          elemento.textContent = conteudo;
        }
        console.log(`✅ Atualizado ${id}`);
      }
    });
  } catch (error) {
    console.error("❌ Erro ao preencher biografia:", error);
  }
}

// 👇 Preencher mandato atual
async function preencherMandato() {
  try {
    const mandato = await buscarSecao("mandato");
    console.log("📝 Dados do mandato:", mandato);
    
    const elementos = {
      'mandato-periodo': mandato.periodo || '2025-2028',
      'mandato-cargo': mandato.cargo || 'Vereador',
      'mandato-resumo': mandato.resumo || 'Mandato focado em transparência e desenvolvimento',
      'mandato-status': mandato.status || 'Em exercício'
    };

    Object.entries(elementos).forEach(([id, conteudo]) => {
      const elemento = document.getElementById(id);
      if (elemento) {
        elemento.textContent = conteudo;
        console.log(`✅ Atualizado ${id}`);
      }
    });
  } catch (error) {
    console.error("❌ Erro ao preencher mandato:", error);
  }
}

// 👇 Carregar projetos da tabela projetos (mantém integração existente)
async function preencherProjetos() {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/projetos?select=*`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    });
    
    const projetos = await response.json();
    console.log("📝 Dados dos projetos:", projetos);
    
    const container = document.getElementById('projetos-lista') || document.getElementById('projetos-destaque');
    if (container && projetos.length > 0) {
      container.innerHTML = projetos.map(projeto => `
        <div class="projeto-card">
          <h3>${projeto.titulo}</h3>
          <p>${projeto.descricao}</p>
          <span class="projeto-status ${projeto.status}">${projeto.status}</span>
        </div>
      `).join('');
      console.log(`✅ ${projetos.length} projetos carregados`);
    }
  } catch (error) {
    console.error("❌ Erro ao carregar projetos:", error);
  }
}

// 👇 Sistema de atualização automática quando painel administrativo salva dados
function monitorarAtualizacoes() {
  // Escutar mudanças no localStorage (comunicação entre abas)
  window.addEventListener('storage', (event) => {
    if (event.key === 'supabase_update_trigger') {
      console.log('🔄 Atualização detectada do painel administrativo - recarregando dados...');
      setTimeout(() => {
        preencherCabecalho();
        preencherBiografia();
        preencherProjetos();
      }, 500);
    }
  });

  // Escutar mensagens de outras janelas/iframes
  window.addEventListener('message', (event) => {
    if (event.data && event.data.action === 'reload') {
      console.log('🔄 Mensagem de atualização recebida - recarregando dados...');
      setTimeout(() => {
        preencherCabecalho();
        preencherBiografia();
        preencherProjetos();
      }, 500);
    }
  });
}

// 👇 Inicialização automática - MANDATOS DESABILITADOS
window.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Sistema de carregamento unificado iniciado");
  
  // Inicializar sistema de monitoramento de atualizações
  monitorarAtualizacoes();
  
  // Chamar funções de preenchimento (exceto mandatos que usa HTML estático)
  setTimeout(() => {
    preencherCabecalho();
    preencherBiografia();
    // preencherMandato(); // DESABILITADO: manter cards HTML estáticos
    preencherProjetos();
  }, 500);
});

// Exportar funções para uso global
window.preencherCabecalho = preencherCabecalho;
window.preencherBiografia = preencherBiografia;
window.preencherMandato = preencherMandato;
window.preencherProjetos = preencherProjetos;
window.buscarSecao = buscarSecao;