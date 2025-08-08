// painel_auto_save.js - Sistema de salvamento automático usando Supabase

// Importar cliente Supabase - URL CORRIGIDA
const SUPABASE_URL = 'https://qirsmhgmkcvbidipnsnw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcnNtaGdta2N2YmlkaXBuc253Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzM4MDUsImV4cCI6MjA2ODk0OTgwNX0.W0JZkkw_2uOPSHsjYthUcbiaVXKCrO2asm96InPwmDc';

// Função para salvar dados na tabela específica do Supabase
async function salvarDadosTabela(tabela, campos) {
  const dados = {};
  campos.forEach(id => {
    const el = document.getElementById(id);
    if (el) dados[id] = el.value;
  });

  try {
    // Primeiro, limpar dados existentes da tabela
    const deleteResponse = await fetch(`${SUPABASE_URL}/rest/v1/${tabela}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      }
    });

    // Depois, inserir novos dados
    const insertResponse = await fetch(`${SUPABASE_URL}/rest/v1/${tabela}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(dados)
    });

    if (insertResponse.ok) {
      const result = await insertResponse.json();
      alert(tabela + ' salvo com sucesso!');
      console.log('✅ Dados salvos:', result);
      
      // Recarregar o site público automaticamente
      setTimeout(() => {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ action: 'reload' }, '*');
        }
      }, 1000);
      
    } else {
      const error = await insertResponse.text();
      alert('Erro ao salvar ' + tabela + ': ' + error);
      console.error('❌ Erro ao salvar:', error);
    }
  } catch (error) {
    alert('Erro de conexão ao salvar ' + tabela);
    console.error('❌ Erro de conexão:', error);
  }
}

async function carregarDadosTabela(tabela, campos) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${tabela}?select=*`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        const dados = data[0]; // Pegar o primeiro registro
        campos.forEach(id => {
          const el = document.getElementById(id);
          if (el && dados[id] !== undefined) {
            el.value = dados[id] || '';
          }
        });
        console.log(`✅ Dados de ${tabela} carregados no formulário`);
      }
    }
  } catch (error) {
    console.error(`❌ Erro ao carregar dados de ${tabela}:`, error);
  }
}

// Função para criar um novo projeto
async function adicionarProjeto() {
  const titulo = document.getElementById('titulo_projeto')?.value;
  const descricao = document.getElementById('descricao_projeto')?.value;
  const categoria = document.getElementById('categoria_projeto')?.value || 'geral';
  
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

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/projetos`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(novoProjeto)
    });

    if (response.ok) {
      alert('Projeto adicionado com sucesso!');
      document.getElementById('titulo_projeto').value = '';
      document.getElementById('descricao_projeto').value = '';
      console.log('✅ Projeto adicionado com sucesso');
    }
  } catch (error) {
    alert('Erro ao adicionar projeto');
    console.error('❌ Erro:', error);
  }
}

// Event listeners para salvar dados
document.addEventListener('DOMContentLoaded', () => {
  console.log('🔄 Carregando dados existentes no painel...');
  
  // Carregar dados das tabelas
  setTimeout(() => {
    carregarDadosTabela('cabecalho', ['titulo', 'subtitulo', 'cidade', 'slogan', 'whatsapp']);
    carregarDadosTabela('biografia', ['titulo', 'conteudo', 'foto_url']);
  }, 1000);

  // Adicionar event listeners para botões de salvar
  const btnSalvarCabecalho = document.getElementById('btnSalvarCabecalho');
  if (btnSalvarCabecalho) {
    btnSalvarCabecalho.addEventListener('click', () => {
      salvarDadosTabela('cabecalho', ['titulo', 'subtitulo', 'cidade', 'slogan', 'whatsapp']);
    });
  }

  const btnSalvarBiografia = document.getElementById('btnSalvarBiografia');
  if (btnSalvarBiografia) {
    btnSalvarBiografia.addEventListener('click', () => {
      salvarDadosTabela('biografia', ['titulo', 'conteudo', 'foto_url']);
    });
  }

  const btnSalvarProjeto = document.getElementById('btnSalvarProjeto');
  if (btnSalvarProjeto) {
    btnSalvarProjeto.addEventListener('click', () => {
      adicionarProjeto();
    });
  }

  const btnSalvarMandato = document.getElementById('btnSalvarMandato');
  if (btnSalvarMandato) {
    btnSalvarMandato.addEventListener('click', () => {
      salvarDadosTabela('mandatos', ['periodo', 'cargo', 'resumo', 'status']);
    });
  }
});