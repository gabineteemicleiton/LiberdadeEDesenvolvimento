// Script para popular dados de teste no localStorage
(function() {
    console.log('🔧 Populando dados de teste...');
    
    function generateProtocol() {
        const year = new Date().getFullYear();
        const randomNum = Math.floor(Math.random() * 900000) + 100000;
        return `SGT${year}${randomNum}`;
    }
    
    const interacoesTeste = [
        {
            tipo: 'SUGESTAO',
            titulo: 'Melhoria na iluminação da Praça Central',
            descricao: 'Sugiro a instalação de mais postes de luz na Praça Central para melhorar a segurança durante a noite.',
            protocolo: generateProtocol(),
            data: new Date().toISOString(),
            nome: 'Maria Silva Santos',
            status: 'nova'
        },
        {
            tipo: 'FOTO',
            titulo: 'Foto enviada por João Costa - Centro',
            descricao: 'Buraco grande na Rua Principal causando problemas para veículos e pedestres',
            protocolo: generateProtocol(),
            data: new Date().toISOString(),
            nome: 'João Costa',
            local: 'Rua Principal, 123 - Centro',
            nomeArquivo: 'buraco_rua_principal.jpg',
            tamanhoArquivo: 1024000,
            status: 'nova'
        },
        {
            tipo: 'LOCALIZACAO',
            titulo: 'Local marcado - Bairro São João',
            descricao: 'Falta de sinalização na esquina da Rua A com Rua B, causando confusão no trânsito',
            protocolo: generateProtocol(),
            data: new Date().toISOString(),
            nome: 'Ana Paula Oliveira',
            local: 'Esquina Rua A com Rua B - Bairro São João',
            problema: 'Sinalização',
            coordenadas: '-10.4333, -39.3333',
            status: 'nova'
        },
        {
            tipo: 'SUGESTAO',
            titulo: 'Criação de área de lazer infantil',
            descricao: 'Proposta para criar uma área de lazer para crianças no Bairro Novo, com playground e equipamentos seguros.',
            protocolo: generateProtocol(),
            data: new Date().toISOString(),
            nome: 'Carlos Eduardo',
            status: 'nova'
        },
        {
            tipo: 'FOTO',
            titulo: 'Foto enviada por Lucia Mendes - Bairro Novo',
            descricao: 'Acúmulo de lixo na esquina prejudicando a saúde dos moradores',
            protocolo: generateProtocol(),
            data: new Date().toISOString(),
            nome: 'Lucia Mendes',
            local: 'Esquina da Rua das Flores - Bairro Novo',
            nomeArquivo: 'lixo_acumulado.jpg',
            tamanhoArquivo: 875000,
            status: 'nova'
        }
    ];
    
    try {
        localStorage.setItem('interacoesRecebidas', JSON.stringify(interacoesTeste));
        console.log('✅ Dados de teste salvos com sucesso!');
        console.log(`📊 Total de interações: ${interacoesTeste.length}`);
        
        // Mostrar tipos criados
        const tipos = {};
        interacoesTeste.forEach(interacao => {
            tipos[interacao.tipo] = (tipos[interacao.tipo] || 0) + 1;
        });
        
        console.log('📋 Tipos criados:');
        Object.keys(tipos).forEach(tipo => {
            console.log(`  • ${tipo}: ${tipos[tipo]}`);
        });
        
        // Recarregar a página para ver os dados
        if (confirm('✅ Dados de teste criados com sucesso!\n\nDeseja recarregar a página para ver os resultados?')) {
            window.location.reload();
        }
        
    } catch (error) {
        console.error('❌ Erro ao salvar dados:', error);
        alert('Erro ao criar dados de teste: ' + error.message);
    }
})();