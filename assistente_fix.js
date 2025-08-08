// Arquivo de correção para o assistente digital
// Este arquivo contém as funções essenciais do assistente simplificado

// Função para gerar protocolo
function generateProtocol() {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 900000) + 100000;
    return `SGT${year}${randomNum}`;
}

// Função para salvar interação no localStorage
function salvarInteracao(interacao) {
    try {
        console.log('💾 Salvando interação:', interacao);
        const interacoes = JSON.parse(localStorage.getItem('interacoesRecebidas') || '[]');
        interacoes.push(interacao);
        localStorage.setItem('interacoesRecebidas', JSON.stringify(interacoes));
        console.log('✅ Interação salva com sucesso!');
        return true;
    } catch (error) {
        console.error('❌ Erro ao salvar interação:', error);
        return false;
    }
}

// Função para fechar formulários do assistente
function closeAssistantForm(button) {
    const formContainer = button.closest('.assistant-form-container');
    if (formContainer) {
        formContainer.remove();
    }
}