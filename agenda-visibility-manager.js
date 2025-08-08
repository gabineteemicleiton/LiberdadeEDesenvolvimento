// GERENCIADOR DE VISIBILIDADE DA AGENDA
// Controla quando a agenda deve aparecer no mobile

(function() {
    'use strict';
    
    console.log('📱 Inicializando gerenciador de visibilidade da agenda...');
    
    let initialized = false;
    
    // Função para verificar se estamos na página inicial
    function isIndexPage() {
        const currentPage = window.location.pathname;
        return currentPage === '/' || 
               currentPage === '/index.html' || 
               currentPage.endsWith('/index.html') || 
               currentPage === '' ||
               currentPage === '/workspace/' ||
               currentPage.endsWith('/workspace/');
    }
    
    // Função para verificar se é dispositivo mobile
    function isMobileDevice() {
        return window.innerWidth <= 768;
    }
    
    // Função para gerenciar visibilidade da agenda
    function manageAgendaVisibility() {
        const agendaSection = document.getElementById('agenda');
        if (!agendaSection) {
            console.log('⚠️ Seção agenda não encontrada');
            return;
        }
        
        // Se não estiver na página inicial, ocultar agenda completamente
        if (!isIndexPage()) {
            console.log('❌ Não está na página inicial - ocultando agenda');
            agendaSection.style.display = 'none !important';
            agendaSection.classList.remove('active');
            return;
        }
        
        // Na página inicial, controlar baseado no status ativo
        const isActive = agendaSection.classList.contains('active');
        
        if (isActive) {
            console.log('✅ Agenda ativa - garantindo visibilidade');
            // Garantir que a agenda está visível quando ativa
            agendaSection.style.display = '';
            
            // No mobile, aplicar correções específicas
            if (isMobileDevice()) {
                applyMobileAgendaCorrections();
            }
        } else {
            console.log('📱 Agenda inativa - mantendo oculta');
            // CSS já cuida do ocultamento via :not(.active)
        }
    }
    
    // Função para aplicar correções específicas do mobile quando agenda está ativa
    function applyMobileAgendaCorrections() {
        const agendaLayout = document.querySelector('#agenda.active .agenda-modern-layout');
        const calendarContainer = document.querySelector('#agenda.active .modern-calendar-container');
        const eventsContainer = document.querySelector('#agenda.active .modern-events-container');
        
        if (agendaLayout) {
            console.log('📱 Aplicando layout mobile para agenda ativa');
            agendaLayout.style.cssText += `
                display: flex !important;
                flex-direction: column !important;
                gap: 1.5rem !important;
                width: 100% !important;
                max-width: calc(100vw - 20px) !important;
                margin: 0 auto !important;
                padding: 0 10px !important;
            `;
        }
        
        if (calendarContainer) {
            calendarContainer.style.cssText += `
                width: 100% !important;
                max-width: 350px !important;
                margin: 0 auto !important;
                padding: 20px !important;
                background: white !important;
                border-radius: 15px !important;
                box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
            `;
        }
        
        if (eventsContainer) {
            eventsContainer.style.cssText += `
                width: 100% !important;
                max-width: 400px !important;
                margin: 0 auto !important;
                padding: 20px !important;
                background: white !important;
                border-radius: 15px !important;
                box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
            `;
        }
        
        // Corrigir grid do calendário
        const calendarGrid = document.querySelector('#agenda.active .calendar-grid-modern');
        if (calendarGrid) {
            calendarGrid.style.cssText += `
                display: grid !important;
                grid-template-columns: repeat(7, 1fr) !important;
                gap: 8px !important;
                margin-top: 15px !important;
            `;
        }
        
        // Corrigir dias do calendário
        const calendarDays = document.querySelectorAll('#agenda.active .calendar-day-modern');
        calendarDays.forEach(day => {
            day.style.cssText += `
                width: 100% !important;
                aspect-ratio: 1 !important;
                min-height: 45px !important;
                max-height: 45px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 14px !important;
                font-weight: 500 !important;
                border-radius: 8px !important;
            `;
        });
    }
    
    // Observar mudanças na classe 'active' da agenda
    function observeAgendaChanges() {
        const agendaSection = document.getElementById('agenda');
        if (!agendaSection) return;
        
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    console.log('🔄 Mudança detectada na classe da agenda');
                    setTimeout(manageAgendaVisibility, 100);
                }
            });
        });
        
        observer.observe(agendaSection, {
            attributes: true,
            attributeFilter: ['class']
        });
        
        console.log('👁️ Observador de mudanças da agenda ativado');
    }
    
    // Inicializar sistema
    function initialize() {
        if (initialized) return;
        initialized = true;
        
        console.log('🚀 Inicializando sistema de visibilidade da agenda...');
        
        // Aguardar DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(setup, 100);
            });
        } else {
            setTimeout(setup, 100);
        }
    }
    
    function setup() {
        manageAgendaVisibility();
        observeAgendaChanges();
        
        // Re-executar quando a tela for redimensionada
        window.addEventListener('resize', function() {
            setTimeout(manageAgendaVisibility, 200);
        });
        
        // Re-executar em mudanças de orientação
        window.addEventListener('orientationchange', function() {
            setTimeout(manageAgendaVisibility, 500);
        });
        
        console.log('✅ Sistema de visibilidade da agenda configurado');
    }
    
    // Inicializar
    initialize();
    
    console.log('📱 Gerenciador de visibilidade da agenda carregado');
})();