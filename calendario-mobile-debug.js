// DEBUG E FORÇA PARA CALENDÁRIO MOBILE
(function() {
    'use strict';
    
    console.log('🐛 MODO DEBUG - Calendário Mobile');
    
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    function isAgendaActive() {
        const agenda = document.getElementById('agenda');
        return agenda && agenda.classList.contains('active');
    }
    
    function debugCalendar() {
        if (!isMobile() || !isAgendaActive()) {
            console.log('❌ Condições não atendidas:', { mobile: isMobile(), agenda: isAgendaActive() });
            return;
        }
        
        console.log('🔍 DEBUGANDO calendário mobile...');
        
        // Verificar elementos
        const agenda = document.getElementById('agenda');
        const container = document.querySelector('#agenda.active .modern-calendar-container');
        const grid = document.querySelector('#agenda.active .calendar-days-modern');
        const days = document.querySelectorAll('#agenda.active .calendar-day-modern');
        
        console.log('📋 ELEMENTOS ENCONTRADOS:');
        console.log('- Agenda:', agenda ? '✅' : '❌');
        console.log('- Container:', container ? '✅' : '❌');
        console.log('- Grid:', grid ? '✅' : '❌');
        console.log('- Dias:', days.length);
        
        if (!container || !grid || days.length === 0) {
            console.error('❌ ELEMENTOS FALTANDO!');
            return;
        }
        
        // Debug dos estilos
        console.log('🎨 ESTILOS ATUAIS:');
        const containerStyle = window.getComputedStyle(container);
        const gridStyle = window.getComputedStyle(grid);
        
        console.log('Container display:', containerStyle.display);
        console.log('Container visibility:', containerStyle.visibility);
        console.log('Container opacity:', containerStyle.opacity);
        console.log('Grid display:', gridStyle.display);
        console.log('Grid visibility:', gridStyle.visibility);
        
        // Forçar estilos com JavaScript puro
        console.log('🔧 FORÇANDO ESTILOS...');
        
        // Container
        container.style.setProperty('display', 'block', 'important');
        container.style.setProperty('visibility', 'visible', 'important');
        container.style.setProperty('opacity', '1', 'important');
        container.style.setProperty('width', '100%', 'important');
        container.style.setProperty('margin', '10px auto', 'important');
        container.style.setProperty('padding', '15px', 'important');
        container.style.setProperty('background', '#fff', 'important');
        container.style.setProperty('border-radius', '12px', 'important');
        container.style.setProperty('box-shadow', '0 2px 15px rgba(0,0,0,0.1)', 'important');
        
        // Grid
        grid.style.setProperty('display', 'grid', 'important');
        grid.style.setProperty('grid-template-columns', 'repeat(7, 1fr)', 'important');
        grid.style.setProperty('grid-template-rows', 'repeat(6, 40px)', 'important');
        grid.style.setProperty('gap', '3px', 'important');
        grid.style.setProperty('width', '100%', 'important');
        grid.style.setProperty('visibility', 'visible', 'important');
        grid.style.setProperty('opacity', '1', 'important');
        grid.style.setProperty('background', 'transparent', 'important');
        
        // DEBUG VISUAL - BORDAS VERMELHAS
        grid.style.setProperty('border', '3px solid red', 'important');
        grid.style.setProperty('background', 'rgba(255, 0, 0, 0.1)', 'important');
        
        // Cada dia
        days.forEach(function(day, index) {
            day.style.setProperty('display', 'flex', 'important');
            day.style.setProperty('align-items', 'center', 'important');
            day.style.setProperty('justify-content', 'center', 'important');
            day.style.setProperty('width', '100%', 'important');
            day.style.setProperty('height', '40px', 'important');
            day.style.setProperty('min-height', '40px', 'important');
            day.style.setProperty('font-size', '13px', 'important');
            day.style.setProperty('font-weight', '600', 'important');
            day.style.setProperty('color', '#374151', 'important');
            day.style.setProperty('background', '#ffffff', 'important');
            day.style.setProperty('border', '1px solid #e5e7eb', 'important');
            day.style.setProperty('border-radius', '8px', 'important');
            day.style.setProperty('visibility', 'visible', 'important');
            day.style.setProperty('opacity', '1', 'important');
            day.style.setProperty('text-align', 'center', 'important');
            
            // DEBUG VISUAL - BORDAS AZUIS
            day.style.setProperty('border', '2px solid blue', 'important');
            day.style.setProperty('background', 'rgba(0, 0, 255, 0.1)', 'important');
            
            // Estados especiais
            if (day.classList.contains('current')) {
                day.style.setProperty('background', '#3b82f6', 'important');
                day.style.setProperty('color', '#ffffff', 'important');
                day.style.setProperty('font-weight', '700', 'important');
            } else if (day.classList.contains('event')) {
                day.style.setProperty('background', '#10b981', 'important');
                day.style.setProperty('color', '#ffffff', 'important');
                day.style.setProperty('font-weight', '700', 'important');
            } else if (day.classList.contains('inactive')) {
                day.style.setProperty('background', '#f9fafb', 'important');
                day.style.setProperty('color', '#9ca3af', 'important');
            }
            
            console.log(`📅 Dia ${index + 1}: ${day.textContent} - ${day.style.display}`);
        });
        
        console.log('✅ FORÇA APLICADA COM BORDAS DE DEBUG!');
        console.log('🔴 GRID com borda vermelha');
        console.log('🔵 DIAS com borda azul');
        
        // Verificar se está visível agora
        setTimeout(function() {
            const finalContainerStyle = window.getComputedStyle(container);
            const finalGridStyle = window.getComputedStyle(grid);
            
            console.log('📊 VERIFICAÇÃO FINAL:');
            console.log('Container display final:', finalContainerStyle.display);
            console.log('Grid display final:', finalGridStyle.display);
            console.log('Grid width final:', finalGridStyle.width);
            console.log('Grid height final:', finalGridStyle.height);
        }, 500);
    }
    
    // Executar debug quando agenda ficar ativa
    function setupDebug() {
        const agenda = document.getElementById('agenda');
        if (!agenda) return;
        
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (isAgendaActive() && isMobile()) {
                        setTimeout(debugCalendar, 200);
                    }
                }
            });
        });
        
        observer.observe(agenda, {
            attributes: true,
            attributeFilter: ['class']
        });
        
        console.log('👁️ Observer de debug configurado');
    }
    
    // Inicializar
    function init() {
        console.log('🚀 Iniciando debug do calendário mobile...');
        
        setTimeout(debugCalendar, 300);
        setupDebug();
        
        // Debug em eventos de tela
        window.addEventListener('resize', function() {
            setTimeout(debugCalendar, 200);
        });
        
        window.addEventListener('orientationchange', function() {
            setTimeout(debugCalendar, 500);
        });
        
        console.log('✅ Debug ativo!');
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    console.log('🐛 DEBUG CALENDÁRIO MOBILE CARREGADO');
})();