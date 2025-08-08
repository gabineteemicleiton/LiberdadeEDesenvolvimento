// SOLUÇÃO DEFINITIVA PARA FORÇAR NÚMEROS DO CALENDÁRIO MOBILE
// Implementação mais direta e robusta - 2025-08-08

(function() {
    'use strict';
    
    console.log('🔥 FORÇANDO EXIBIÇÃO DOS NÚMEROS DO CALENDÁRIO MOBILE...');
    
    // Função para verificar se é mobile
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Função para verificar se agenda está ativa
    function isAgendaActive() {
        const agenda = document.getElementById('agenda');
        return agenda && agenda.classList.contains('active');
    }
    
    // Função PRINCIPAL para forçar os números
    function forceCalendarNumbers() {
        if (!isMobile()) {
            console.log('🖥️ Desktop detectado, pulando correção mobile');
            return;
        }
        
        if (!isAgendaActive()) {
            console.log('📅 Agenda não ativa, pulando correção');
            return;
        }
        
        console.log('🔧 FORÇANDO exibição dos números do calendário...');
        
        // Selecionar TODOS os dias do calendário
        const calendarDays = document.querySelectorAll('#agenda.active .calendar-day-modern');
        
        if (calendarDays.length === 0) {
            console.warn('⚠️ Nenhum dia do calendário encontrado');
            return;
        }
        
        let numbersFixed = 0;
        
        calendarDays.forEach((dayElement, index) => {
            // Garantir que o elemento tem o texto original
            const originalText = dayElement.textContent || dayElement.innerText || '';
            const dayNumber = originalText.trim();
            
            if (dayNumber && dayNumber.length > 0) {
                // FORÇAR estilos diretamente no elemento
                dayElement.style.setProperty('display', 'flex', 'important');
                dayElement.style.setProperty('align-items', 'center', 'important');
                dayElement.style.setProperty('justify-content', 'center', 'important');
                dayElement.style.setProperty('font-family', 'Inter, sans-serif', 'important');
                dayElement.style.setProperty('font-size', '16px', 'important');
                dayElement.style.setProperty('font-weight', '700', 'important');
                dayElement.style.setProperty('line-height', '1', 'important');
                dayElement.style.setProperty('color', '#1f2937', 'important');
                dayElement.style.setProperty('text-align', 'center', 'important');
                dayElement.style.setProperty('width', '100%', 'important');
                dayElement.style.setProperty('height', '50px', 'important');
                dayElement.style.setProperty('min-height', '50px', 'important');
                dayElement.style.setProperty('background', '#ffffff', 'important');
                dayElement.style.setProperty('border', '2px solid #e5e7eb', 'important');
                dayElement.style.setProperty('border-radius', '10px', 'important');
                dayElement.style.setProperty('box-shadow', '0 2px 4px rgba(0, 0, 0, 0.05)', 'important');
                dayElement.style.setProperty('cursor', 'pointer', 'important');
                dayElement.style.setProperty('transition', 'all 0.2s ease', 'important');
                dayElement.style.setProperty('opacity', '1', 'important');
                dayElement.style.setProperty('visibility', 'visible', 'important');
                dayElement.style.setProperty('z-index', '1', 'important');
                dayElement.style.setProperty('text-indent', '0', 'important');
                dayElement.style.setProperty('white-space', 'nowrap', 'important');
                dayElement.style.setProperty('overflow', 'visible', 'important');
                dayElement.style.setProperty('box-sizing', 'border-box', 'important');
                dayElement.style.setProperty('position', 'relative', 'important');
                
                // Garantir que o texto está presente e visível
                if (!dayElement.textContent || dayElement.textContent.trim() === '') {
                    dayElement.textContent = dayNumber;
                }
                
                // Aplicar estilos especiais baseados na classe
                if (dayElement.classList.contains('current')) {
                    dayElement.style.setProperty('background', 'linear-gradient(135deg, #3b82f6, #1e40af)', 'important');
                    dayElement.style.setProperty('color', '#ffffff', 'important');
                    dayElement.style.setProperty('border-color', '#1e40af', 'important');
                    dayElement.style.setProperty('font-weight', '800', 'important');
                    dayElement.style.setProperty('font-size', '18px', 'important');
                    dayElement.style.setProperty('box-shadow', '0 6px 20px rgba(59, 130, 246, 0.4)', 'important');
                    dayElement.style.setProperty('transform', 'scale(1.05)', 'important');
                    dayElement.style.setProperty('z-index', '3', 'important');
                    dayElement.style.setProperty('text-shadow', '0 1px 2px rgba(0, 0, 0, 0.2)', 'important');
                }
                
                if (dayElement.classList.contains('event')) {
                    dayElement.style.setProperty('background', 'linear-gradient(135deg, #10b981, #059669)', 'important');
                    dayElement.style.setProperty('color', '#ffffff', 'important');
                    dayElement.style.setProperty('border-color', '#059669', 'important');
                    dayElement.style.setProperty('font-weight', '800', 'important');
                    dayElement.style.setProperty('font-size', '16px', 'important');
                    dayElement.style.setProperty('box-shadow', '0 4px 15px rgba(16, 185, 129, 0.3)', 'important');
                    dayElement.style.setProperty('text-shadow', '0 1px 2px rgba(0, 0, 0, 0.2)', 'important');
                    
                    // Adicionar indicador de evento se não existe
                    if (!dayElement.querySelector('.event-indicator') && !dayElement.dataset.hasIndicator) {
                        const indicator = document.createElement('span');
                        indicator.className = 'event-indicator';
                        indicator.style.cssText = `
                            position: absolute !important;
                            bottom: 4px !important;
                            right: 6px !important;
                            font-size: 8px !important;
                            color: #fbbf24 !important;
                            text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3) !important;
                            pointer-events: none !important;
                        `;
                        indicator.textContent = '●';
                        dayElement.appendChild(indicator);
                        dayElement.dataset.hasIndicator = 'true';
                    }
                }
                
                if (dayElement.classList.contains('inactive')) {
                    dayElement.style.setProperty('color', '#9ca3af', 'important');
                    dayElement.style.setProperty('background', '#f9fafb', 'important');
                    dayElement.style.setProperty('border-color', '#f3f4f6', 'important');
                    dayElement.style.setProperty('cursor', 'default', 'important');
                    dayElement.style.setProperty('opacity', '0.7', 'important');
                    dayElement.style.setProperty('font-weight', '400', 'important');
                }
                
                numbersFixed++;
                console.log(`✅ Dia ${dayNumber} corrigido (${index + 1}/${calendarDays.length})`);
            }
        });
        
        console.log(`🎉 SUCESSO! ${numbersFixed} números do calendário foram forçados a aparecer!`);
        
        // Forçar re-renderização do container
        const calendarContainer = document.querySelector('#agenda.active .calendar-days-modern');
        if (calendarContainer) {
            calendarContainer.style.display = 'none';
            calendarContainer.offsetHeight; // Trigger reflow
            calendarContainer.style.display = 'grid';
            console.log('🔄 Container do calendário re-renderizado');
        }
    }
    
    // Função para configurar observadores
    function setupObservers() {
        // Observar mudanças na agenda
        const agenda = document.getElementById('agenda');
        if (agenda) {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        if (isAgendaActive()) {
                            setTimeout(forceCalendarNumbers, 200);
                        }
                    }
                });
            });
            
            observer.observe(agenda, {
                attributes: true,
                attributeFilter: ['class']
            });
            
            console.log('👁️ Observador da agenda configurado');
        }
        
        // Observar mudanças no calendário
        const calendarContainer = document.querySelector('.calendar-days-modern');
        if (calendarContainer) {
            const calendarObserver = new MutationObserver(function() {
                if (isAgendaActive()) {
                    setTimeout(forceCalendarNumbers, 100);
                }
            });
            
            calendarObserver.observe(calendarContainer, {
                childList: true,
                subtree: true,
                characterData: true
            });
            
            console.log('👁️ Observador do calendário configurado');
        }
    }
    
    // Função de inicialização
    function initializeForceNumbers() {
        console.log('🚀 INICIANDO sistema de força dos números...');
        
        // Executar correção inicial
        setTimeout(forceCalendarNumbers, 300);
        
        // Configurar observadores
        setTimeout(setupObservers, 500);
        
        // Executar correção periódica quando necessário
        setInterval(function() {
            if (isMobile() && isAgendaActive()) {
                forceCalendarNumbers();
            }
        }, 5000);
        
        // Re-executar em eventos de tela
        window.addEventListener('resize', function() {
            setTimeout(forceCalendarNumbers, 200);
        });
        
        window.addEventListener('orientationchange', function() {
            setTimeout(forceCalendarNumbers, 500);
        });
        
        console.log('✅ Sistema de força de números ATIVADO!');
    }
    
    // Aguardar DOM e inicializar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeForceNumbers);
    } else {
        initializeForceNumbers();
    }
    
    console.log('🔥 FORÇA DE NÚMEROS DO CALENDÁRIO CARREGADA');
})();