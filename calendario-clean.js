// CALENDÁRIO LIMPO - JAVASCRIPT ESSENCIAL
(function() {
    'use strict';
    
    console.log('🗓️ Calendário limpo iniciando...');
    
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    function isAgendaActive() {
        const agenda = document.getElementById('agenda');
        return agenda && agenda.classList.contains('active');
    }
    
    function aplicarEstilosBasicos() {
        if (!isMobile() || !isAgendaActive()) {
            return;
        }
        
        console.log('📱 Aplicando estilos básicos no mobile...');
        
        const container = document.querySelector('#agenda.active .modern-calendar-container');
        const grid = document.querySelector('#agenda.active .calendar-days-modern');
        const days = document.querySelectorAll('#agenda.active .calendar-day-modern');
        
        if (!container || !grid) {
            console.log('❌ Elementos não encontrados');
            return;
        }
        
        // Container
        container.style.display = 'block';
        container.style.width = '100%';
        container.style.maxWidth = '350px';
        container.style.margin = '20px auto';
        container.style.padding = '20px';
        container.style.background = 'white';
        container.style.borderRadius = '12px';
        container.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        
        // Grid igual desktop
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(7, 1fr)';
        grid.style.gridTemplateRows = 'repeat(6, 42px)';
        grid.style.gap = '3px';
        grid.style.marginTop = '5px';
        
        // Cada dia
        days.forEach(function(day) {
            day.style.display = 'flex';
            day.style.alignItems = 'center';
            day.style.justifyContent = 'center';
            day.style.width = '100%';
            day.style.height = '42px';
            day.style.fontSize = '13px';
            day.style.fontWeight = '500';
            day.style.color = '#374151';
            day.style.background = '#ffffff';
            day.style.border = '1px solid #e5e7eb';
            day.style.borderRadius = '8px';
            day.style.cursor = 'pointer';
            day.style.boxSizing = 'border-box';
            
            if (day.classList.contains('current')) {
                day.style.background = '#3b82f6';
                day.style.color = 'white';
                day.style.fontWeight = '700';
            } else if (day.classList.contains('event')) {
                day.style.background = '#10b981';
                day.style.color = 'white';
                day.style.fontWeight = '700';
            } else if (day.classList.contains('inactive')) {
                day.style.background = '#f3f4f6';
                day.style.color = '#9ca3af';
                day.style.cursor = 'default';
            }
        });
        
        console.log(`✅ Estilos aplicados! ${days.length} dias processados`);
    }
    
    // Observar quando agenda fica ativa
    function observarAgenda() {
        const agenda = document.getElementById('agenda');
        if (!agenda) return;
        
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (isAgendaActive() && isMobile()) {
                        setTimeout(aplicarEstilosBasicos, 100);
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
    function init() {
        setTimeout(aplicarEstilosBasicos, 200);
        observarAgenda();
        
        window.addEventListener('resize', function() {
            setTimeout(aplicarEstilosBasicos, 100);
        });
        
        console.log('✅ Calendário limpo ativo!');
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    console.log('🗓️ Calendário limpo carregado!');
})();