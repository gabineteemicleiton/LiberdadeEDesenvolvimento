// Correção do sistema de login para usar API do servidor
(function() {
    'use strict';
    
    console.log('🔐 Iniciando correção do sistema de login...');
    
    // Aguardar DOM carregar
    document.addEventListener('DOMContentLoaded', function() {
        const loginForm = document.getElementById('loginForm');
        
        if (!loginForm) {
            console.log('⚠️ Formulário de login não encontrado');
            return;
        }
        
        console.log('✅ Formulário de login encontrado, configurando...');
        
        // Remover listeners existentes e adicionar novo
        loginForm.removeEventListener('submit', handleLogin);
        loginForm.addEventListener('submit', handleLogin);
        
        async function handleLogin(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🔐 Processando login...');
            
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
                console.log('📡 Enviando dados de login para API...');
                
                // Tentar múltiplas rotas de login
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
                                console.log('✅ Login bem-sucedido via API:', route);
                                break;
                            }
                        } else {
                            const errorData = await response.json();
                            console.warn(`⚠️ Erro na rota ${route}:`, errorData.error);
                        }
                    } catch (err) {
                        console.warn(`⚠️ Falha na rota ${route}:`, err.message);
                    }
                }
                
                // Se API não funcionou, tentar localStorage como fallback
                if (!loginSuccess) {
                    console.log('🔄 Tentando login via localStorage...');
                    
                    const eleitores = JSON.parse(localStorage.getItem('eleitores') || '[]');
                    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                    
                    // Buscar em ambas as fontes
                    let user = eleitores.find(e => e.email === email && (e.senha === senha || e.email === senha));
                    if (!user) {
                        user = registeredUsers.find(u => u.email === email && (u.senha === senha || u.email === senha));
                    }
                    
                    if (user) {
                        userData = user;
                        loginSuccess = true;
                        console.log('✅ Login bem-sucedido via localStorage');
                    }
                }
                
                if (loginSuccess && userData) {
                    // Salvar sessão
                    sessionStorage.setItem('userLoggedIn', 'true');
                    sessionStorage.setItem('userName', userData.nome || userData.nomeCompleto);
                    sessionStorage.setItem('userEmail', userData.email);
                    
                    // Sessão completa
                    const sessionData = {
                        userId: userData.id,
                        nomeCompleto: userData.nome || userData.nomeCompleto,
                        telefone: userData.telefone,
                        bairro: userData.bairro,
                        email: userData.email,
                        isLoggedIn: true,
                        loginTime: new Date().toISOString()
                    };
                    
                    sessionStorage.setItem('userSession', JSON.stringify(sessionData));
                    
                    // Sucesso
                    if (submitButton) {
                        submitButton.innerHTML = '✅ Sucesso!';
                        submitButton.style.background = '#16a34a';
                    }
                    
                    showSuccess(`Bem-vindo(a), ${userData.nome || userData.nomeCompleto}!`);
                    
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                    
                } else {
                    throw new Error('Email ou senha incorretos!');
                }
                
            } catch (error) {
                console.error('❌ Erro no login:', error);
                
                showError(error.message || 'Erro no login. Tente novamente.');
                
                // Restaurar botão
                if (submitButton) {
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                    submitButton.style.background = '';
                }
            }
        }
        
        function showError(message) {
            // Remover alertas existentes
            const existingAlert = document.querySelector('.login-alert');
            if (existingAlert) {
                existingAlert.remove();
            }
            
            // Criar alerta de erro
            const alert = document.createElement('div');
            alert.className = 'login-alert error';
            alert.style.cssText = `
                background: #fef2f2;
                color: #dc2626;
                padding: 12px;
                border-radius: 8px;
                border-left: 4px solid #dc2626;
                margin-bottom: 20px;
                font-size: 14px;
                font-weight: 500;
            `;
            alert.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
            
            loginForm.insertBefore(alert, loginForm.firstChild);
            
            // Remover após 5 segundos
            setTimeout(() => alert.remove(), 5000);
        }
        
        function showSuccess(message) {
            // Remover alertas existentes
            const existingAlert = document.querySelector('.login-alert');
            if (existingAlert) {
                existingAlert.remove();
            }
            
            // Criar alerta de sucesso
            const alert = document.createElement('div');
            alert.className = 'login-alert success';
            alert.style.cssText = `
                background: #f0fdf4;
                color: #16a34a;
                padding: 12px;
                border-radius: 8px;
                border-left: 4px solid #16a34a;
                margin-bottom: 20px;
                font-size: 14px;
                font-weight: 500;
            `;
            alert.innerHTML = `<i class="fas fa-check"></i> ${message}`;
            
            loginForm.insertBefore(alert, loginForm.firstChild);
        }
        
        console.log('✅ Sistema de login configurado');
    });
})();