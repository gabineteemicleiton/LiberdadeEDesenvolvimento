// Script para forçar o calendário a aparecer corretamente no mobile
// Arquivo: mobile-calendar-force.js

(function() {
    'use strict';
    
    console.log('📱 Iniciando correção do calendário mobile...');
    
    // Função para detectar se é mobile
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Função para corrigir o calendário no mobile
    function fixMobileCalendar() {
        if (!isMobile()) return;
        
        // Verificar se a seção agenda está ativa antes de aplicar correções
        const agendaSection = document.getElementById('agenda');
        if (!agendaSection || !agendaSection.classList.contains('active')) {
            console.log('📱 Agenda não está ativa - pulando correções do calendário');
            return;
        }
        
        console.log('🔧 Aplicando correções do calendário mobile...');
        
        // Selecionar todos os elementos do calendário
        const calendarContainers = document.querySelectorAll(
            '.modern-calendar-container, .calendar-container, .agenda-modern-layout'
        );
        
        const calendarGrids = document.querySelectorAll(
            '.calendar-grid-modern, .calendar-grid, .calendar-days'
        );
        
        const calendarDays = document.querySelectorAll(
            '.calendar-day-modern, .calendar-day, .day'
        );
        
        // Forçar estilos nos containers
        calendarContainers.forEach(container => {
            if (container) {
                container.style.cssText += `
                    width: 100% !important;
                    max-width: calc(100vw - 20px) !important;
                    margin: 0 10px !important;
                    padding: 15px !important;
                    box-sizing: border-box !important;
                    background: white !important;
                    border-radius: 15px !important;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
                    overflow: hidden !important;
                `;
            }
        });
        
        // Forçar grid do calendário
        calendarGrids.forEach(grid => {
            if (grid) {
                grid.style.cssText += `
                    display: grid !important;
                    grid-template-columns: repeat(7, 1fr) !important;
                    gap: 3px !important;
                    width: 100% !important;
                    max-width: 100% !important;
                    box-sizing: border-box !important;
                    overflow: hidden !important;
                `;
            }
        });
        
        // Forçar estilos nos dias
        calendarDays.forEach(day => {
            if (day) {
                day.style.cssText += `
                    width: 100% !important;
                    aspect-ratio: 1 !important;
                    min-height: 42px !important;
                    max-height: 42px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    font-size: 16px !important;
                    font-weight: 600 !important;
                    border-radius: 8px !important;
                    text-align: center !important;
                    box-sizing: border-box !important;
                    color: #374151 !important;
                    background: #ffffff !important;
                    border: 2px solid #e5e7eb !important;
                    cursor: pointer !important;
                    transition: all 0.2s ease !important;
                    line-height: 1 !important;
                    position: relative !important;
                    overflow: hidden !important;
                `;
                
                // Adicionar hover
                day.addEventListener('mouseenter', function() {
                    if (isMobile()) {
                        this.style.background = '#f3f4f6';
                        this.style.transform = 'scale(1.05)';
                        this.style.zIndex = '2';
                    }
                });
                
                day.addEventListener('mouseleave', function() {
                    if (isMobile() && !this.classList.contains('current') && !this.classList.contains('event')) {
                        this.style.background = '#ffffff';
                        this.style.transform = 'scale(1)';
                        this.style.zIndex = '1';
                    }
                });
            }
        });
        
        // Verificar se há dias com eventos e destacar
        const eventDays = document.querySelectorAll('.calendar-day-modern.event, .calendar-day.event, .day.event');
        eventDays.forEach(day => {
            day.style.cssText += `
                background: linear-gradient(135deg, #10b981, #059669) !important;
                color: white !important;
                border-color: #059669 !important;
                font-weight: 700 !important;
                box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4) !important;
            `;
        });
        
        // Verificar dia atual
        const currentDays = document.querySelectorAll('.calendar-day-modern.current, .calendar-day.current, .day.current');
        currentDays.forEach(day => {
            day.style.cssText += `
                background: linear-gradient(135deg, #3b82f6, #1e40af) !important;
                color: white !important;
                border-color: #1e40af !important;
                font-weight: 700 !important;
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4) !important;
            `;
        });
        
        console.log('✅ Correções do calendário mobile aplicadas');
    }
    
    // Função para monitorar mudanças no DOM
    function observeCalendar() {
        const observer = new MutationObserver(function(mutations) {
            let shouldFix = false;
            
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    const addedNodes = Array.from(mutation.addedNodes);
                    const hasCalendarNodes = addedNodes.some(node => 
                        node.nodeType === 1 && (
                            node.classList && (
                                node.classList.contains('calendar-day-modern') ||
                                node.classList.contains('calendar-day') ||
                                node.classList.contains('calendar-grid-modern') ||
                                node.classList.contains('calendar-grid')
                            )
                        )
                    );
                    
                    if (hasCalendarNodes) {
                        shouldFix = true;
                    }
                }
            });
            
            if (shouldFix && isMobile()) {
                setTimeout(fixMobileCalendar, 100);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        return observer;
    }
    
    // Executar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(fixMobileCalendar, 500);
            observeCalendar();
        });
    } else {
        setTimeout(fixMobileCalendar, 100);
        observeCalendar();
    }
    
    // Executar quando a janela for redimensionada
    window.addEventListener('resize', function() {
        setTimeout(fixMobileCalendar, 200);
    });
    
    // Executar quando a orientação mudar
    window.addEventListener('orientationchange', function() {
        setTimeout(fixMobileCalendar, 300);
    });
    
    // Forçar execução a cada 2 segundos no mobile (como fallback)
    if (isMobile()) {
        setInterval(function() {
            const calendarExists = document.querySelector('.calendar-grid-modern, .calendar-grid, .calendar-days');
            if (calendarExists) {
                fixMobileCalendar();
            }
        }, 2000);
    }
    
    console.log('📱 Sistema de correção do calendário mobile ativado');
})();