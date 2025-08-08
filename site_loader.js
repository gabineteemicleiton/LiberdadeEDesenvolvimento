// site_loader.js

const API_BASE_URL = 'http://localhost:5001/api';

async function fetchFromAPI(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error(`Erro ao buscar dados de ${endpoint}:`, error);
    return null;
  }
}

async function carregarDados() {
  console.log('🔄 Carregando dados do site...');
  
  // CABECALHO
  const cabecalho = await fetchFromAPI('/cabecalho');
  if (cabecalho) {
    const titulo = document.getElementById('site_titulo');
    if (titulo) titulo.innerText = cabecalho.titulo || '';
    
    const subtitulo = document.getElementById('site_subtitulo');
    if (subtitulo) subtitulo.innerText = cabecalho.subtitulo || '';
    
    const slogan = document.getElementById('site_slogan');
    if (slogan) slogan.innerText = cabecalho.slogan || '';
    
    const logo = document.getElementById('site_logo');
    if (logo) logo.src = cabecalho.logo_url || '';
    
    const whatsapp = document.getElementById('site_whatsapp');
    if (whatsapp) whatsapp.innerText = cabecalho.whatsapp || '';
    
    const cidade = document.getElementById('site_cidade');
    if (cidade) cidade.innerText = cabecalho.cidade || '';
    
    console.log('✅ Dados do cabeçalho carregados!');
  } else {
    console.log('⚠️ Nenhum dado de cabeçalho encontrado');
  }

  // BIOGRAFIA
  const bio = await fetchFromAPI('/biografia');
  if (bio) {
    const bioTitulo = document.getElementById('site_bio_titulo');
    if (bioTitulo) bioTitulo.innerText = bio.titulo || '';
    
    const bioConteudo = document.getElementById('site_bio_conteudo');
    if (bioConteudo) bioConteudo.innerText = bio.conteudo || '';
    
    const bioFoto = document.getElementById('site_bio_foto');
    if (bioFoto) bioFoto.src = bio.foto_url || '';
    
    console.log('✅ Dados da biografia carregados!');
  } else {
    console.log('⚠️ Nenhum dado de biografia encontrado');
  }

  // MANDATO ATUAL
  const mandatos = await fetchFromAPI('/mandatos');
  const mandatoAtual = mandatos && mandatos.find(m => m.status === 'Atual');
  if (mandatoAtual) {
    const periodo = document.getElementById('site_mandato_periodo');
    if (periodo) periodo.innerText = mandatoAtual.periodo || '';
    
    const cargo = document.getElementById('site_mandato_cargo');
    if (cargo) cargo.innerText = mandatoAtual.cargo || '';
    
    const texto = document.getElementById('site_mandato_texto');
    if (texto) texto.innerText = mandatoAtual.resumo || '';
    
    console.log('✅ Dados do mandato carregados!');
  } else {
    console.log('⚠️ Nenhum mandato atual encontrado');
  }

  // PROJETOS
  const projetos = await fetchFromAPI('/projetos');
  const container = document.getElementById('site_projetos');
  if (container && projetos && projetos.length > 0) {
    container.innerHTML = projetos.map(p => `
      <div class='projeto'>
        <h3>${p.titulo}</h3>
        <p>${p.descricao}</p>
        <small>${p.status} - ${p.data_inicio || ''}</small>
      </div>
    `).join('');
    console.log('✅ Projetos carregados!');
  } else {
    console.log('⚠️ Nenhum projeto encontrado');
  }
  
  console.log('🏁 Carregamento de dados concluído!');
}

window.addEventListener('DOMContentLoaded', carregarDados);