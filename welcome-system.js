// Sistema de Boas-vindas após cadastro
(function() {
    'use strict';
    
    console.log('👋 Iniciando sistema de boas-vindas...');
    
    // Verificar se vem de cadastro com welcome=true
    function checkWelcomeStatus() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('welcome') === 'true') {
            console.log('🎉 Usuário vem de cadastro, verificando login...');
            
            // Verificar múltiplas formas de sessão
            const userLoggedIn = sessionStorage.getItem('userLoggedIn') === 'true';
            const userName = sessionStorage.getItem('userName');
            const userSession = JSON.parse(sessionStorage.getItem('userSession') || '{}');
            
            console.log('📋 Status de login:', {
                userLoggedIn,
                userName,
                userSession: !!userSession.nomeCompleto
            });
            
            if (userName || userSession.nomeCompleto) {
                const name = userName || userSession.nomeCompleto;
                
                // Mostrar boas-vindas
                setTimeout(() => {
                    // Criar modal de boas-vindas personalizado
                    const welcomeModal = document.createElement('div');
                    welcomeModal.innerHTML = `
                        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center;">
                            <div style="background: white; padding: 30px; border-radius: 15px; text-align: center; max-width: 400px; margin: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                                <div style="font-size: 48px; margin-bottom: 20px;">🎉</div>
                                <h2 style="color: #1e40af; margin-bottom: 15px; font-size: 24px;">Bem-vindo(a)!</h2>
                                <p style="color: #374151; margin-bottom: 20px; font-size: 16px;">
                                    <strong>${name}</strong>, seu cadastro foi realizado com sucesso!
                                </p>
                                <p style="color: #6b7280; margin-bottom: 25px; font-size: 14px;">
                                    Agora você pode aproveitar todos os recursos do Gabinete Digital.
                                </p>
                                <button onclick="this.parentElement.parentElement.remove()" style="background: #1e40af; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; cursor: pointer; font-weight: 600;">
                                    Começar a Explorar
                                </button>
                            </div>
                        </div>
                    `;
                    
                    document.body.appendChild(welcomeModal);
                    
                    // Atualizar header com nome do usuário
                    updateHeaderWithUser(name);
                    
                }, 1000);
                
                // Remover parâmetro da URL
                const url = new URL(window.location);
                url.searchParams.delete('welcome');
                window.history.replaceState({}, '', url);
                
                console.log('✅ Boas-vindas configuradas para:', name);
            } else {
                console.warn('⚠️ Usuário não encontrado na sessão');
            }
        }
    }
    
    // Atualizar header com informações do usuário
    function updateHeaderWithUser(userName) {
        // Procurar por área de login/cadastro no header
        const loginButtons = document.querySelectorAll('[href="login.html"], [href="cadastro.html"]');
        
        if (loginButtons.length > 0) {
            // Criar elemento de usuário logado
            const userElement = document.createElement('div');
            userElement.style.cssText = `
                display: flex;
                align-items: center;
                gap: 10px;
                background: linear-gradient(135deg, #1e40af, #3b82f6);
                color: white;
                padding: 8px 15px;
                border-radius: 25px;
                font-size: 14px;
                font-weight: 600;
                box-shadow: 0 2px 10px rgba(30, 64, 175, 0.3);
                border: 2px solid rgba(255,255,255,0.2);
            `;
            
            userElement.innerHTML = `
                <i class="fas fa-user-circle" style="font-size: 18px;"></i>
                <span>Olá, ${userName.split(' ')[0]}!</span>
                <button onclick="logoutUser()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; cursor: pointer; margin-left: 5px;">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            `;
            
            // Substituir primeiro botão de login/cadastro
            loginButtons[0].parentElement.replaceChild(userElement, loginButtons[0]);
            
            // Esconder outros botões de login/cadastro
            for (let i = 1; i < loginButtons.length; i++) {
                loginButtons[i].style.display = 'none';
            }
        }
    }
    
    // Função de logout global
    window.logoutUser = function() {
        // Limpar todas as sessões
        sessionStorage.removeItem('userLoggedIn');
        sessionStorage.removeItem('userName');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('userSession');
        
        // Recarregar página
        window.location.reload();
    };
    
    // Verificar sempre que a página carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkWelcomeStatus);
    } else {
        checkWelcomeStatus();
    }
    
    // Também verificar login existente
    function checkExistingLogin() {
        const userLoggedIn = sessionStorage.getItem('userLoggedIn') === 'true';
        const userName = sessionStorage.getItem('userName');
        
        if (userLoggedIn && userName) {
            console.log('👤 Usuário já logado:', userName);
            updateHeaderWithUser(userName);
        }
    }
    
    // Verificar login existente após um tempo
    setTimeout(checkExistingLogin, 2000);
    
    console.log('👋 Sistema de boas-vindas ativado');
})();