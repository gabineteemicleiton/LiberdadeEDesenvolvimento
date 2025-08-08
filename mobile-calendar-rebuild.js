// RECONSTRUÇÃO COMPLETA DO CALENDÁRIO PARA MOBILE
// Substitui completamente o HTML do calendário no mobile para garantir funcionamento

(function() {
    'use strict';
    
    console.log('🚀 RECONSTRUINDO CALENDÁRIO MOBILE COMPLETAMENTE...');
    
    let rebuildInterval;
    
    // Verificar se é mobile
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Verificar se agenda está ativa
    function isAgendaActive() {
        const agenda = document.getElementById('agenda');
        return agenda && agenda.classList.contains('active');
    }
    
    // Dados dos eventos (sincronizar com o script principal)
    const eventDates = {
        '2': 'Sessão Ordinária da Câmara',
        '5': 'Audiência Pública - Saúde', 
        '8': 'Reunião com Comerciantes',
        '15': 'Visita às Obras da UBS',
        '30': 'Prestação de Contas'
    };
    
    // Função para reconstruir completamente o calendário
    function rebuildMobileCalendar() {
        if (!isMobile() || !isAgendaActive()) {
            console.log('❌ Condições não atendidas para reconstrução');
            return;
        }
        
        console.log('🔨 RECONSTRUINDO calendário mobile...');
        
        // Encontrar o container do calendário
        const calendarContainer = document.querySelector('#agenda.active .calendar-days-modern');
        if (!calendarContainer) {
            console.warn('⚠️ Container do calendário não encontrado');
            return;
        }
        
        // Limpar completamente o container
        calendarContainer.innerHTML = '';
        
        // Obter data atual
        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        // Calcular primeiro dia do mês e total de dias
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
        
        let dayCount = 1;
        let nextMonthDay = 1;
        
        console.log(`📅 Mês: ${currentMonth + 1}/${currentYear}, Dias: ${daysInMonth}, Começa: ${firstDay}`);
        
        // Criar todas as 42 células (6 semanas × 7 dias)
        for (let i = 0; i < 42; i++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day-modern';
            
            let dayNumber;
            let isCurrentMonth = false;
            let isCurrent = false;
            let hasEvent = false;
            
            if (i < firstDay) {
                // Dias do mês anterior
                dayNumber = prevMonthDays - (firstDay - i - 1);
                dayCell.classList.add('inactive');
            } else if (dayCount <= daysInMonth) {
                // Dias do mês atual
                dayNumber = dayCount;
                isCurrentMonth = true;
                
                // Verificar se é o dia atual
                if (dayNumber === currentDay) {
                    dayCell.classList.add('current');
                    isCurrent = true;
                }
                
                // Verificar se tem evento
                if (eventDates[dayNumber.toString()]) {
                    dayCell.classList.add('event');
                    hasEvent = true;
                }
                
                dayCount++;
            } else {
                // Dias do mês seguinte
                dayNumber = nextMonthDay;
                dayCell.classList.add('inactive');
                nextMonthDay++;
            }
            
            // Definir o conteúdo
            dayCell.textContent = dayNumber.toString();
            dayCell.setAttribute('data-day', dayNumber);
            
            // FORÇAR ESTILOS DIRETAMENTE NO ELEMENTO
            const baseStyles = `
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                width: 100% !important;
                height: 50px !important;
                min-height: 50px !important;
                font-family: 'Inter', sans-serif !important;
                font-size: 16px !important;
                font-weight: 700 !important;
                line-height: 1 !important;
                text-align: center !important;
                background: #ffffff !important;
                border: 2px solid #e5e7eb !important;
                border-radius: 10px !important;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05) !important;
                cursor: pointer !important;
                transition: all 0.2s ease !important;
                opacity: 1 !important;
                visibility: visible !important;
                z-index: 1 !important;
                text-indent: 0 !important;
                white-space: nowrap !important;
                overflow: visible !important;
                box-sizing: border-box !important;
                position: relative !important;
                color: #1f2937 !important;
            `;
            
            dayCell.style.cssText = baseStyles;
            
            // Aplicar estilos especiais
            if (isCurrent) {
                dayCell.style.cssText += `
                    background: linear-gradient(135deg, #3b82f6, #1e40af) !important;
                    color: #ffffff !important;
                    border-color: #1e40af !important;
                    font-weight: 800 !important;
                    font-size: 18px !important;
                    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4) !important;
                    transform: scale(1.05) !important;
                    z-index: 3 !important;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) !important;
                `;
            } else if (hasEvent) {
                dayCell.style.cssText += `
                    background: linear-gradient(135deg, #10b981, #059669) !important;
                    color: #ffffff !important;
                    border-color: #059669 !important;
                    font-weight: 800 !important;
                    font-size: 16px !important;
                    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3) !important;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) !important;
                `;
                
                // Adicionar indicador de evento
                const indicator = document.createElement('span');
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
                dayCell.appendChild(indicator);
            } else if (!isCurrentMonth) {
                dayCell.style.cssText += `
                    color: #9ca3af !important;
                    background: #f9fafb !important;
                    border-color: #f3f4f6 !important;
                    cursor: default !important;
                    opacity: 0.7 !important;
                    font-weight: 400 !important;
                `;
            }
            
            // Adicionar evento de hover para dias ativos
            if (isCurrentMonth && !isCurrent) {
                dayCell.addEventListener('mouseenter', function() {
                    if (!this.classList.contains('event')) {
                        this.style.cssText += `
                            background: #f8fafc !important;
                            border-color: #3b82f6 !important;
                            transform: translateY(-2px) !important;
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
                        `;
                    }
                });
                
                dayCell.addEventListener('mouseleave', function() {
                    if (!this.classList.contains('event')) {
                        this.style.cssText = baseStyles;
                    }
                });
            }
            
            calendarContainer.appendChild(dayCell);
        }
        
        // Forçar o grid layout no container
        calendarContainer.style.cssText = `
            display: grid !important;
            grid-template-columns: repeat(7, 1fr) !important;
            grid-template-rows: repeat(6, 50px) !important;
            gap: 4px !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
        `;
        
        console.log('✅ CALENDÁRIO MOBILE RECONSTRUÍDO COM SUCESSO!');
        console.log(`📊 Total de células criadas: ${calendarContainer.children.length}`);
    }
    
    // Função para observar mudanças na agenda
    function setupAgendaObserver() {
        const agenda = document.getElementById('agenda');
        if (!agenda) return;
        
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (isAgendaActive() && isMobile()) {
                        setTimeout(rebuildMobileCalendar, 300);
                    }
                }
            });
        });
        
        observer.observe(agenda, {
            attributes: true,
            attributeFilter: ['class']
        });
        
        console.log('👁️ Observador da agenda configurado para reconstrução');
    }
    
    // Função de inicialização
    function initializeCalendarRebuild() {
        console.log('🚀 INICIALIZANDO sistema de reconstrução do calendário...');
        
        // Executar reconstrução inicial se necessário
        if (isMobile() && isAgendaActive()) {
            setTimeout(rebuildMobileCalendar, 500);
        }
        
        // Configurar observador
        setupAgendaObserver();
        
        // Reconstruir em mudanças de tela
        window.addEventListener('resize', function() {
            if (isMobile() && isAgendaActive()) {
                setTimeout(rebuildMobileCalendar, 300);
            }
        });
        
        window.addEventListener('orientationchange', function() {
            if (isMobile() && isAgendaActive()) {
                setTimeout(rebuildMobileCalendar, 600);
            }
        });
        
        // Reconstruir periodicamente quando necessário
        rebuildInterval = setInterval(function() {
            if (isMobile() && isAgendaActive()) {
                rebuildMobileCalendar();
            }
        }, 10000); // A cada 10 segundos
        
        console.log('✅ Sistema de reconstrução de calendário ATIVO!');
    }
    
    // Aguardar DOM e inicializar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCalendarRebuild);
    } else {
        initializeCalendarRebuild();
    }
    
    console.log('🔥 SISTEMA DE RECONSTRUÇÃO DO CALENDÁRIO CARREGADO');
})();