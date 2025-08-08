// CADASTRO INTEGRADO COM SUPABASE
// Versão melhorada que usa Supabase como principal e JSON como fallback

(function() {
    'use strict';
    
    console.log('🔧 Iniciando cadastro integrado com Supabase...');
    
    document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('cadastroForm');
        const submitButton = document.getElementById('submitButton');
        
        if (!form || !submitButton) {
            console.error('❌ Formulário ou botão não encontrado');
            return;
        }
        
        console.log('✅ Formulário encontrado, configurando evento Supabase...');
        
        // Remover listeners existentes
        form.removeEventListener('submit', handleSubmitSupabase);
        
        // Adicionar novo listener
        form.addEventListener('submit', handleSubmitSupabase);
        
        // Listener direto no botão
        submitButton.addEventListener('click', function(e) {
            console.log('🖱️ Botão clicado - tentando Supabase');
            if (form.checkValidity()) {
                e.preventDefault();
                handleSubmitSupabase(e);
            }
        });
        
        async function handleSubmitSupabase(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('📝 Processando cadastro com Supabase...');
            
            // Validar campos obrigatórios
            const requiredFields = ['nomeCompleto', 'email', 'telefone', 'dataNascimento', 'bairro', 'genero'];
            let isValid = true;
            
            for (const fieldId of requiredFields) {
                const field = document.getElementById(fieldId);
                if (!field || !field.value.trim()) {
                    console.error(`❌ Campo obrigatório vazio: ${fieldId}`);
                    field?.focus();
                    showError(`Por favor, preencha o campo: ${fieldId}`);
                    isValid = false;
                    break;
                }
            }
            
            if (!isValid) {
                return;
            }
            
            // Preparar dados
            const formData = {
                nomeCompleto: document.getElementById('nomeCompleto').value.trim(),
                email: document.getElementById('email').value.trim(),
                telefone: document.getElementById('telefone').value.trim(),
                dataNascimento: document.getElementById('dataNascimento').value,
                bairro: document.getElementById('bairro').value,
                cidade: document.getElementById('cidade').value.trim() || 'Monte Santo',
                genero: document.getElementById('genero').value,
                cpf: document.getElementById('cpf').value?.trim() || null,
                zonaEleitoral: document.getElementById('zonaEleitoral').value?.trim() || null,
                secao: document.getElementById('secao').value?.trim() || null
            };
            
            console.log('📤 Dados preparados para Supabase:', formData);
            
            // Mostrar loading
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<div class="loading"></div> Cadastrando...';
            submitButton.disabled = true;
            
            try {
                // Verificar se Supabase está disponível
                if (typeof window.supabaseEleitores === 'undefined') {
                    throw new Error('Cliente Supabase não carregado');
                }
                
                // Tentar cadastro no Supabase primeiro
                console.log('🔄 Tentando cadastro no Supabase...');
                const resultado = await window.supabaseEleitores.cadastrarEleitor(formData);
                
                if (resultado.success) {
                    console.log('✅ Cadastro realizado no Supabase:', resultado);
                    
                    // Fazer login automático
                    const loginResult = await window.supabaseEleitores.loginEleitor(
                        formData.email, 
                        formData.email // Senha padrão é o email
                    );
                    
                    if (loginResult.success) {
                        // Salvar sessão
                        localStorage.setItem('user_session', JSON.stringify({
                            loggedIn: true,
                            user: loginResult.user,
                            loginTime: new Date().toISOString(),
                            source: 'supabase'
                        }));
                        console.log('🔐 Login automático realizado');
                    }
                    
                    // Sucesso
                    showSuccess('✅ Cadastro realizado com sucesso! Você já está logado.');
                    
                    // Redirecionar após delay
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 2000);
                    
                } else {
                    // Erro no Supabase, tentar fallback
                    console.log('⚠️ Erro no Supabase, tentando fallback:', resultado.error);
                    await tentarFallbackLocal(formData);
                }
                
            } catch (error) {
                console.error('❌ Erro no cadastro Supabase:', error);
                await tentarFallbackLocal(formData);
            } finally {
                // Restaurar botão
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        }
        
        // Fallback para API local
        async function tentarFallbackLocal(formData) {
            console.log('🔄 Tentando fallback para API local...');
            
            try {
                const routes = [
                    '/api/cadastro-eleitor',
                    'http://localhost:3000/api/cadastro-eleitor'
                ];
                
                let sucesso = false;
                
                for (const route of routes) {
                    try {
                        const response = await fetch(route, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body: JSON.stringify({
                                ...formData,
                                id: Date.now(),
                                dataCadastro: new Date().toISOString(),
                                status: 'ativo',
                                presente: false
                            })
                        });
                        
                        if (response.ok) {
                            const result = await response.json();
                            if (result.success) {
                                console.log('✅ Cadastro salvo na API local');
                                sucesso = true;
                                
                                // Tentar login local também
                                await tentarLoginLocal(formData.email);
                                
                                showSuccess('✅ Cadastro realizado com sucesso! (Salvo localmente)');
                                setTimeout(() => {
                                    window.location.href = '/';
                                }, 2000);
                                break;
                            }
                        }
                    } catch (err) {
                        console.log(`❌ Erro na rota ${route}:`, err);
                    }
                }
                
                if (!sucesso) {
                    // Salvar no localStorage como último recurso
                    salvarLocalStorage(formData);
                    showSuccess('✅ Cadastro salvo localmente!');
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 2000);
                }
                
            } catch (error) {
                console.error('❌ Erro no fallback:', error);
                showError('❌ Erro ao cadastrar. Tente novamente.');
            }
        }
        
        // Login local fallback
        async function tentarLoginLocal(email) {
            try {
                const routes = [
                    '/api/login-eleitor',
                    'http://localhost:3000/api/login-eleitor'
                ];
                
                for (const route of routes) {
                    try {
                        const response = await fetch(route, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                email: email,
                                senha: email
                            })
                        });
                        
                        if (response.ok) {
                            const result = await response.json();
                            if (result.success && result.user) {
                                localStorage.setItem('user_session', JSON.stringify({
                                    loggedIn: true,
                                    user: result.user,
                                    loginTime: new Date().toISOString(),
                                    source: 'local_api'
                                }));
                                console.log('🔐 Login local realizado');
                                break;
                            }
                        }
                    } catch (err) {
                        console.log('❌ Erro no login local:', err);
                    }
                }
            } catch (error) {
                console.warn('⚠️ Não foi possível fazer login automático');
            }
        }
        
        // Salvar no localStorage
        function salvarLocalStorage(dados) {
            try {
                const eleitores = JSON.parse(localStorage.getItem('eleitores') || '[]');
                
                const existe = eleitores.find(e => e.email === dados.email);
                if (!existe) {
                    const novoEleitor = {
                        ...dados,
                        id: Date.now(),
                        dataCadastro: new Date().toISOString(),
                        status: 'ativo',
                        fonte: 'formulario_web_local'
                    };
                    eleitores.push(novoEleitor);
                    localStorage.setItem('eleitores', JSON.stringify(eleitores));
                    
                    // Login automático local
                    localStorage.setItem('user_session', JSON.stringify({
                        loggedIn: true,
                        user: novoEleitor,
                        loginTime: new Date().toISOString(),
                        source: 'localStorage'
                    }));
                    
                    console.log('💾 Dados salvos no localStorage');
                }
            } catch (error) {
                console.error('❌ Erro ao salvar localStorage:', error);
            }
        }
        
        // Funções de UI
        function showError(message) {
            // Remover alertas existentes
            const existingAlert = document.querySelector('.alert');
            if (existingAlert) existingAlert.remove();
            
            const alert = document.createElement('div');
            alert.className = 'alert alert-error';
            alert.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                ${message}
            `;
            alert.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ef4444;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 10000;
                font-size: 14px;
                max-width: 300px;
                animation: slideIn 0.3s ease;
            `;
            
            document.body.appendChild(alert);
            setTimeout(() => alert.remove(), 5000);
        }
        
        function showSuccess(message) {
            // Remover alertas existentes
            const existingAlert = document.querySelector('.alert');
            if (existingAlert) existingAlert.remove();
            
            const alert = document.createElement('div');
            alert.className = 'alert alert-success';
            alert.innerHTML = `
                <i class="fas fa-check-circle"></i>
                ${message}
            `;
            alert.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 10000;
                font-size: 14px;
                max-width: 300px;
                animation: slideIn 0.3s ease;
            `;
            
            document.body.appendChild(alert);
            setTimeout(() => alert.remove(), 5000);
        }
        
        // CSS para animação
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .loading {
                display: inline-block;
                width: 20px;
                height: 20px;
                border: 3px solid #ffffff;
                border-radius: 50%;
                border-top-color: transparent;
                animation: spin 1s ease-in-out infinite;
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    });
})();