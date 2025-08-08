// FORÇA SIMPLES PARA EXIBIR CALENDÁRIO NO MOBILE
// Abordagem direta sem complexidade

(function() {
    'use strict';
    
    console.log('📱 FORÇANDO EXIBIÇÃO SIMPLES DO CALENDÁRIO MOBILE...');
    
    // Verificar se é mobile
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Verificar se agenda está ativa
    function isAgendaActive() {
        const agenda = document.getElementById('agenda');
        return agenda && agenda.classList.contains('active');
    }
    
    // Função principal para forçar exibição
    function forceCalendarDisplay() {
        if (!isMobile() || !isAgendaActive()) {
            return;
        }
        
        console.log('🔧 Forçando exibição do calendário mobile...');
        
        // Encontrar elementos principais
        const calendarContainer = document.querySelector('#agenda.active .modern-calendar-container');
        const calendarGrid = document.querySelector('#agenda.active .calendar-days-modern');
        const weekdays = document.querySelector('#agenda.active .calendar-weekdays-modern');
        
        if (!calendarContainer || !calendarGrid) {
            console.warn('⚠️ Elementos do calendário não encontrados');
            return;
        }
        
        // FORÇAR VISIBILIDADE DO CONTAINER PRINCIPAL
        calendarContainer.style.display = 'block';
        calendarContainer.style.visibility = 'visible';
        calendarContainer.style.opacity = '1';
        calendarContainer.style.width = '100%';
        calendarContainer.style.maxWidth = '100%';
        calendarContainer.style.margin = '0 auto 20px auto';
        calendarContainer.style.padding = '15px';
        
        // FORÇAR VISIBILIDADE DOS DIAS DA SEMANA
        if (weekdays) {
            weekdays.style.display = 'grid';
            weekdays.style.gridTemplateColumns = 'repeat(7, 1fr)';
            weekdays.style.gap = '2px';
            weekdays.style.marginBottom = '10px';
            weekdays.style.width = '100%';
            weekdays.style.visibility = 'visible';
            weekdays.style.opacity = '1';
            
            // Forçar cada dia da semana
            const weekdayElements = weekdays.querySelectorAll('.weekday-modern');
            weekdayElements.forEach(function(day) {
                day.style.display = 'block';
                day.style.textAlign = 'center';
                day.style.fontSize = '11px';
                day.style.fontWeight = '600';
                day.style.padding = '6px 2px';
                day.style.background = '#f3f4f6';
                day.style.color = '#374151';
                day.style.borderRadius = '4px';
                day.style.visibility = 'visible';
                day.style.opacity = '1';
            });
        }
        
        // FORÇAR VISIBILIDADE DO GRID DE DIAS
        calendarGrid.style.display = 'grid';
        calendarGrid.style.gridTemplateColumns = 'repeat(7, 1fr)';
        calendarGrid.style.gridTemplateRows = 'repeat(6, 45px)';
        calendarGrid.style.gap = '3px';
        calendarGrid.style.width = '100%';
        calendarGrid.style.margin = '0';
        calendarGrid.style.padding = '0';
        calendarGrid.style.visibility = 'visible';
        calendarGrid.style.opacity = '1';
        calendarGrid.style.background = 'transparent';
        calendarGrid.style.minHeight = '270px';
        
        // FORÇAR CADA DIA INDIVIDUAL
        const dayElements = calendarGrid.querySelectorAll('.calendar-day-modern');
        dayElements.forEach(function(day, index) {
            // Estilos base para cada dia
            day.style.display = 'flex';
            day.style.alignItems = 'center';
            day.style.justifyContent = 'center';
            day.style.width = '100%';
            day.style.height = '45px';
            day.style.minHeight = '45px';
            day.style.maxHeight = '45px';
            day.style.fontFamily = "'Inter', Arial, sans-serif";
            day.style.fontSize = '14px';
            day.style.fontWeight = '600';
            day.style.lineHeight = '1';
            day.style.textAlign = 'center';
            day.style.color = '#1f2937';
            day.style.background = '#ffffff';
            day.style.border = '1px solid #d1d5db';
            day.style.borderRadius = '8px';
            day.style.visibility = 'visible';
            day.style.opacity = '1';
            day.style.zIndex = '1';
            day.style.textIndent = '0';
            day.style.whiteSpace = 'nowrap';
            day.style.overflow = 'visible';
            day.style.boxSizing = 'border-box';
            day.style.position = 'relative';
            day.style.cursor = 'pointer';
            day.style.transition = 'all 0.2s ease';
            
            // Aplicar estilos especiais baseados na classe
            if (day.classList.contains('current')) {
                day.style.background = '#3b82f6';
                day.style.color = '#ffffff';
                day.style.borderColor = '#2563eb';
                day.style.fontWeight = '700';
                day.style.fontSize = '16px';
                day.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
            } else if (day.classList.contains('event')) {
                day.style.background = '#10b981';
                day.style.color = '#ffffff';
                day.style.borderColor = '#059669';
                day.style.fontWeight = '700';
                
                // Adicionar indicador de evento se não existe
                if (!day.querySelector('.event-indicator')) {
                    const indicator = document.createElement('span');
                    indicator.className = 'event-indicator';
                    indicator.style.position = 'absolute';
                    indicator.style.bottom = '2px';
                    indicator.style.right = '4px';
                    indicator.style.fontSize = '8px';
                    indicator.style.color = '#fbbf24';
                    indicator.style.pointerEvents = 'none';
                    indicator.textContent = '•';
                    day.appendChild(indicator);
                }
            } else if (day.classList.contains('inactive')) {
                day.style.background = '#f9fafb';
                day.style.color = '#9ca3af';
                day.style.borderColor = '#f3f4f6';
                day.style.cursor = 'default';
                day.style.opacity = '0.6';
            }
            
            console.log(`✅ Dia ${day.textContent} - estilo forçado`);
        });
        
        console.log(`🎉 Calendário mobile forçado! ${dayElements.length} dias processados`);
    }
    
    // Função para observar mudanças na agenda
    function setupObserver() {
        const agenda = document.getElementById('agenda');
        if (agenda) {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        if (isAgendaActive() && isMobile()) {
                            setTimeout(forceCalendarDisplay, 200);
                        }
                    }
                });
            });
            
            observer.observe(agenda, {
                attributes: true,
                attributeFilter: ['class']
            });
        }
    }
    
    // Função de inicialização
    function initializeForceDisplay() {
        console.log('🚀 Inicializando força de exibição simples...');
        
        // Executar força inicial
        setTimeout(forceCalendarDisplay, 300);
        
        // Configurar observador
        setupObserver();
        
        // Re-executar em eventos de tela
        window.addEventListener('resize', function() {
            setTimeout(forceCalendarDisplay, 200);
        });
        
        window.addEventListener('orientationchange', function() {
            setTimeout(forceCalendarDisplay, 500);
        });
        
        // Executar periodicamente
        setInterval(function() {
            if (isMobile() && isAgendaActive()) {
                forceCalendarDisplay();
            }
        }, 3000);
        
        console.log('✅ Sistema de força simples ATIVO!');
    }
    
    // Aguardar DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeForceDisplay);
    } else {
        initializeForceDisplay();
    }
    
    console.log('📱 FORÇA SIMPLES DE CALENDÁRIO CARREGADA');
})();