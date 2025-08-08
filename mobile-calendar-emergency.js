// CORREÇÃO DE EMERGÊNCIA PARA CALENDÁRIO MOBILE
// Este script força o calendário a aparecer corretamente no celular

(function() {
    'use strict';
    
    console.log('🚨 Iniciando correção de emergência do calendário mobile...');
    
    let isFixing = false;
    let fixInterval;
    
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               window.innerWidth <= 768 || 
               window.screen.width <= 768;
    }
    
    function emergencyCalendarFix() {
        if (!isMobileDevice() || isFixing) return;
        
        // Verificar se a seção agenda está ativa
        const agendaSection = document.getElementById('agenda');
        if (!agendaSection || !agendaSection.classList.contains('active')) {
            console.log('📱 Agenda não está ativa - pulando correção de emergência');
            return;
        }
        
        isFixing = true;
        console.log('📱 Aplicando correção de emergência do calendário...');
        
        try {
            // Encontrar e corrigir todos os elementos do calendário
            const calendarSelectors = [
                '.agenda-publica',
                '#agenda', 
                '.agenda-modern-layout',
                '.modern-calendar-container',
                '.calendar-container'
            ];
            
            calendarSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    if (el) {
                        // Força estilos container
                        el.style.cssText = `
                            width: 100% !important;
                            max-width: calc(100vw - 20px) !important;
                            margin: 10px auto !important;
                            padding: 15px !important;
                            box-sizing: border-box !important;
                            background: white !important;
                            border-radius: 15px !important;
                            box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
                            overflow: visible !important;
                            display: block !important;
                            position: relative !important;
                            z-index: 1 !important;
                        `;
                    }
                });
            });
            
            // Corrigir grid do calendário
            const gridSelectors = [
                '.calendar-grid-modern',
                '.calendar-grid',
                '.calendar-days',
                '.days-grid'
            ];
            
            gridSelectors.forEach(selector => {
                const grids = document.querySelectorAll(selector);
                grids.forEach(grid => {
                    if (grid) {
                        grid.style.cssText = `
                            display: grid !important;
                            grid-template-columns: repeat(7, 1fr) !important;
                            gap: 3px !important;
                            width: 100% !important;
                            max-width: 100% !important;
                            box-sizing: border-box !important;
                            overflow: visible !important;
                            margin: 0 !important;
                            padding: 0 !important;
                        `;
                    }
                });
            });
            
            // Corrigir células dos dias
            const daySelectors = [
                '.calendar-day-modern',
                '.calendar-day',
                '.day',
                '.day-cell'
            ];
            
            daySelectors.forEach(selector => {
                const days = document.querySelectorAll(selector);
                days.forEach(day => {
                    if (day) {
                        day.style.cssText = `
                            width: 100% !important;
                            height: 45px !important;
                            min-height: 45px !important;
                            max-height: 45px !important;
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
                            opacity: 1 !important;
                            visibility: visible !important;
                            z-index: 1 !important;
                            aspect-ratio: 1 !important;
                        `;
                        
                        // Garantir que o texto seja visível
                        if (day.textContent) {
                            day.style.color = '#374151 !important';
                            day.style.fontSize = '16px !important';
                            day.style.fontWeight = '600 !important';
                        }
                        
                        // Estados especiais
                        if (day.classList.contains('current')) {
                            day.style.background = 'linear-gradient(135deg, #3b82f6, #1e40af) !important';
                            day.style.color = 'white !important';
                            day.style.borderColor = '#1e40af !important';
                        }
                        
                        if (day.classList.contains('event')) {
                            day.style.background = 'linear-gradient(135deg, #10b981, #059669) !important';
                            day.style.color = 'white !important';
                            day.style.borderColor = '#059669 !important';
                        }
                    }
                });
            });
            
            // Corrigir header do calendário
            const headerSelectors = [
                '.calendar-header-modern',
                '.calendar-header'
            ];
            
            headerSelectors.forEach(selector => {
                const headers = document.querySelectorAll(selector);
                headers.forEach(header => {
                    if (header) {
                        header.style.cssText = `
                            display: flex !important;
                            justify-content: space-between !important;
                            align-items: center !important;
                            margin-bottom: 20px !important;
                            padding: 0 10px !important;
                            width: 100% !important;
                            box-sizing: border-box !important;
                        `;
                    }
                });
            });
            
            // Corrigir dias da semana
            const weekdaySelectors = [
                '.calendar-weekdays-modern',
                '.calendar-weekdays',
                '.weekdays'
            ];
            
            weekdaySelectors.forEach(selector => {
                const weekdays = document.querySelectorAll(selector);
                weekdays.forEach(weekday => {
                    if (weekday) {
                        weekday.style.cssText = `
                            display: grid !important;
                            grid-template-columns: repeat(7, 1fr) !important;
                            gap: 2px !important;
                            margin-bottom: 10px !important;
                            width: 100% !important;
                            box-sizing: border-box !important;
                        `;
                        
                        // Corrigir células dos dias da semana
                        const weekdayCells = weekday.querySelectorAll('*');
                        weekdayCells.forEach(cell => {
                            cell.style.cssText = `
                                text-align: center !important;
                                font-weight: 600 !important;
                                color: #6b7280 !important;
                                font-size: 12px !important;
                                padding: 8px 4px !important;
                                background: #f9fafb !important;
                                border-radius: 6px !important;
                                text-transform: uppercase !important;
                            `;
                        });
                    }
                });
            });
            
            console.log('✅ Correção de emergência aplicada com sucesso');
            
        } catch (error) {
            console.error('❌ Erro na correção de emergência:', error);
        }
        
        isFixing = false;
    }
    
    // Função para recriar o calendário se necessário
    function recreateCalendar() {
        if (!isMobileDevice()) return;
        
        console.log('🔄 Verificando se precisa recriar calendário...');
        
        const calendarExists = document.querySelector('.calendar-grid-modern, .calendar-grid, .calendar-days');
        const hasVisibleDays = document.querySelectorAll('.calendar-day-modern, .calendar-day, .day').length > 0;
        
        if (calendarExists && !hasVisibleDays) {
            console.log('📅 Recriando dias do calendário...');
            
            // Tentar recriar estrutura básica se não existir
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            
            // Encontrar grid do calendário
            const grid = document.querySelector('.calendar-grid-modern, .calendar-grid, .calendar-days');
            if (grid && grid.children.length === 0) {
                // Criar dias do mês
                const firstDay = new Date(year, month, 1).getDay();
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                
                // Adicionar células vazias para o início do mês
                for (let i = 0; i < firstDay; i++) {
                    const emptyCell = document.createElement('div');
                    emptyCell.className = 'calendar-day-modern empty';
                    grid.appendChild(emptyCell);
                }
                
                // Adicionar dias do mês
                for (let day = 1; day <= daysInMonth; day++) {
                    const dayCell = document.createElement('div');
                    dayCell.className = 'calendar-day-modern';
                    dayCell.textContent = day;
                    
                    if (day === currentDate.getDate()) {
                        dayCell.classList.add('current');
                    }
                    
                    grid.appendChild(dayCell);
                }
                
                console.log('📅 Calendário recriado com sucesso');
            }
        }
    }
    
    // Executar correção inicial
    setTimeout(() => {
        emergencyCalendarFix();
        recreateCalendar();
    }, 500);
    
    // Executar quando DOM carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                emergencyCalendarFix();
                recreateCalendar();
            }, 1000);
        });
    }
    
    // Executar em intervalos regulares no mobile
    if (isMobileDevice()) {
        fixInterval = setInterval(() => {
            emergencyCalendarFix();
        }, 3000);
        
        // Parar após 30 segundos para não consumir recursos
        setTimeout(() => {
            if (fixInterval) {
                clearInterval(fixInterval);
                console.log('🔧 Correção automática finalizada');
            }
        }, 30000);
    }
    
    // Executar ao redimensionar
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (isMobileDevice()) {
                emergencyCalendarFix();
            }
        }, 300);
    });
    
    // Executar ao mudar orientação
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            if (isMobileDevice()) {
                emergencyCalendarFix();
                recreateCalendar();
            }
        }, 500);
    });
    
    // Observer para mudanças no DOM
    const observer = new MutationObserver(() => {
        if (isMobileDevice()) {
            setTimeout(emergencyCalendarFix, 100);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
    });
    
    console.log('🚨 Sistema de correção de emergência do calendário ativado');
})();