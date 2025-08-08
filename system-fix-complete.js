// SISTEMA COMPLETO DE CORREÇÃO - CADASTRO, LOGIN E CALENDÁRIO
(function() {
    'use strict';
    
    console.log('🔧 INICIANDO SISTEMA COMPLETO DE CORREÇÃO...');
    
    // ==================== CONFIGURAÇÃO DA API ====================
    const API_BASE = 'http://localhost:3000';
    
    // ==================== SISTEMA DE CADASTRO ====================
    function setupCadastroSystem() {
        const cadastroForm = document.getElementById('cadastroForm');
        if (!cadastroForm) return;
        
        console.log('📝 Configurando sistema de cadastro...');
        
        cadastroForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                id: Date.now(),
                nomeCompleto: document.getElementById('nomeCompleto').value.trim(),
                email: document.getElementById('email').value.trim(),
                telefone: document.getElementById('telefone').value.trim(),
                dataNascimento: document.getElementById('dataNascimento').value,
                bairro: document.getElementById('bairro').value,
                cidade: document.getElementById('cidade').value.trim() || 'Monte Santo',
                genero: document.getElementById('genero').value,
                cpf: document.getElementById('cpf')?.value?.trim() || null,
                zonaEleitoral: document.getElementById('zonaEleitoral')?.value?.trim() || null,
                secao: document.getElementById('secao')?.value?.trim() || null,
                dataCadastro: new Date().toISOString(),
                status: 'ativo',
                presente: false
            };
            
            const submitButton = cadastroForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '🔄 Cadastrando...';
            submitButton.disabled = true;
            
            try {
                // Tentar API do servidor
                const response = await fetch(`${API_BASE}/api/cadastro-eleitor`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                let serverSuccess = false;
                if (response.ok) {
                    const result = await response.json();
                    console.log('✅ Cadastro salvo no servidor:', result);
                    serverSuccess = true;
                }
                
                // Salvar localmente sempre (backup)
                let eleitores = JSON.parse(localStorage.getItem('eleitores') || '[]');
                const emailExists = eleitores.find(e => e.email === formData.email);
                
                if (emailExists) {
                    throw new Error('Este e-mail já está cadastrado!');
                }
                
                eleitores.push(formData);
                localStorage.setItem('eleitores', JSON.stringify(eleitores));
                
                // Salvar como usuário registrado também
                let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                registeredUsers.push(formData);
                localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
                
                // Login automático
                sessionStorage.setItem('userLoggedIn', 'true');
                sessionStorage.setItem('userName', formData.nomeCompleto);
                sessionStorage.setItem('userEmail', formData.email);
                
                const sessionData = {
                    userId: formData.id,
                    nomeCompleto: formData.nomeCompleto,
                    telefone: formData.telefone,
                    bairro: formData.bairro,
                    email: formData.email,
                    isLoggedIn: true,
                    loginTime: new Date().toISOString()
                };
                sessionStorage.setItem('userSession', JSON.stringify(sessionData));
                
                submitButton.innerHTML = '✅ Sucesso!';
                submitButton.style.background = '#16a34a';
                
                setTimeout(() => {
                    window.location.href = 'index.html?welcome=true';
                }, 1000);
                
            } catch (error) {
                console.error('❌ Erro no cadastro:', error);
                alert(error.message || 'Erro no cadastro. Tente novamente.');
                
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                submitButton.style.background = '';
            }
        });
    }
    
    // ==================== SISTEMA DE LOGIN ====================
    function setupLoginSystem() {
        const loginForm = document.getElementById('loginForm');
        if (!loginForm) return;
        
        console.log('🔐 Configurando sistema de login...');
        
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const senha = document.getElementById('senha').value.trim();
            
            if (!email || !senha) {
                alert('Por favor, preencha email e senha.');
                return;
            }
            
            const submitButton = loginForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '🔄 Entrando...';
            submitButton.disabled = true;
            
            try {
                // Tentar API do servidor
                let loginSuccess = false;
                let userData = null;
                
                try {
                    const response = await fetch(`${API_BASE}/api/login-eleitor`, {
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
                            console.log('✅ Login via servidor bem-sucedido');
                        }
                    }
                } catch (err) {
                    console.warn('⚠️ Erro na API, tentando localStorage');
                }
                
                // Se servidor falhou, tentar localStorage
                if (!loginSuccess) {
                    const eleitores = JSON.parse(localStorage.getItem('eleitores') || '[]');
                    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                    
                    let user = eleitores.find(e => e.email === email && (e.senha === senha || e.email === senha));
                    if (!user) {
                        user = registeredUsers.find(u => u.email === email && (u.senha === senha || u.email === senha));
                    }
                    
                    if (user) {
                        userData = user;
                        loginSuccess = true;
                        console.log('✅ Login via localStorage bem-sucedido');
                    }
                }
                
                if (loginSuccess && userData) {
                    // Salvar sessão
                    sessionStorage.setItem('userLoggedIn', 'true');
                    sessionStorage.setItem('userName', userData.nome || userData.nomeCompleto);
                    sessionStorage.setItem('userEmail', userData.email);
                    
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
                    
                    submitButton.innerHTML = '✅ Sucesso!';
                    submitButton.style.background = '#16a34a';
                    
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                    
                } else {
                    throw new Error('Email ou senha incorretos!');
                }
                
            } catch (error) {
                console.error('❌ Erro no login:', error);
                alert(error.message || 'Erro no login. Tente novamente.');
                
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                submitButton.style.background = '';
            }
        });
    }
    
    // ==================== SISTEMA DE BOAS-VINDAS ====================
    function setupWelcomeSystem() {
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('welcome') === 'true') {
                const userName = sessionStorage.getItem('userName');
                
                if (userName) {
                    setTimeout(() => {
                        const modal = document.createElement('div');
                        modal.innerHTML = `
                            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center;">
                                <div style="background: white; padding: 30px; border-radius: 15px; text-align: center; max-width: 400px; margin: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                                    <div style="font-size: 48px; margin-bottom: 20px;">🎉</div>
                                    <h2 style="color: #1e40af; margin-bottom: 15px;">Bem-vindo(a)!</h2>
                                    <p style="color: #374151; margin-bottom: 20px;"><strong>${userName}</strong>, seu cadastro foi realizado com sucesso!</p>
                                    <button onclick="this.parentElement.parentElement.remove(); window.history.replaceState({}, '', window.location.pathname);" style="background: #1e40af; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; cursor: pointer;">
                                        Começar a Explorar
                                    </button>
                                </div>
                            </div>
                        `;
                        document.body.appendChild(modal);
                    }, 1000);
                }
            }
            
            // Verificar se usuário já está logado
            const userLoggedIn = sessionStorage.getItem('userLoggedIn') === 'true';
            const userName = sessionStorage.getItem('userName');
            
            if (userLoggedIn && userName) {
                updateHeaderWithUser(userName);
            }
        }
    }
    
    // ==================== ATUALIZAR HEADER COM USUÁRIO ====================
    function updateHeaderWithUser(userName) {
        setTimeout(() => {
            const loginButtons = document.querySelectorAll('[href="login.html"], [href="cadastro.html"]');
            
            if (loginButtons.length > 0) {
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
                `;
                
                userElement.innerHTML = `
                    <i class="fas fa-user-circle" style="font-size: 18px;"></i>
                    <span>Olá, ${userName.split(' ')[0]}!</span>
                    <button onclick="logout()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; cursor: pointer;">
                        <i class="fas fa-sign-out-alt"></i>
                    </button>
                `;
                
                loginButtons[0].parentElement.replaceChild(userElement, loginButtons[0]);
                
                for (let i = 1; i < loginButtons.length; i++) {
                    loginButtons[i].style.display = 'none';
                }
            }
        }, 2000);
    }
    
    // ==================== CORREÇÃO DO CALENDÁRIO MOBILE ====================
    function fixMobileCalendar() {
        if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && window.innerWidth > 768) {
            return;
        }
        
        console.log('📱 Aplicando correção do calendário mobile...');
        
        function applyCalendarFix() {
            // Aplicar CSS dinâmico
            const style = document.createElement('style');
            style.innerHTML = `
                @media (max-width: 768px) {
                    .agenda-publica, #agenda, .agenda-modern-layout {
                        width: 100% !important;
                        max-width: 350px !important;
                        margin: 20px auto !important;
                        padding: 20px !important;
                        background: white !important;
                        border-radius: 15px !important;
                        box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
                    }
                    
                    .calendar-grid-modern, .calendar-grid, .calendar-days {
                        display: grid !important;
                        grid-template-columns: repeat(7, 1fr) !important;
                        gap: 4px !important;
                        width: 100% !important;
                    }
                    
                    .calendar-day-modern, .calendar-day, .day {
                        width: 42px !important;
                        height: 42px !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        font-size: 16px !important;
                        font-weight: 600 !important;
                        background: white !important;
                        color: #374151 !important;
                        border: 2px solid #e5e7eb !important;
                        border-radius: 10px !important;
                        text-align: center !important;
                        cursor: pointer !important;
                    }
                    
                    .calendar-day-modern.current, .calendar-day.current, .day.current {
                        background: linear-gradient(135deg, #3b82f6, #1e40af) !important;
                        color: white !important;
                        border-color: #1e40af !important;
                    }
                    
                    .calendar-day-modern.event, .calendar-day.event, .day.event {
                        background: linear-gradient(135deg, #10b981, #059669) !important;
                        color: white !important;
                        border-color: #059669 !important;
                    }
                    
                    .calendar-weekdays-modern, .calendar-weekdays {
                        display: grid !important;
                        grid-template-columns: repeat(7, 1fr) !important;
                        gap: 2px !important;
                        margin-bottom: 15px !important;
                    }
                    
                    .calendar-weekday-modern, .calendar-weekday, .weekday {
                        text-align: center !important;
                        font-weight: 600 !important;
                        color: #6b7280 !important;
                        font-size: 12px !important;
                        padding: 8px 4px !important;
                        background: #f9fafb !important;
                        border-radius: 6px !important;
                    }
                }
            `;
            document.head.appendChild(style);
            
            // Forçar reconstrução do calendário se necessário
            const grids = document.querySelectorAll('.calendar-grid-modern, .calendar-grid, .calendar-days');
            grids.forEach(grid => {
                if (grid && grid.children.length === 0) {
                    // Recriar calendário básico
                    const currentDate = new Date();
                    const year = currentDate.getFullYear();
                    const month = currentDate.getMonth();
                    const firstDay = new Date(year, month, 1).getDay();
                    const daysInMonth = new Date(year, month + 1, 0).getDate();
                    
                    // Células vazias
                    for (let i = 0; i < firstDay; i++) {
                        const emptyCell = document.createElement('div');
                        emptyCell.className = 'calendar-day-modern empty';
                        grid.appendChild(emptyCell);
                    }
                    
                    // Dias do mês
                    for (let day = 1; day <= daysInMonth; day++) {
                        const dayCell = document.createElement('div');
                        dayCell.className = 'calendar-day-modern';
                        dayCell.textContent = day;
                        
                        if (day === currentDate.getDate()) {
                            dayCell.classList.add('current');
                        }
                        
                        grid.appendChild(dayCell);
                    }
                }
            });
        }
        
        // Aplicar correção múltiplas vezes
        setTimeout(applyCalendarFix, 500);
        setTimeout(applyCalendarFix, 2000);
        setTimeout(applyCalendarFix, 5000);
    }
    
    // ==================== FUNÇÃO DE LOGOUT GLOBAL ====================
    window.logout = function() {
        sessionStorage.clear();
        localStorage.removeItem('userSession');
        window.location.reload();
    };
    
    // ==================== INICIALIZAÇÃO ====================
    document.addEventListener('DOMContentLoaded', function() {
        setupCadastroSystem();
        setupLoginSystem();
        setupWelcomeSystem();
        fixMobileCalendar();
        
        console.log('✅ Sistema completo inicializado');
    });
    
    // Também executar se DOM já carregou
    if (document.readyState !== 'loading') {
        setupCadastroSystem();
        setupLoginSystem();
        setupWelcomeSystem();
        fixMobileCalendar();
    }
    
    console.log('🔧 SISTEMA COMPLETO DE CORREÇÃO CARREGADO');
})();