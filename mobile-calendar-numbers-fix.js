// CORREÇÃO ESPECÍFICA PARA NÚMEROS DO CALENDÁRIO MOBILE
// Garante que os números dos dias apareçam corretamente no mobile

(function() {
    'use strict';
    
    console.log('📱 Carregando correção dos números do calendário mobile...');
    
    let numbersFixInterval;
    
    // Função para verificar se é mobile
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Função para verificar se a agenda está ativa
    function isAgendaActive() {
        const agendaSection = document.getElementById('agenda');
        return agendaSection && agendaSection.classList.contains('active');
    }
    
    // Função principal para corrigir os números
    function fixCalendarNumbers() {
        if (!isMobile() || !isAgendaActive()) {
            console.log('📱 Mobile calendar numbers: condições não atendidas');
            return;
        }
        
        console.log('🔧 Corrigindo números do calendário mobile...');
        
        // Encontrar todos os dias do calendário
        const calendarDays = document.querySelectorAll('#agenda.active .calendar-day-modern');
        
        if (calendarDays.length === 0) {
            console.log('⚠️ Nenhum dia do calendário encontrado');
            return;
        }
        
        console.log(`📅 Encontrados ${calendarDays.length} dias do calendário`);
        
        // Corrigir cada dia individualmente
        calendarDays.forEach((day, index) => {
            // Pegar o texto original
            const originalText = day.textContent || day.innerText || '';
            const dayNumber = originalText.trim();
            
            if (dayNumber && dayNumber !== '') {
                // Forçar estilos para números visíveis
                day.style.cssText += `
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    font-size: 18px !important;
                    font-weight: 700 !important;
                    color: #1f2937 !important;
                    text-align: center !important;
                    line-height: 1 !important;
                    opacity: 1 !important;
                    visibility: visible !important;
                    width: 100% !important;
                    height: 48px !important;
                    background: #ffffff !important;
                    border: 2px solid #e5e7eb !important;
                    border-radius: 12px !important;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05) !important;
                    cursor: pointer !important;
                    transition: all 0.2s ease !important;
                    position: relative !important;
                    z-index: 2 !important;
                    text-indent: 0 !important;
                    white-space: nowrap !important;
                    overflow: visible !important;
                `;
                
                // Garantir que o texto esteja presente
                if (!day.textContent || day.textContent.trim() === '') {
                    day.textContent = dayNumber;
                }
                
                // Aplicar estilos especiais baseado na classe
                if (day.classList.contains('current')) {
                    day.style.cssText += `
                        background: linear-gradient(135deg, #3b82f6, #1e40af) !important;
                        color: #ffffff !important;
                        border-color: #1e40af !important;
                        font-weight: 800 !important;
                        font-size: 20px !important;
                        box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5) !important;
                        transform: scale(1.08) !important;
                        text-shadow: 0 1px 2px rgba(0,0,0,0.2) !important;
                    `;
                }
                
                if (day.classList.contains('event')) {
                    day.style.cssText += `
                        background: linear-gradient(135deg, #10b981, #059669) !important;
                        color: #ffffff !important;
                        border-color: #059669 !important;
                        font-weight: 800 !important;
                        text-shadow: 0 1px 2px rgba(0,0,0,0.2) !important;
                    `;
                    
                    // Adicionar indicador de evento se não existir
                    if (!day.querySelector('.event-indicator')) {
                        const indicator = document.createElement('span');
                        indicator.className = 'event-indicator';
                        indicator.style.cssText = `
                            position: absolute !important;
                            bottom: 2px !important;
                            right: 6px !important;
                            font-size: 12px !important;
                            color: #fbbf24 !important;
                            text-shadow: 0 1px 1px rgba(0,0,0,0.3) !important;
                        `;
                        indicator.textContent = '•';
                        day.appendChild(indicator);
                    }
                }
                
                if (day.classList.contains('inactive')) {
                    day.style.cssText += `
                        color: #9ca3af !important;
                        background: #f9fafb !important;
                        border-color: #f3f4f6 !important;
                        cursor: default !important;
                        opacity: 0.6 !important;
                    `;
                }
                
                console.log(`✅ Dia ${dayNumber} corrigido`);
            }
        });
        
        console.log('✅ Todos os números do calendário corrigidos!');
    }
    
    // Função para observar mudanças no calendário
    function observeCalendarChanges() {
        const calendarContainer = document.querySelector('#agenda .calendar-days-modern');
        if (!calendarContainer) return;
        
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    console.log('🔄 Mudança detectada no calendário, reaplicando correções...');
                    setTimeout(fixCalendarNumbers, 100);
                }
            });
        });
        
        observer.observe(calendarContainer, {
            childList: true,
            subtree: true,
            characterData: true
        });
        
        console.log('👁️ Observador de mudanças do calendário ativado');
    }
    
    // Função para inicializar correções
    function initializeNumbersFix() {
        console.log('🚀 Inicializando correção de números do calendário...');
        
        // Executar correção inicial
        setTimeout(fixCalendarNumbers, 500);
        
        // Configurar observador
        setTimeout(observeCalendarChanges, 1000);
        
        // Executar correção periodicamente quando agenda ativa
        numbersFixInterval = setInterval(function() {
            if (isMobile() && isAgendaActive()) {
                fixCalendarNumbers();
            }
        }, 3000);
        
        // Re-executar em mudanças de tela
        window.addEventListener('resize', function() {
            setTimeout(fixCalendarNumbers, 300);
        });
        
        // Re-executar em mudanças de orientação
        window.addEventListener('orientationchange', function() {
            setTimeout(fixCalendarNumbers, 800);
        });
        
        console.log('✅ Sistema de correção de números ativado');
    }
    
    // Aguardar DOM estar pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeNumbersFix);
    } else {
        initializeNumbersFix();
    }
    
    console.log('📱 Correção dos números do calendário mobile carregada');
})();