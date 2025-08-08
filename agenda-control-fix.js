// CONTROLE DA AGENDA PÚBLICA - CORREÇÃO FINAL
// Garante que a agenda só apareça na página inicial

(function() {
    'use strict';
    
    console.log('🔧 Iniciando controle da agenda pública...');
    
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
    
    // Função para controlar exibição da agenda baseada na seção ativa
    function controlarExibicaoAgenda() {
        const agendaSection = document.getElementById('agenda');
        
        if (!agendaSection) {
            console.log('⚠️ Seção agenda não encontrada');
            return;
        }
        
        // Verificar se a seção agenda está ativa
        const isAgendaActive = agendaSection.classList.contains('active');
        
        if (!isIndexPage()) {
            console.log('❌ Página não é index.html - ocultando agenda');
            agendaSection.style.display = 'none';
            agendaSection.classList.remove('active');
            
            // Ocultar qualquer botão ou link da agenda também
            const agendaButtons = document.querySelectorAll('[data-section="agenda"], [onclick*="agenda"]');
            agendaButtons.forEach(button => {
                button.style.display = 'none';
            });
        } else {
            console.log('✅ Página inicial - agenda disponível');
            // Na página inicial, só mostrar se a seção agenda estiver ativa
            if (isAgendaActive) {
                if (agendaSection.style.display === 'none') {
                    agendaSection.style.display = '';
                }
            }
        }
    }
    
    // Função para forçar layout correto do calendário no mobile
    function forcarLayoutMobile() {
        if (window.innerWidth <= 768) {
            console.log('📱 Aplicando layout mobile para calendário...');
            
            const agendaLayout = document.querySelector('.agenda-modern-layout');
            const calendarContainer = document.querySelector('.modern-calendar-container');
            const eventsContainer = document.querySelector('.modern-events-container');
            
            if (agendaLayout) {
                agendaLayout.style.cssText = `
                    display: flex !important;
                    flex-direction: column !important;
                    gap: 20px !important;
                    width: 100% !important;
                    max-width: 100% !important;
                    margin: 0 !important;
                    padding: 10px !important;
                    grid-template-columns: none !important;
                `;
            }
            
            if (calendarContainer) {
                calendarContainer.style.cssText += `
                    width: 100% !important;
                    max-width: 100% !important;
                    margin: 0 auto !important;
                `;
            }
            
            if (eventsContainer) {
                eventsContainer.style.cssText += `
                    width: 100% !important;
                    max-width: 100% !important;
                    margin: 0 auto !important;
                `;
            }
            
            // Forçar grid dos dias da semana
            const weekdaysGrid = document.querySelector('.calendar-weekdays-modern');
            const daysGrid = document.querySelector('.calendar-days-modern, #calendarDays');
            
            if (weekdaysGrid) {
                weekdaysGrid.style.cssText = `
                    display: grid !important;
                    grid-template-columns: repeat(7, 1fr) !important;
                    gap: 2px !important;
                    width: 100% !important;
                `;
            }
            
            if (daysGrid) {
                daysGrid.style.cssText = `
                    display: grid !important;
                    grid-template-columns: repeat(7, 1fr) !important;
                    gap: 2px !important;
                    width: 100% !important;
                `;
            }
            
            console.log('✅ Layout mobile aplicado com sucesso');
        }
    }
    
    // Função para interceptar tentativas de navegação para agenda em páginas incorretas
    function interceptarNavegacaoAgenda() {
        // Interceptar clicks em botões da agenda
        document.addEventListener('click', function(e) {
            const target = e.target.closest('[data-section="agenda"], [onclick*="agenda"]');
            
            if (target && !isIndexPage()) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('🚫 Redirecionando para página inicial para acessar agenda');
                window.location.href = '/#agenda';
                return false;
            }
        });
        
        // Interceptar tentativas de showSection('agenda') diretas
        const originalShowSection = window.showSection;
        if (originalShowSection) {
            window.showSection = function(sectionId) {
                if (sectionId === 'agenda' && !isIndexPage()) {
                    console.log('🚫 Tentativa de mostrar agenda fora da página inicial - redirecionando');
                    window.location.href = '/#agenda';
                    return;
                }
                return originalShowSection.apply(this, arguments);
            };
        }
    }
    
    // Executar no carregamento da página
    function init() {
        console.log('🚀 Inicializando controle da agenda...');
        
        // Controlar exibição da agenda
        controlarExibicaoAgenda();
        
        // Interceptar navegação
        interceptarNavegacaoAgenda();
        
        // Aplicar layout mobile se necessário
        forcarLayoutMobile();
        
        // Aplicar novamente no resize
        window.addEventListener('resize', forcarLayoutMobile);
        
        // Aplicar novamente na mudança de orientação
        window.addEventListener('orientationchange', function() {
            setTimeout(forcarLayoutMobile, 500);
        });
        
        console.log('✅ Controle da agenda configurado');
    }
    
    // Executar quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Executar também depois de um tempo para garantir
    setTimeout(init, 1000);
    
})();