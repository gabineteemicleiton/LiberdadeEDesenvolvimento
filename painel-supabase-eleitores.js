// PAINEL ADMINISTRATIVO - INTEGRAÇÃO SUPABASE ELEITORES
// Substitui a função carregarDadosEleitors para usar Supabase

(function() {
    'use strict';
    
    console.log('🔧 Carregando painel integrado com Supabase...');
    
    // Aguardar carregamento do DOM e do cliente Supabase
    function initPainelSupabase() {
        if (typeof window.supabaseEleitores === 'undefined') {
            console.log('⚠️ Cliente Supabase não disponível, tentando novamente...');
            setTimeout(initPainelSupabase, 1000);
            return;
        }
        
        console.log('✅ Cliente Supabase disponível, configurando painel...');
        
        // Sobrescrever função existente
        window.carregarDadosEleitors = carregarDadosEleitorsSupabase;
        window.carregarEleitoresCompleto = carregarDadosEleitorsSupabase;
        
        // Carregar dados automaticamente
        carregarDadosEleitorsSupabase();
        
        // Recarregar a cada 30 segundos
        setInterval(carregarDadosEleitorsSupabase, 30000);
        
        // Adicionar botão de migração
        adicionarBotaoMigracao();
        
        // Carregar estatísticas
        carregarEstatisticas();
    }
    
    // Função principal para carregar eleitores do Supabase
    async function carregarDadosEleitorsSupabase() {
        try {
            console.log('🔄 Carregando eleitores do Supabase...');
            
            const resultado = await window.supabaseEleitores.listarEleitores();
            
            if (resultado.success && resultado.data) {
                const eleitores = resultado.data;
                console.log(`✅ ${eleitores.length} eleitores carregados do Supabase`);
                
                // Sincronizar com localStorage para compatibilidade
                localStorage.setItem('eleitores', JSON.stringify(eleitores.map(e => ({
                    id: e.id,
                    nomeCompleto: e.nome_completo,
                    nome: e.nome_completo,
                    email: e.email,
                    telefone: e.telefone,
                    dataNascimento: e.data_nascimento,
                    bairro: e.bairro,
                    cidade: e.cidade,
                    genero: e.genero,
                    cpf: e.cpf,
                    zonaEleitoral: e.zona_eleitoral,
                    secao: e.secao,
                    dataCadastro: e.data_cadastro || e.created_at,
                    status: e.status,
                    presente: e.presente,
                    fonte: e.fonte,
                    lastLogin: e.ultimo_login
                })));
                
                // Renderizar na tabela
                renderizarTabelaEleitores(eleitores);
                
                // Atualizar estatísticas
                atualizarEstatisticasTabela(eleitores);
                
                // Mostrar origem dos dados
                mostrarOrigemDados('Supabase', resultado.source);
                
            } else {
                console.warn('⚠️ Erro ao carregar do Supabase, usando fallback');
                await carregarDadosLocal();
            }
            
        } catch (error) {
            console.error('❌ Erro ao carregar eleitores:', error);
            await carregarDadosLocal();
        }
    }
    
    // Fallback para dados locais
    async function carregarDadosLocal() {
        try {
            console.log('🔄 Carregando dados locais como fallback...');
            
            // Tentar API local primeiro
            try {
                const response = await fetch('/api/eleitores');
                if (response.ok) {
                    const { data: eleitores } = await response.json();
                    if (eleitores && eleitores.length > 0) {
                        console.log(`✅ ${eleitores.length} eleitores carregados da API local`);
                        renderizarTabelaEleitores(eleitores);
                        atualizarEstatisticasTabela(eleitores);
                        mostrarOrigemDados('API Local');
                        return;
                    }
                }
            } catch (apiError) {
                console.log('⚠️ API local não disponível');
            }
            
            // Usar localStorage como último recurso
            const eleitoresLocal = JSON.parse(localStorage.getItem('eleitores') || '[]');
            if (eleitoresLocal.length > 0) {
                console.log(`✅ ${eleitoresLocal.length} eleitores carregados do localStorage`);
                renderizarTabelaEleitores(eleitoresLocal);
                atualizarEstatisticasTabela(eleitoresLocal);
                mostrarOrigemDados('Armazenamento Local');
            } else {
                mostrarTabelaVazia();
            }
            
        } catch (error) {
            console.error('❌ Erro no fallback local:', error);
            mostrarTabelaVazia();
        }
    }
    
    // Renderizar tabela de eleitores
    function renderizarTabelaEleitores(eleitores) {
        const corpoTabela = document.getElementById('corpoTabela') || 
                           document.querySelector('#tabelaEleitores tbody') ||
                           document.querySelector('.tabela-eleitores tbody');
        
        if (!corpoTabela) {
            console.warn('⚠️ Tabela de eleitores não encontrada');
            return;
        }
        
        if (eleitores.length === 0) {
            mostrarTabelaVazia();
            return;
        }
        
        let html = '';
        eleitores.forEach((eleitor, index) => {
            const nome = eleitor.nome_completo || eleitor.nomeCompleto || eleitor.nome;
            const telefone = eleitor.telefone || 'Não informado';
            const email = eleitor.email || 'Não informado';
            const bairro = eleitor.bairro || 'Não informado';
            const cidade = eleitor.cidade || 'Monte Santo';
            const status = eleitor.status || 'ativo';
            const dataCadastro = eleitor.data_cadastro || eleitor.dataCadastro || eleitor.created_at;
            
            const statusClass = status === 'ativo' ? 'ativo' : 'inativo';
            const presencaIcon = eleitor.presente ? 'fas fa-check-circle' : 'far fa-circle';
            const presencaClass = eleitor.presente ? 'presente' : 'ausente';
            
            html += `
                <tr>
                    <td>${nome}</td>
                    <td>${telefone}</td>
                    <td>${email}</td>
                    <td>${bairro}</td>
                    <td>${cidade}</td>
                    <td>
                        <span class="status ${statusClass}">
                            ${status === 'ativo' ? 'Ativo' : 'Inativo'}
                        </span>
                    </td>
                    <td>
                        <span class="presenca ${presencaClass}" onclick="togglePresenca(${eleitor.id})">
                            <i class="${presencaIcon}"></i>
                            ${eleitor.presente ? 'Presente' : 'Ausente'}
                        </span>
                    </td>
                </tr>
            `;
        });
        
        corpoTabela.innerHTML = html;
        console.log('✅ Tabela renderizada com sucesso');
    }
    
    // Mostrar tabela vazia
    function mostrarTabelaVazia() {
        const corpoTabela = document.getElementById('corpoTabela') || 
                           document.querySelector('#tabelaEleitores tbody') ||
                           document.querySelector('.tabela-eleitores tbody');
        
        if (corpoTabela) {
            corpoTabela.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 2rem; color: #64748b;">
                        <i class="fas fa-users" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                        <strong>Nenhum eleitor encontrado</strong><br>
                        <small>Os eleitores cadastrados aparecerão aqui</small>
                    </td>
                </tr>
            `;
        }
    }
    
    // Atualizar estatísticas da tabela
    function atualizarEstatisticasTabela(eleitores) {
        const totalEleitores = eleitores.length;
        const presentes = eleitores.filter(e => e.presente).length;
        
        // Buscar elementos de estatísticas
        const estatTotal = document.querySelector('#totalEleitores') || 
                          document.querySelector('.stat-number');
        const estatPresentes = document.querySelector('#totalPresentes') || 
                              document.querySelector('.stat-presentes');
        
        if (estatTotal) estatTotal.textContent = totalEleitores;
        if (estatPresentes) estatPresentes.textContent = presentes;
        
        console.log(`📊 Estatísticas atualizadas: ${totalEleitores} total, ${presentes} presentes`);
    }
    
    // Carregar estatísticas detalhadas do Supabase
    async function carregarEstatisticas() {
        try {
            if (typeof window.supabaseEleitores === 'undefined') return;
            
            const stats = await window.supabaseEleitores.obterEstatisticas();
            const bairros = await window.supabaseEleitores.obterDistribuicaoBairros();
            
            // Atualizar elementos de estatísticas se existirem
            if (stats.total_eleitores) {
                const totalElement = document.querySelector('#totalEleitores') || 
                                   document.querySelector('.total-eleitores');
                if (totalElement) totalElement.textContent = stats.total_eleitores;
            }
            
            console.log('📊 Estatísticas detalhadas carregadas:', stats);
            
        } catch (error) {
            console.warn('⚠️ Erro ao carregar estatísticas:', error);
        }
    }
    
    // Mostrar origem dos dados
    function mostrarOrigemDados(origem, cache = false) {
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${origem === 'Supabase' ? '#10b981' : '#f59e0b'};
            color: white;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            z-index: 1000;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        `;
        indicator.innerHTML = `
            <i class="fas fa-${origem === 'Supabase' ? 'cloud' : 'database'}"></i>
            ${origem}${cache ? ' (Cache)' : ''}
        `;
        
        // Remover indicador anterior
        const existing = document.querySelector('.data-source-indicator');
        if (existing) existing.remove();
        
        indicator.className = 'data-source-indicator';
        document.body.appendChild(indicator);
        
        setTimeout(() => indicator.remove(), 5000);
    }
    
    // Adicionar botão de migração
    function adicionarBotaoMigracao() {
        const gestaoSection = document.querySelector('#gestao') || 
                             document.querySelector('.gestao-content');
        
        if (!gestaoSection) return;
        
        const migracaoButton = document.createElement('button');
        migracaoButton.innerHTML = `
            <i class="fas fa-cloud-upload-alt"></i>
            Migrar Dados para Supabase
        `;
        migracaoButton.style.cssText = `
            background: #3b82f6;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 14px;
            cursor: pointer;
            margin: 10px 0;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: background 0.3s ease;
        `;
        
        migracaoButton.addEventListener('click', async () => {
            if (!confirm('Migrar dados locais para o Supabase? Esta ação pode demorar alguns minutos.')) {
                return;
            }
            
            migracaoButton.disabled = true;
            migracaoButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Migrando...';
            
            try {
                const resultado = await window.supabaseEleitores.migrarDadosLocais();
                alert(`Migração concluída! ${resultado.migrados} eleitores migrados.`);
                carregarDadosEleitorsSupabase(); // Recarregar dados
            } catch (error) {
                alert('Erro na migração: ' + error.message);
            } finally {
                migracaoButton.disabled = false;
                migracaoButton.innerHTML = `
                    <i class="fas fa-cloud-upload-alt"></i>
                    Migrar Dados para Supabase
                `;
            }
        });
        
        migracaoButton.addEventListener('mouseenter', () => {
            migracaoButton.style.background = '#2563eb';
        });
        
        migracaoButton.addEventListener('mouseleave', () => {
            migracaoButton.style.background = '#3b82f6';
        });
        
        // Inserir no início da seção
        gestaoSection.insertBefore(migracaoButton, gestaoSection.firstChild);
    }
    
    // Função para toggle de presença (se necessário)
    window.togglePresenca = async function(eleitorId) {
        console.log('Toggle presença para eleitor:', eleitorId);
        // Esta função pode ser implementada para atualizar no Supabase
    };
    
    // Inicializar quando DOM carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPainelSupabase);
    } else {
        setTimeout(initPainelSupabase, 500);
    }
    
    console.log('✅ Painel Supabase para eleitores configurado');
})();