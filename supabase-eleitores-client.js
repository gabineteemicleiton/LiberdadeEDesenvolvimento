// CLIENTE SUPABASE PARA ELEITORES
// Integração completa entre formulário de cadastro, login e painel administrativo

const SUPABASE_URL = 'https://qirsmhgmkcvbidipnsnw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcnNtaGdta2N2YmlkaXBuc253Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzM4MDUsImV4cCI6MjA2ODk0OTgwNX0.W0JZkkw_2uOPSHsjYthUcbiaVXKCrO2asm96InPwmDc';

const supabaseHeaders = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
};

// Classe para gerenciar eleitores no Supabase
class SupabaseEleitores {
    constructor() {
        this.baseUrl = `${SUPABASE_URL}/rest/v1`;
        this.headers = supabaseHeaders;
    }

    // Cadastrar novo eleitor
    async cadastrarEleitor(dados) {
        try {
            console.log('📝 Cadastrando eleitor no Supabase:', dados);

            // Preparar dados para o Supabase
            const eleitorData = {
                nome_completo: dados.nomeCompleto,
                email: dados.email,
                telefone: dados.telefone,
                data_nascimento: dados.dataNascimento,
                bairro: dados.bairro,
                cidade: dados.cidade || 'Monte Santo',
                genero: dados.genero,
                cpf: dados.cpf || null,
                zona_eleitoral: dados.zonaEleitoral || null,
                secao: dados.secao || null,
                status: 'ativo',
                presente: false,
                fonte: 'formulario_web',
                senha_hash: null, // Será definida no login
                ativo: true
            };

            const response = await fetch(`${this.baseUrl}/eleitores`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(eleitorData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erro ao cadastrar no Supabase');
            }

            const resultado = await response.json();
            console.log('✅ Eleitor cadastrado no Supabase:', resultado[0]);
            
            // Salvar localmente como backup
            this.salvarLocalStorage(dados);
            
            return {
                success: true,
                eleitor: resultado[0],
                message: 'Eleitor cadastrado com sucesso!'
            };

        } catch (error) {
            console.error('❌ Erro no cadastro Supabase:', error);
            
            // Fallback para armazenamento local
            this.salvarLocalStorage(dados);
            
            return {
                success: false,
                error: error.message,
                fallback: true
            };
        }
    }

    // Login de eleitor
    async loginEleitor(email, senha) {
        try {
            console.log('🔐 Tentando login no Supabase:', email);

            // Usar função do Supabase para validar senha
            const response = await fetch(`${this.baseUrl}/rpc/validate_eleitor_password`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({
                    email_input: email,
                    senha_input: senha
                })
            });

            if (!response.ok) {
                throw new Error('Erro na comunicação com o servidor');
            }

            const resultado = await response.json();
            
            if (resultado.length === 0) {
                // Tentar com senha padrão (email)
                const response2 = await fetch(`${this.baseUrl}/eleitores?email=eq.${email}&ativo=eq.true`, {
                    method: 'GET',
                    headers: this.headers
                });

                if (response2.ok) {
                    const eleitores = await response2.json();
                    if (eleitores.length > 0 && (senha === email)) {
                        // Login válido com senha padrão
                        await this.atualizarUltimoLogin(eleitores[0].id);
                        return {
                            success: true,
                            user: eleitores[0],
                            message: 'Login realizado com sucesso!'
                        };
                    }
                }

                return {
                    success: false,
                    error: 'Email ou senha incorretos!'
                };
            }

            const eleitor = resultado[0];
            
            // Atualizar último login
            await this.atualizarUltimoLogin(eleitor.eleitor_id);
            
            console.log('✅ Login bem-sucedido:', eleitor);
            
            return {
                success: true,
                user: {
                    id: eleitor.eleitor_id,
                    nome: eleitor.nome_completo,
                    nomeCompleto: eleitor.nome_completo,
                    email: eleitor.email,
                    telefone: eleitor.telefone,
                    bairro: eleitor.bairro,
                    cidade: eleitor.cidade
                },
                message: 'Login realizado com sucesso!'
            };

        } catch (error) {
            console.error('❌ Erro no login Supabase:', error);
            return {
                success: false,
                error: 'Erro interno do servidor'
            };
        }
    }

    // Atualizar último login
    async atualizarUltimoLogin(eleitorId) {
        try {
            await fetch(`${this.baseUrl}/rpc/update_last_login`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({
                    eleitor_id_input: eleitorId
                })
            });
        } catch (error) {
            console.warn('⚠️ Erro ao atualizar último login:', error);
        }
    }

    // Listar eleitores para o painel
    async listarEleitores() {
        try {
            console.log('📋 Carregando eleitores do Supabase...');

            const response = await fetch(`${this.baseUrl}/eleitores?ativo=eq.true&order=data_cadastro.desc`, {
                method: 'GET',
                headers: this.headers
            });

            if (!response.ok) {
                throw new Error('Erro ao carregar eleitores');
            }

            const eleitores = await response.json();
            
            console.log(`✅ ${eleitores.length} eleitores carregados do Supabase`);
            
            // Salvar no localStorage como cache
            localStorage.setItem('eleitores_supabase', JSON.stringify(eleitores));
            
            return {
                success: true,
                total: eleitores.length,
                data: eleitores
            };

        } catch (error) {
            console.error('❌ Erro ao carregar eleitores:', error);
            
            // Fallback para dados locais
            const eleitoresLocal = localStorage.getItem('eleitores_supabase');
            if (eleitoresLocal) {
                const dados = JSON.parse(eleitoresLocal);
                return {
                    success: true,
                    total: dados.length,
                    data: dados,
                    source: 'cache'
                };
            }
            
            return {
                success: false,
                error: error.message,
                data: []
            };
        }
    }

    // Obter estatísticas
    async obterEstatisticas() {
        try {
            const response = await fetch(`${this.baseUrl}/eleitores_stats`, {
                method: 'GET',
                headers: this.headers
            });

            if (response.ok) {
                const stats = await response.json();
                return stats[0] || {};
            }

            return {};
        } catch (error) {
            console.error('❌ Erro ao carregar estatísticas:', error);
            return {};
        }
    }

    // Obter distribuição por bairro
    async obterDistribuicaoBairros() {
        try {
            const response = await fetch(`${this.baseUrl}/eleitores_por_bairro`, {
                method: 'GET',
                headers: this.headers
            });

            if (response.ok) {
                return await response.json();
            }

            return [];
        } catch (error) {
            console.error('❌ Erro ao carregar distribuição por bairros:', error);
            return [];
        }
    }

    // Migrar dados do JSON local para Supabase
    async migrarDadosLocais() {
        try {
            console.log('🔄 Iniciando migração de dados locais...');

            // Carregar dados do servidor local
            const response = await fetch('/api/eleitores');
            if (!response.ok) {
                throw new Error('Nenhum dado local encontrado');
            }

            const { data: eleitoresLocais } = await response.json();
            
            if (!eleitoresLocais || eleitoresLocais.length === 0) {
                console.log('ℹ️ Nenhum dado local para migrar');
                return { migrados: 0 };
            }

            let migrados = 0;
            
            for (const eleitor of eleitoresLocais) {
                try {
                    // Verificar se já existe no Supabase
                    const existeResponse = await fetch(`${this.baseUrl}/eleitores?email=eq.${eleitor.email}`, {
                        method: 'GET',
                        headers: this.headers
                    });

                    if (existeResponse.ok) {
                        const existentes = await existeResponse.json();
                        if (existentes.length > 0) {
                            console.log(`⏭️ Eleitor ${eleitor.email} já existe no Supabase`);
                            continue;
                        }
                    }

                    // Migrar eleitor
                    const dados = {
                        nome_completo: eleitor.nomeCompleto || eleitor.nome,
                        email: eleitor.email,
                        telefone: eleitor.telefone,
                        data_nascimento: eleitor.dataNascimento,
                        bairro: eleitor.bairro,
                        cidade: eleitor.cidade || 'Monte Santo',
                        genero: eleitor.genero,
                        cpf: eleitor.cpf,
                        zona_eleitoral: eleitor.zonaEleitoral,
                        secao: eleitor.secao,
                        status: eleitor.status || 'ativo',
                        presente: eleitor.presente || false,
                        fonte: eleitor.fonte || 'migracao_local',
                        senha_hash: eleitor.senha ? `md5_${eleitor.email}` : null,
                        data_cadastro: eleitor.dataCadastro,
                        ultimo_login: eleitor.lastLogin,
                        ativo: true
                    };

                    const migracao = await fetch(`${this.baseUrl}/eleitores`, {
                        method: 'POST',
                        headers: this.headers,
                        body: JSON.stringify(dados)
                    });

                    if (migracao.ok) {
                        migrados++;
                        console.log(`✅ Migrado: ${eleitor.email}`);
                    }

                } catch (error) {
                    console.error(`❌ Erro ao migrar ${eleitor.email}:`, error);
                }
            }

            console.log(`✅ Migração concluída: ${migrados} eleitores migrados`);
            return { migrados };

        } catch (error) {
            console.error('❌ Erro na migração:', error);
            return { migrados: 0, error: error.message };
        }
    }

    // Salvar no localStorage como backup
    salvarLocalStorage(dados) {
        try {
            const eleitoresLocal = JSON.parse(localStorage.getItem('eleitores') || '[]');
            
            // Verificar se já existe
            const existe = eleitoresLocal.find(e => e.email === dados.email);
            if (!existe) {
                eleitoresLocal.push({
                    ...dados,
                    id: Date.now(),
                    dataCadastro: new Date().toISOString(),
                    status: 'ativo',
                    fonte: 'formulario_web'
                });
                localStorage.setItem('eleitores', JSON.stringify(eleitoresLocal));
                console.log('💾 Dados salvos no localStorage como backup');
            }
        } catch (error) {
            console.warn('⚠️ Erro ao salvar backup local:', error);
        }
    }
}

// Instância global
window.supabaseEleitores = new SupabaseEleitores();

// Funções globais para compatibilidade
window.cadastrarEleitorSupabase = (dados) => window.supabaseEleitores.cadastrarEleitor(dados);
window.loginEleitorSupabase = (email, senha) => window.supabaseEleitores.loginEleitor(email, senha);
window.listarEleitoresSupabase = () => window.supabaseEleitores.listarEleitores();
window.migrarDadosParaSupabase = () => window.supabaseEleitores.migrarDadosLocais();

console.log('✅ Cliente Supabase para eleitores carregado');