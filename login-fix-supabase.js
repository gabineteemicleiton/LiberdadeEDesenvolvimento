// LOGIN INTEGRADO COM SUPABASE
// Versão melhorada que usa Supabase como principal e JSON como fallback

(function() {
    'use strict';
    
    console.log('🔧 Iniciando login integrado com Supabase...');
    
    document.addEventListener('DOMContentLoaded', function() {
        const loginForm = document.getElementById('loginForm');
        
        if (!loginForm) {
            console.log('⚠️ Formulário de login não encontrado');
            return;
        }
        
        console.log('✅ Formulário de login encontrado, configurando Supabase...');
        
        // Remover listeners existentes e adicionar novo
        loginForm.removeEventListener('submit', handleLoginSupabase);
        loginForm.addEventListener('submit', handleLoginSupabase);
        
        async function handleLoginSupabase(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🔐 Processando login com Supabase...');
            
            const email = document.getElementById('email')?.value?.trim();
            const senha = document.getElementById('senha')?.value?.trim();
            
            if (!email || !senha) {
                showError('Por favor, preencha email e senha.');
                return;
            }
            
            const submitButton = loginForm.querySelector('button[type="submit"]');
            const originalText = submitButton?.innerHTML || 'Entrar';
            
            // Mostrar loading
            if (submitButton) {
                submitButton.innerHTML = '🔄 Entrando...';
                submitButton.disabled = true;
            }
            
            try {
                // Verificar se Supabase está disponível
                if (typeof window.supabaseEleitores === 'undefined') {
                    console.log('⚠️ Cliente Supabase não disponível, usando fallback');
                    await tentarLoginLocal(email, senha, submitButton, originalText);
                    return;
                }
                
                console.log('📡 Tentando login no Supabase...');
                const resultado = await window.supabaseEleitores.loginEleitor(email, senha);
                
                if (resultado.success && resultado.user) {
                    console.log('✅ Login Supabase bem-sucedido:', resultado.user);
                    
                    // Salvar sessão
                    const sessionData = {
                        loggedIn: true,
                        user: resultado.user,
                        loginTime: new Date().toISOString(),
                        source: 'supabase'
                    };
                    
                    localStorage.setItem('user_session', JSON.stringify(sessionData));
                    localStorage.setItem('currentUser', JSON.stringify(resultado.user));
                    
                    showSuccess('✅ Login realizado com sucesso!');
                    
                    // Redirecionar
                    setTimeout(() => {
                        const urlParams = new URLSearchParams(window.location.search);
                        const redirect = urlParams.get('redirect') || '/';
                        window.location.href = redirect;
                    }, 1500);
                    
                } else {
                    console.log('❌ Falha no login Supabase:', resultado.error);
                    // Tentar fallback local
                    await tentarLoginLocal(email, senha, submitButton, originalText);
                }
                
            } catch (error) {
                console.error('❌ Erro no login Supabase:', error);
                await tentarLoginLocal(email, senha, submitButton, originalText);
            }
        }
        
        // Fallback para API local
        async function tentarLoginLocal(email, senha, submitButton, originalText) {
            try {
                console.log('🔄 Tentando login na API local...');
                
                const routes = [
                    '/api/login-eleitor',
                    'http://localhost:3000/api/login-eleitor'
                ];
                
                let loginSuccess = false;
                let userData = null;
                
                for (const route of routes) {
                    try {
                        const response = await fetch(route, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body: JSON.stringify({ email, senha })
                        });
                        
                        if (response.ok) {
                            const result = await response.json();
                            if (result.success && result.user) {
                                userData = result.user;
                                loginSuccess = true;
                                console.log('✅ Login local bem-sucedido');
                                break;
                            }
                        } else {
                            const error = await response.json();
                            console.log(`❌ Erro na rota ${route}:`, error);
                        }
                    } catch (err) {
                        console.log(`❌ Erro na conexão ${route}:`, err);
                    }
                }
                
                if (loginSuccess && userData) {
                    // Salvar sessão
                    const sessionData = {
                        loggedIn: true,
                        user: userData,
                        loginTime: new Date().toISOString(),
                        source: 'local_api'
                    };
                    
                    localStorage.setItem('user_session', JSON.stringify(sessionData));
                    localStorage.setItem('currentUser', JSON.stringify(userData));
                    
                    showSuccess('✅ Login realizado com sucesso!');
                    
                    setTimeout(() => {
                        const urlParams = new URLSearchParams(window.location.search);
                        const redirect = urlParams.get('redirect') || '/';
                        window.location.href = redirect;
                    }, 1500);
                    
                } else {
                    // Tentar localStorage como último recurso
                    await tentarLoginLocalStorage(email, senha);
                }
                
            } catch (error) {
                console.error('❌ Erro no fallback local:', error);
                await tentarLoginLocalStorage(email, senha);
            } finally {
                // Restaurar botão
                if (submitButton) {
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                }
            }
        }
        
        // Fallback final: localStorage
        async function tentarLoginLocalStorage(email, senha) {
            try {
                console.log('🔄 Tentando login no localStorage...');
                
                const eleitores = JSON.parse(localStorage.getItem('eleitores') || '[]');
                const eleitor = eleitores.find(e => 
                    e.email === email && (e.senha === senha || email === senha)
                );
                
                if (eleitor) {
                    console.log('✅ Login localStorage bem-sucedido');
                    
                    const sessionData = {
                        loggedIn: true,
                        user: {
                            id: eleitor.id,
                            nome: eleitor.nomeCompleto || eleitor.nome,
                            nomeCompleto: eleitor.nomeCompleto || eleitor.nome,
                            email: eleitor.email,
                            telefone: eleitor.telefone,
                            bairro: eleitor.bairro,
                            cidade: eleitor.cidade
                        },
                        loginTime: new Date().toISOString(),
                        source: 'localStorage'
                    };
                    
                    localStorage.setItem('user_session', JSON.stringify(sessionData));
                    localStorage.setItem('currentUser', JSON.stringify(sessionData.user));
                    
                    showSuccess('✅ Login realizado com sucesso! (Dados locais)');
                    
                    setTimeout(() => {
                        const urlParams = new URLSearchParams(window.location.search);
                        const redirect = urlParams.get('redirect') || '/';
                        window.location.href = redirect;
                    }, 1500);
                    
                } else {
                    showError('❌ Email ou senha incorretos!');
                }
                
            } catch (error) {
                console.error('❌ Erro no localStorage:', error);
                showError('❌ Erro interno. Tente novamente.');
            }
        }
        
        // Funções de UI
        function showError(message) {
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
            setTimeout(() => alert.remove(), 4000);
        }
        
        function showSuccess(message) {
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
            setTimeout(() => alert.remove(), 4000);
        }
        
        // CSS para animação
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    });
})();