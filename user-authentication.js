// Sistema de autenticação de usuário - Gabinete Digital Emicleiton
// Gerencia login, logout e estado de autenticação

// Verificar se usuário está logado
function isUserLoggedIn() {
    return sessionStorage.getItem('userLoggedIn') === 'true';
}

// Obter dados do usuário logado
function getLoggedUser() {
    if (isUserLoggedIn()) {
        return {
            name: sessionStorage.getItem('userName'),
            email: sessionStorage.getItem('userEmail'),
            loggedIn: true
        };
    }
    return { loggedIn: false };
}

// Fazer logout
function logoutUser() {
    sessionStorage.removeItem('userLoggedIn');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('userEmail');
    
    // Redirecionar para página de login
    window.location.href = 'login.html';
}

// Adicionar botão de logout no painel se usuário logado
function addLogoutButton() {
    if (isUserLoggedIn()) {
        const user = getLoggedUser();
        
        // Criar botão de logout
        const logoutBtn = document.createElement('div');
        logoutBtn.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; z-index: 1000; background: white; padding: 15px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
                <div style="margin-bottom: 10px;">
                    <strong style="color: #1e40af;">Logado como:</strong><br>
                    <span style="color: #374151;">${user.name}</span>
                </div>
                <button onclick="logoutUser()" style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;">
                    <i class="fas fa-sign-out-alt"></i> Sair
                </button>
            </div>
        `;
        
        document.body.appendChild(logoutBtn);
    }
}

// Verificar autenticação ao carregar página
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se está na página de login
    if (window.location.pathname.includes('login.html')) {
        // Se já está logado, redirecionar para painel
        if (isUserLoggedIn()) {
            window.location.href = 'painel.html';
        }
    }
    
    // Se está em página que requer autenticação
    else if (window.location.pathname.includes('painel.html')) {
        // Se não está logado, redirecionar para login
        if (!isUserLoggedIn()) {
            alert('Acesso negado. Você precisa fazer login primeiro.');
            window.location.href = 'login.html';
        } else {
            // Adicionar botão de logout
            addLogoutButton();
        }
    }
});

// Adicionar entrada para admin@gabinete.com com senha 123456
const adminCredentials = {
    email: 'admin@gabinete.com',
    password: '123456',
    name: 'Emicleiton Rubem da Conceição',
    role: 'admin'
};

// Função para validar credenciais
function validateLogin(email, password) {
    return email === adminCredentials.email && password === adminCredentials.password;
}

// Exportar funções para uso global
window.isUserLoggedIn = isUserLoggedIn;
window.getLoggedUser = getLoggedUser;
window.logoutUser = logoutUser;
window.validateLogin = validateLogin;
window.adminCredentials = adminCredentials;

console.log('✅ Sistema de autenticação carregado');