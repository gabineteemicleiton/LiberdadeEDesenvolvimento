// Sistema de Cursos Comunitários
document.addEventListener('DOMContentLoaded', function() {
    console.log('📚 Sistema de Cursos Comunitários carregado');
    loadCursos();
    setupFilters();
});

let cursosData = [];

// Carregar cursos do JSON
async function loadCursos() {
    try {
        const response = await fetch('cursos.json');
        cursosData = await response.json();
        
        console.log('📖 Cursos carregados:', cursosData.length);
        
        // Atualizar estatísticas
        updateStats();
        
        // Renderizar cursos
        renderCursos(cursosData);
        
    } catch (error) {
        console.error('❌ Erro ao carregar cursos:', error);
        // Usar dados padrão se o arquivo não existir
        useDefaultCursos();
    }
}

// Dados padrão caso o arquivo JSON não exista
function useDefaultCursos() {
    cursosData = [
        {
            "id": 1,
            "titulo": "Informática Básica para Iniciantes",
            "descricao": "Aprenda o básico do computador, internet e ferramentas digitais essenciais para o dia a dia.",
            "categoria": "informatica",
            "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "apostila": "https://example.com/apostila-informatica.pdf",
            "duracao": "4 horas",
            "nivel": "Iniciante",
            "instrutor": "Prof. Carlos Silva",
            "certificado": true
        },
        {
            "id": 2,
            "titulo": "Empreendedorismo Local",
            "descricao": "Descubra como começar seu negócio na sua cidade e desenvolver a economia local.",
            "categoria": "empreendedorismo",
            "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "apostila": "https://example.com/apostila-empreendedorismo.pdf",
            "duracao": "6 horas",
            "nivel": "Intermediário",
            "instrutor": "Prof. Maria Santos",
            "certificado": true
        },
        {
            "id": 3,
            "titulo": "Direitos do Cidadão",
            "descricao": "Conheça seus direitos e deveres como cidadão brasileiro.",
            "categoria": "cidadania",
            "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "apostila": "https://example.com/apostila-cidadania.pdf",
            "duracao": "3 horas",
            "nivel": "Básico",
            "instrutor": "Dr. Ana Oliveira",
            "certificado": true
        },
        {
            "id": 4,
            "titulo": "Excel para Pequenos Negócios",
            "descricao": "Aprenda a usar o Excel para controlar finanças e organizar seu negócio.",
            "categoria": "informatica",
            "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "apostila": "https://example.com/apostila-excel.pdf",
            "duracao": "5 horas",
            "nivel": "Intermediário",
            "instrutor": "Prof. João Costa",
            "certificado": true
        }
    ];
    
    updateStats();
    renderCursos(cursosData);
}

// Atualizar estatísticas
function updateStats() {
    const totalCursosElement = document.getElementById('totalCursos');
    if (totalCursosElement) {
        totalCursosElement.textContent = cursosData.length;
    }
    
    // Atualizar contador de certificados
    const certificados = JSON.parse(localStorage.getItem('certificados') || '[]');
    const totalCertificadosElement = document.getElementById('totalCertificados');
    if (totalCertificadosElement) {
        totalCertificadosElement.textContent = certificados.length;
    }
}

// Renderizar cursos na tela
function renderCursos(cursos) {
    const container = document.getElementById('cursos-container');
    
    if (cursos.length === 0) {
        container.innerHTML = `
            <div class="no-courses">
                <i class="fas fa-book-open"></i>
                <h3>Nenhum curso encontrado</h3>
                <p>Não há cursos disponíveis no momento.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = cursos.map(curso => `
        <div class="curso-card" data-categoria="${curso.categoria}">
            <div class="curso-video">
                <iframe src="${curso.videoUrl}" frameborder="0" allowfullscreen></iframe>
                <div class="curso-badge">
                    <span class="nivel-badge ${curso.nivel.toLowerCase()}">${curso.nivel}</span>
                </div>
            </div>
            
            <div class="curso-content">
                <h3>${curso.titulo}</h3>
                <p class="curso-descricao">${curso.descricao}</p>
                
                <div class="curso-info">
                    <div class="info-item">
                        <i class="fas fa-clock"></i>
                        <span>${curso.duracao}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-user"></i>
                        <span>${curso.instrutor}</span>
                    </div>
                    ${curso.certificado ? '<div class="info-item"><i class="fas fa-certificate"></i><span>Certificado</span></div>' : ''}
                </div>
                
                <div class="curso-actions">
                    ${curso.apostila ? `<a href="${curso.apostila}" target="_blank" class="btn-apostila"><i class="fas fa-book"></i> Baixar Apostila</a>` : ''}
                    <button onclick="gerarCertificado('${curso.titulo}', '${curso.instrutor}')" class="btn-certificado">
                        <i class="fas fa-certificate"></i> Gerar Certificado
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Configurar filtros
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (filterButtons.length === 0) {
        console.log('⚠️ Botões de filtro não encontrados');
        return;
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover classe active de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adicionar classe active ao botão clicado
            this.classList.add('active');
            
            // Aplicar filtro
            const filter = this.dataset.filter;
            filterCursos(filter);
        });
    });
}

// Filtrar cursos por categoria
function filterCursos(categoria) {
    if (categoria === 'all') {
        renderCursos(cursosData);
    } else {
        const cursosFiltrados = cursosData.filter(curso => curso.categoria === categoria);
        renderCursos(cursosFiltrados);
    }
}

// Gerar certificado em PDF
function gerarCertificado(curso, instrutor) {
    const nome = prompt("Digite seu nome completo para o certificado:");
    if (!nome) {
        alert("Nome obrigatório para gerar o certificado.");
        return;
    }
    
    console.log('📄 Gerando certificado para:', nome, curso);
    
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('landscape', 'mm', 'a4');
        
        // Configurar fonte
        doc.setFont('helvetica');
        
        // Fundo decorativo
        doc.setFillColor(30, 64, 175); // Azul institucional
        doc.rect(0, 0, 297, 210, 'F');
        
        // Área branca central
        doc.setFillColor(255, 255, 255);
        doc.rect(20, 20, 257, 170, 'F');
        
        // Borda decorativa
        doc.setDrawColor(251, 191, 36); // Amarelo institucional
        doc.setLineWidth(3);
        doc.rect(25, 25, 247, 160);
        
        // Título
        doc.setTextColor(30, 64, 175);
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.text('CERTIFICADO DE CONCLUSÃO', 148.5, 60, { align: 'center' });
        
        // Linha decorativa
        doc.setDrawColor(251, 191, 36);
        doc.setLineWidth(2);
        doc.line(80, 70, 217, 70);
        
        // Texto principal
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'normal');
        doc.text('Certificamos que', 148.5, 90, { align: 'center' });
        
        // Nome do aluno
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 64, 175);
        doc.text(nome.toUpperCase(), 148.5, 110, { align: 'center' });
        
        // Curso
        doc.setFontSize(16);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(`concluiu com êxito o curso "${curso}"`, 148.5, 130, { align: 'center' });
        
        // Instrutor
        doc.setFontSize(14);
        doc.text(`ministrado por ${instrutor}`, 148.5, 145, { align: 'center' });
        
        // Data e local
        const hoje = new Date().toLocaleDateString('pt-BR');
        doc.setFontSize(12);
        doc.text(`Monte Santo - BA, ${hoje}`, 148.5, 165, { align: 'center' });
        
        // Assinatura
        doc.setTextColor(30, 64, 175);
        doc.setFont('helvetica', 'bold');
        doc.text('Gabinete Digital - Emicleiton Rubem da Conceição', 148.5, 180, { align: 'center' });
        
        // Salvar o PDF
        const nomeArquivo = `certificado-${nome.replace(/\s+/g, '-').toLowerCase()}-${curso.replace(/\s+/g, '-').toLowerCase()}.pdf`;
        doc.save(nomeArquivo);
        
        // Salvar registro do certificado
        salvarCertificado(nome, curso, hoje);
        
        // Mostrar sucesso
        showNotification('Certificado gerado com sucesso!', 'success');
        
    } catch (error) {
        console.error('❌ Erro ao gerar certificado:', error);
        alert('Erro ao gerar certificado. Tente novamente.');
    }
}

// Salvar registro do certificado
function salvarCertificado(nome, curso, data) {
    const certificados = JSON.parse(localStorage.getItem('certificados') || '[]');
    
    const certificado = {
        id: Date.now(),
        nome: nome,
        curso: curso,
        data: data,
        protocolo: `CERT${Date.now()}`
    };
    
    certificados.push(certificado);
    localStorage.setItem('certificados', JSON.stringify(certificados));
    
    // Atualizar contador
    const total = certificados.length;
    const totalCertificadosElement = document.getElementById('totalCertificados');
    if (totalCertificadosElement) {
        totalCertificadosElement.textContent = total;
    }
    
    console.log('📋 Certificado registrado:', certificado);
}

// Mostrar notificação
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Atualizar dados dos certificados ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    const certificados = JSON.parse(localStorage.getItem('certificados') || '[]');
    const totalCertificadosElement = document.getElementById('totalCertificados');
    
    if (totalCertificadosElement) {
        totalCertificadosElement.textContent = certificados.length;
    }
});