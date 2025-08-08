// Sistema de Edição de Cursos
document.addEventListener('DOMContentLoaded', function() {
    console.log('📝 Editor de Cursos carregado');
    loadCursosAdmin();
    setupEventListeners();
    updateStats();
});

let cursosData = [];

// Configurar event listeners
function setupEventListeners() {
    // Formulário de adicionar curso
    const formCurso = document.getElementById('formCurso');
    if (formCurso) {
        formCurso.addEventListener('submit', adicionarCurso);
    }
    
    // Formulário de editar curso
    const editForm = document.getElementById('editForm');
    if (editForm) {
        editForm.addEventListener('submit', salvarEdicao);
    }
    
    // Busca de cursos
    const searchCursos = document.getElementById('searchCursos');
    if (searchCursos) {
        searchCursos.addEventListener('input', filterCursos);
    }
    
    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeEditModal();
        }
    });
}

// Carregar cursos para administração
async function loadCursosAdmin() {
    try {
        // Tentar carregar do arquivo JSON
        const response = await fetch('cursos.json');
        cursosData = await response.json();
        console.log('📚 Cursos carregados do JSON:', cursosData.length);
    } catch (error) {
        console.log('💾 Carregando do localStorage...');
        // Carregar do localStorage se o arquivo não existir
        cursosData = JSON.parse(localStorage.getItem('cursosData') || '[]');
        
        // Se não houver dados, usar dados padrão
        if (cursosData.length === 0) {
            await loadDefaultCursos();
        }
    }
    
    renderCursosAdmin();
    updateStats();
}

// Carregar dados padrão
async function loadDefaultCursos() {
    cursosData = [
        {
            "id": 1,
            "titulo": "Informática Básica para Iniciantes",
            "descricao": "Aprenda o básico do computador, internet e ferramentas digitais essenciais para o dia a dia.",
            "categoria": "informatica",
            "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "apostila": "",
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
            "apostila": "",
            "duracao": "6 horas",
            "nivel": "Intermediário",
            "instrutor": "Prof. Maria Santos",
            "certificado": true
        }
    ];
    
    // Salvar no localStorage
    saveCursos();
}

// Adicionar novo curso
async function adicionarCurso(event) {
    event.preventDefault();
    
    // Coletar dados do formulário
    const novoCurso = {
        id: Date.now(),
        titulo: document.getElementById('titulo').value,
        descricao: document.getElementById('descricao').value,
        categoria: document.getElementById('categoria').value,
        videoUrl: document.getElementById('videoUrl').value,
        apostila: document.getElementById('apostila').value,
        duracao: document.getElementById('duracao').value,
        nivel: document.getElementById('nivel').value,
        instrutor: document.getElementById('instrutor').value,
        certificado: true
    };
    
    // Validar dados
    if (!validarCurso(novoCurso)) {
        return;
    }
    
    console.log('➕ Adicionando novo curso:', novoCurso.titulo);
    
    // Adicionar ao array
    cursosData.push(novoCurso);
    
    // Salvar dados
    await saveCursos();
    
    // Atualizar interface
    renderCursosAdmin();
    updateStats();
    
    // Limpar formulário
    document.getElementById('formCurso').reset();
    
    // Mostrar sucesso
    showNotification('Curso adicionado com sucesso!', 'success');
}

// Validar dados do curso
function validarCurso(curso) {
    if (!curso.titulo.trim()) {
        showNotification('Título é obrigatório!', 'error');
        return false;
    }
    
    if (!curso.videoUrl.includes('youtube.com/embed/')) {
        showNotification('Use o link de incorporação do YouTube (embed)!', 'error');
        return false;
    }
    
    return true;
}

// Salvar cursos
async function saveCursos() {
    try {
        // Salvar no localStorage
        localStorage.setItem('cursosData', JSON.stringify(cursosData));
        
        // Tentar salvar no arquivo JSON (simulação)
        console.log('💾 Dados salvos no localStorage');
        
        // Atualizar o arquivo JSON na memória para download
        updateJSONFile();
        
        return true;
    } catch (error) {
        console.error('❌ Erro ao salvar:', error);
        showNotification('Erro ao salvar dados!', 'error');
        return false;
    }
}

// Atualizar arquivo JSON para download
function updateJSONFile() {
    const dataStr = JSON.stringify(cursosData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    // Criar link de download invisível
    let downloadLink = document.getElementById('downloadJSON');
    if (!downloadLink) {
        downloadLink = document.createElement('a');
        downloadLink.id = 'downloadJSON';
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
    }
    
    downloadLink.setAttribute('href', dataUri);
    downloadLink.setAttribute('download', 'cursos.json');
}

// Renderizar lista de cursos para admin
function renderCursosAdmin() {
    const container = document.getElementById('cursosLista');
    
    if (cursosData.length === 0) {
        container.innerHTML = `
            <div class="no-courses-admin">
                <i class="fas fa-book-open"></i>
                <h3>Nenhum curso cadastrado</h3>
                <p>Adicione o primeiro curso usando o formulário acima.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = cursosData.map(curso => `
        <div class="curso-admin-item" data-id="${curso.id}">
            <div class="curso-admin-info">
                <h4>${curso.titulo}</h4>
                <p>${curso.descricao}</p>
                <div class="curso-admin-meta">
                    <span class="meta-item">
                        <i class="fas fa-tag"></i> ${getCategoriaLabel(curso.categoria)}
                    </span>
                    <span class="meta-item">
                        <i class="fas fa-clock"></i> ${curso.duracao}
                    </span>
                    <span class="meta-item">
                        <i class="fas fa-layer-group"></i> ${curso.nivel}
                    </span>
                    <span class="meta-item">
                        <i class="fas fa-user"></i> ${curso.instrutor}
                    </span>
                </div>
            </div>
            <div class="curso-admin-actions">
                <button onclick="editarCurso(${curso.id})" class="btn-edit" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="removerCurso(${curso.id})" class="btn-delete" title="Remover">
                    <i class="fas fa-trash"></i>
                </button>
                <button onclick="visualizarCurso(${curso.id})" class="btn-view" title="Visualizar">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    // Atualizar contador
    const totalCursosAdminElement = document.getElementById('totalCursosAdmin');
    if (totalCursosAdminElement) {
        totalCursosAdminElement.textContent = cursosData.length;
    }
}

// Obter label da categoria
function getCategoriaLabel(categoria) {
    const labels = {
        'informatica': 'Informática',
        'empreendedorismo': 'Empreendedorismo',
        'cidadania': 'Cidadania'
    };
    return labels[categoria] || categoria;
}

// Editar curso
function editarCurso(id) {
    const curso = cursosData.find(c => c.id === id);
    if (!curso) return;
    
    console.log('✏️ Editando curso:', curso.titulo);
    
    // Preencher formulário de edição
    document.getElementById('editId').value = curso.id;
    document.getElementById('editTitulo').value = curso.titulo;
    document.getElementById('editDescricao').value = curso.descricao;
    document.getElementById('editCategoria').value = curso.categoria;
    document.getElementById('editVideoUrl').value = curso.videoUrl;
    document.getElementById('editApostila').value = curso.apostila || '';
    document.getElementById('editDuracao').value = curso.duracao;
    document.getElementById('editNivel').value = curso.nivel;
    document.getElementById('editInstrutor').value = curso.instrutor;
    
    // Mostrar modal
    document.getElementById('editModal').classList.add('active');
}

// Salvar edição
async function salvarEdicao(event) {
    event.preventDefault();
    
    const id = parseInt(document.getElementById('editId').value);
    const index = cursosData.findIndex(c => c.id === id);
    
    if (index === -1) {
        showNotification('Curso não encontrado!', 'error');
        return;
    }
    
    // Atualizar dados
    cursosData[index] = {
        ...cursosData[index],
        titulo: document.getElementById('editTitulo').value,
        descricao: document.getElementById('editDescricao').value,
        categoria: document.getElementById('editCategoria').value,
        videoUrl: document.getElementById('editVideoUrl').value,
        apostila: document.getElementById('editApostila').value,
        duracao: document.getElementById('editDuracao').value,
        nivel: document.getElementById('editNivel').value,
        instrutor: document.getElementById('editInstrutor').value
    };
    
    console.log('💾 Salvando edição do curso:', cursosData[index].titulo);
    
    // Salvar dados
    await saveCursos();
    
    // Atualizar interface
    renderCursosAdmin();
    closeEditModal();
    
    showNotification('Curso atualizado com sucesso!', 'success');
}

// Remover curso
async function removerCurso(id) {
    const curso = cursosData.find(c => c.id === id);
    if (!curso) return;
    
    if (!confirm(`Tem certeza que deseja remover o curso "${curso.titulo}"?`)) {
        return;
    }
    
    console.log('🗑️ Removendo curso:', curso.titulo);
    
    // Remover do array
    cursosData = cursosData.filter(c => c.id !== id);
    
    // Salvar dados
    await saveCursos();
    
    // Atualizar interface
    renderCursosAdmin();
    updateStats();
    
    showNotification('Curso removido com sucesso!', 'success');
}

// Visualizar curso
function visualizarCurso(id) {
    window.open(`cursos.html#curso-${id}`, '_blank');
}

// Fechar modal de edição
function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
}

// Filtrar cursos
function filterCursos() {
    const search = document.getElementById('searchCursos').value.toLowerCase();
    const items = document.querySelectorAll('.curso-admin-item');
    
    items.forEach(item => {
        const titulo = item.querySelector('h4').textContent.toLowerCase();
        const descricao = item.querySelector('p').textContent.toLowerCase();
        
        if (titulo.includes(search) || descricao.includes(search)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Atualizar estatísticas
function updateStats() {
    const statCursosElement = document.getElementById('statCursos');
    if (statCursosElement) {
        statCursosElement.textContent = cursosData.length;
    }
    
    // Contar certificados emitidos
    const certificados = JSON.parse(localStorage.getItem('certificados') || '[]');
    const statCertificadosElement = document.getElementById('statCertificados');
    if (statCertificadosElement) {
        statCertificadosElement.textContent = certificados.length;
    }
}

// Mostrar notificação
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
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

// Exportar dados
function exportarDados() {
    const downloadLink = document.getElementById('downloadJSON');
    if (downloadLink) {
        downloadLink.click();
        showNotification('Arquivo JSON baixado!', 'success');
    }
}

// Adicionar botão de exportar ao cabeçalho
document.addEventListener('DOMContentLoaded', function() {
    const headerActions = document.querySelector('.header-actions');
    const exportBtn = document.createElement('button');
    exportBtn.className = 'btn-secondary';
    exportBtn.onclick = exportarDados;
    exportBtn.innerHTML = '<i class="fas fa-download"></i> Exportar JSON';
    headerActions.insertBefore(exportBtn, headerActions.firstChild);
});