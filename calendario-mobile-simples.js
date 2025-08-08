// CALENDÁRIO MOBILE SUPER SIMPLES - SEM COMPLICAÇÃO
(function() {
    'use strict';
    
    console.log('📱 Calendário mobile simples carregando...');
    
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    function isAgendaActive() {
        const agenda = document.getElementById('agenda');
        return agenda && agenda.classList.contains('active');
    }
    
    function forcarCalendarioSimples() {
        if (!isMobile() || !isAgendaActive()) {
            return;
        }
        
        console.log('🔧 Forçando calendário simples...');
        
        // Encontrar elementos
        const container = document.querySelector('#agenda.active .modern-calendar-container');
        const grid = document.querySelector('#agenda.active .calendar-days-modern');
        
        if (!container || !grid) {
            console.log('❌ Elementos não encontrados');
            return;
        }
        
        // Forçar container visível
        container.style.display = 'block';
        container.style.width = '100%';
        container.style.margin = '0 auto 15px auto';
        container.style.padding = '10px';
        container.style.background = 'white';
        container.style.borderRadius = '8px';
        container.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        
        // Forçar grid visível
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(7, 1fr)';
        grid.style.gap = '2px';
        grid.style.width = '100%';
        
        // Forçar cada dia visível
        const dias = grid.querySelectorAll('.calendar-day-modern');
        dias.forEach(function(dia) {
            dia.style.display = 'flex';
            dia.style.alignItems = 'center';
            dia.style.justifyContent = 'center';
            dia.style.height = '35px';
            dia.style.width = '100%';
            dia.style.fontSize = '14px';
            dia.style.fontWeight = '500';
            dia.style.background = 'white';
            dia.style.border = '1px solid #ddd';
            dia.style.color = '#333';
            dia.style.textAlign = 'center';
            
            if (dia.classList.contains('current')) {
                dia.style.background = '#007bff';
                dia.style.color = 'white';
                dia.style.fontWeight = 'bold';
            } else if (dia.classList.contains('event')) {
                dia.style.background = '#28a745';
                dia.style.color = 'white';
                dia.style.fontWeight = 'bold';
            } else if (dia.classList.contains('inactive')) {
                dia.style.background = '#f8f9fa';
                dia.style.color = '#999';
            }
        });
        
        console.log('✅ Calendário simples forçado!');
    }
    
    // Executar quando agenda ficar ativa
    function observarAgenda() {
        const agenda = document.getElementById('agenda');
        if (!agenda) return;
        
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (isAgendaActive() && isMobile()) {
                        setTimeout(forcarCalendarioSimples, 100);
                    }
                }
            });
        });
        
        observer.observe(agenda, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
    
    // Inicializar
    function inicializar() {
        setTimeout(forcarCalendarioSimples, 200);
        observarAgenda();
        
        // Executar em mudanças de tela
        window.addEventListener('resize', function() {
            setTimeout(forcarCalendarioSimples, 100);
        });
        
        window.addEventListener('orientationchange', function() {
            setTimeout(forcarCalendarioSimples, 300);
        });
        
        console.log('✅ Sistema simples ativo!');
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializar);
    } else {
        inicializar();
    }
    
    console.log('📱 Calendário mobile simples carregado!');
})();