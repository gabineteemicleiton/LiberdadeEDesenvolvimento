// Correção definitiva do formulário de cadastro
(function() {
    'use strict';
    
    console.log('🔧 Iniciando correção do formulário de cadastro...');
    
    // Aguardar DOM carregar
    document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('cadastroForm');
        const submitButton = document.getElementById('submitButton');
        
        if (!form || !submitButton) {
            console.error('❌ Formulário ou botão não encontrado');
            return;
        }
        
        console.log('✅ Formulário encontrado, configurando evento...');
        
        // Remover listeners existentes
        form.removeEventListener('submit', handleSubmit);
        
        // Adicionar novo listener
        form.addEventListener('submit', handleSubmit);
        
        // Também adicionar listener direto no botão
        submitButton.addEventListener('click', function(e) {
            console.log('🖱️ Botão clicado diretamente');
            if (form.checkValidity()) {
                e.preventDefault();
                handleSubmit(e);
            }
        });
        
        async function handleSubmit(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('📝 Processando envio do formulário...');
            
            // Validar campos obrigatórios
            const requiredFields = ['nomeCompleto', 'email', 'telefone', 'dataNascimento', 'bairro', 'genero'];
            let isValid = true;
            
            for (const fieldId of requiredFields) {
                const field = document.getElementById(fieldId);
                if (!field || !field.value.trim()) {
                    console.error(`❌ Campo obrigatório vazio: ${fieldId}`);
                    field?.focus();
                    isValid = false;
                    break;
                }
            }
            
            if (!isValid) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Preparar dados
            const formData = {
                id: Date.now(),
                nomeCompleto: document.getElementById('nomeCompleto').value.trim(),
                email: document.getElementById('email').value.trim(),
                telefone: document.getElementById('telefone').value.trim(),
                dataNascimento: document.getElementById('dataNascimento').value,
                bairro: document.getElementById('bairro').value,
                cidade: document.getElementById('cidade').value.trim() || 'Monte Santo',
                genero: document.getElementById('genero').value,
                cpf: document.getElementById('cpf').value?.trim() || null,
                zonaEleitoral: document.getElementById('zonaEleitoral').value?.trim() || null,
                secao: document.getElementById('secao').value?.trim() || null,
                dataCadastro: new Date().toISOString(),
                status: 'ativo',
                presente: false
            };
            
            console.log('📤 Dados preparados:', formData);
            
            // Mostrar loading
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<div class="loading"></div> Cadastrando...';
            submitButton.disabled = true;
            
            try {
                // Tentar múltiplas rotas
                let response;
                let savedToServer = false;
                
                const routes = [
                    '/api/cadastro-eleitor',
                    'http://localhost:3000/api/cadastro-eleitor',
                    '/api/eleitores'
                ];
                
                for (const route of routes) {
                    try {
                        console.log(`🔄 Tentando rota: ${route}`);
                        response = await fetch(route, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body: JSON.stringify(formData)
                        });
                        
                        if (response.ok) {
                            const result = await response.json();
                            console.log('✅ Sucesso na rota:', route, result);
                            savedToServer = true;
                            break;
                        }
                    } catch (err) {
                        console.warn(`⚠️ Erro na rota ${route}:`, err.message);
                    }
                }
                
                // Salvar localmente sempre (backup)
                let eleitores = JSON.parse(localStorage.getItem('eleitores') || '[]');
                
                // Verificar duplicatas
                const emailExists = eleitores.find(e => e.email === formData.email);
                const cpfExists = formData.cpf ? eleitores.find(e => e.cpf === formData.cpf) : false;
                
                if (emailExists) {
                    throw new Error('Este e-mail já está cadastrado!');
                }
                
                if (cpfExists) {
                    throw new Error('Este CPF já está cadastrado!');
                }
                
                // Adicionar aos eleitores
                eleitores.push(formData);
                localStorage.setItem('eleitores', JSON.stringify(eleitores));
                
                // Salvar também como usuário registrado
                let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                const userExists = registeredUsers.find(u => u.email === formData.email);
                if (!userExists) {
                    registeredUsers.push(formData);
                    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
                }
                
                console.log('💾 Dados salvos localmente');
                
                // Fazer login automático (formato correto para o sistema)
                sessionStorage.setItem('userLoggedIn', 'true');
                sessionStorage.setItem('userName', formData.nomeCompleto);
                sessionStorage.setItem('userEmail', formData.email);
                
                // Também salvar sessão completa
                const sessionData = {
                    userId: formData.id,
                    nomeCompleto: formData.nomeCompleto,
                    telefone: formData.telefone,
                    bairro: formData.bairro,
                    email: formData.email,
                    isLoggedIn: true,
                    loginTime: new Date().toISOString()
                };
                
                sessionStorage.setItem('userSession', JSON.stringify(sessionData));
                console.log('🔐 Login automático realizado');
                
                // Sucesso
                submitButton.innerHTML = '<i class="fas fa-check"></i> Cadastrado!';
                submitButton.style.background = '#16a34a';
                
                setTimeout(() => {
                    window.location.href = 'index.html?welcome=true';
                }, 1500);
                
            } catch (error) {
                console.error('❌ Erro no cadastro:', error);
                
                // Restaurar botão
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                submitButton.style.background = '#dc2626';
                
                // Mostrar erro
                alert(`Erro no cadastro: ${error.message}`);
                
                setTimeout(() => {
                    submitButton.style.background = '#1e40af';
                }, 3000);
            }
        }
        
        console.log('✅ Formulário configurado com sucesso');
    });
})();