// Importação dos módulos essenciais do Node.js
const express = require('express') // Framework para construir o servidor web e APIs
const path = require('path') // Módulo nativo para lidar com caminhos de arquivos/diretórios
const cors = require('cors') // Middleware de segurança para permitir requisições de outras origens (Cross-Origin Resource Sharing)
const crud = require('./src/models/crud') // Importa as funções que interagem diretamente com o banco de dados (nossa camada Model)

const app = express() // Cria a instância principal do aplicativo
const PORT = 3000 // Define a porta onde o servidor vai rodar (localhost:3000)

// =========================================================================
// MIDDLEWARES GLOBAIS
// =========================================================================
app.use(cors()) // Permite que a API seja acessada pelo frontend sem bloqueios de segurança do navegador
app.use(express.json()) // Configura o Express para conseguir ler requisições cujo corpo (body) seja no formato JSON
app.use(express.urlencoded({ extended: true })) // Configura o Express para conseguir ler requisições vindas de formulários HTML padrão

// Servir arquivos estáticos (Frontend)
// Faz com que os arquivos dentro da pasta 'public' (HTML, CSS, imagens) fiquem acessíveis diretamente no navegador
app.use(express.static(path.join(__dirname, 'public')))


// =========================================================================
// ROTAS DE FABRICANTE
// =========================================================================

/**
 * Rota para CRIAR um novo fabricante.
 * O que faz: Recebe os dados pelo req.body, envia para a função criarFabricante do banco e retorna o status 201 (Created).
 */
app.post('/api/fabricantes', async (req, res) => {
    try {
        // Desestruturação (extrai as variáveis diretamente do JSON enviado pelo navegador)
        const {
            tipo_pessoa,
            documento_fiscal,
            nome_fabricante,
            email_fabricante,
            telefone_fabricante,
            cep,
            estado,
            cidade,
            bairro,
            logradouro,
            numero,
            complemento
        } = req.body

        // Chama a função do banco e recupera o ID que foi gerado automaticamente (insertedId)
        const [insertedId] = await crud.criarFabricante(
            tipo_pessoa,
            documento_fiscal,
            nome_fabricante,
            email_fabricante,
            telefone_fabricante,
            cep,
            estado,
            cidade,
            bairro,
            logradouro,
            numero,
            complemento
        )

        // Retorna sucesso para o Frontend
        res.status(201).json({ message: 'Fabricante cadastrado com sucesso!', id: insertedId, nome_fabricante })
    } catch (error) {
        console.error('Erro ao criar fabricante:', error)
        res.status(500).json({ message: 'Erro ao cadastrar fabricante.', error: error.message })
    }
})

/**
 * Rota para LISTAR todos os fabricantes.
 * O que faz: Pede ao banco de dados todos os fabricantes ativos e envia de volta ao navegador como JSON.
 */
app.get('/api/fabricantes', async (req, res) => {
    try {
        const fabricantes = await crud.listarFabricantes()
        res.json(fabricantes) // Envia o array de objetos para quem fez a requisição
    } catch (error) {
        console.error('Erro ao listar fabricantes:', error)
        res.status(500).json({ message: 'Erro ao listar fabricantes.', error: error.message })
    }
})

/**
 * Rota para ATUALIZAR um fabricante.
 * O que faz: Lê o ID que vem na URL (req.params.id) e os dados novos no corpo (req.body), e sobrescreve no banco.
 */
app.put('/api/fabricantes/:id', async (req, res) => {
    try {
        const { id } = req.params // Pega o número que veio na URL (ex: /api/fabricantes/5)
        const {
            tipo_pessoa,
            documento_fiscal,
            nome_fabricante,
            email_fabricante,
            telefone_fabricante,
            cep,
            estado,
            cidade,
            bairro,
            logradouro,
            numero,
            complemento
        } = req.body

        await crud.atualizarFabricante(
            id,
            tipo_pessoa,
            documento_fiscal,
            nome_fabricante,
            email_fabricante,
            telefone_fabricante,
            cep,
            estado,
            cidade,
            bairro,
            logradouro,
            numero,
            complemento
        )

        res.json({ message: 'Fabricante atualizado com sucesso!' })
    } catch (error) {
        console.error('Erro ao atualizar fabricante:', error)
        res.status(500).json({ message: 'Erro ao atualizar fabricante.', error: error.message })
    }
})

/**
 * Rota para DESATIVAR um fabricante.
 * O que faz: Apesar do método HTTP ser DELETE, a função faz uma inativação (Soft Delete) por questões de segurança.
 */
app.delete('/api/fabricantes/:id', async (req, res) => {
    try {
        const { id } = req.params
        await crud.desativarFabricante(id)
        
        // Desativar em cascata as marcas vinculadas
        await crud.desativarMarcasPorFabricante(id)

        res.json({ message: 'Fabricante e marcas associadas desativados com sucesso!' })
    } catch (error) {
        console.error('Erro ao desativar fabricante:', error)
        res.status(500).json({ message: 'Erro ao desativar fabricante.', error: error.message })
    }
})

// =========================================================================
// ROTAS DE MARCA
// =========================================================================

/**
 * Rota para CRIAR uma nova marca.
 * O que faz: Associa uma marca a um fabricante existente usando a chave estrangeira (fk_idFabricante).
 */
app.post('/api/marcas', async (req, res) => {
    try {
        const { fk_idFabricante, nome_marca, logotipo_marca } = req.body
        await crud.criarMarca(fk_idFabricante, nome_marca, logotipo_marca)
        res.status(201).json({ message: 'Marca cadastrada com sucesso!' })
    } catch (error) {
        console.error('Erro ao criar marca:', error)
        res.status(500).json({ message: 'Erro ao cadastrar marca.', error: error.message })
    }
})

/**
 * Rota para LISTAR as marcas.
 */
app.get('/api/marcas', async (req, res) => {
    try {
        const marcas = await crud.listarMarcas()
        res.json(marcas)
    } catch (error) {
        console.error('Erro ao listar marcas:', error)
        res.status(500).json({ message: 'Erro ao listar marcas.', error: error.message })
    }
})

/**
 * Rota para ATUALIZAR uma marca.
 * O que faz: Atualiza os dados comuns, E possui uma lógica especial de Cascata para inativar o fabricante se for o caso.
 */
app.put('/api/marcas/:id', async (req, res) => {
    try {
        const { id } = req.params
        let { fk_idFabricante, nome_marca, logotipo_marca, status_marca } = req.body
        
        // Se fk_idFabricante não foi enviado (ex: numa desativação onde o frontend manda só status_marca),
        // buscamos no banco para saber a qual fabricante essa marca pertence
        if (!fk_idFabricante) {
            const marcaAtual = await crud.obterMarca(id);
            if (marcaAtual) {
                fk_idFabricante = marcaAtual.fk_idFabricante;
            }
        }

        // Atualiza a marca com os novos dados recebidos do frontend
        await crud.atualizarMarca(id, fk_idFabricante, nome_marca, logotipo_marca, status_marca)

        // ---------------------------------------------------------------------
        // LÓGICA DE REGRA DE NEGÓCIO (Desativação em Cascata no Backend)
        // ---------------------------------------------------------------------
        // Se a marca estiver sendo marcada como inativa, o sistema avalia a situação do Fabricante "pai".
        if (status_marca === 0 || status_marca === '0' || status_marca === 'Inativo' || status_marca === 'inativo') {
            
            // Pergunta ao banco: "Existem outras marcas ativas ligadas a este fabricante?"
            const totalAtivas = await crud.contarMarcasAtivasPorFabricante(fk_idFabricante);
            
            // Se o total for zero, significa que essa era a última marca ativa. Logo, o fabricante não pode mais ficar ativo.
            if (totalAtivas == 0) {
                // Inativa o fabricante automaticamente.
                await crud.desativarFabricante(fk_idFabricante);
            }
        }

        res.json({ message: 'Marca atualizada com sucesso!' })
    } catch (error) {
        console.error('Erro ao atualizar marca:', error)
        res.status(500).json({ message: 'Erro ao atualizar marca.', error: error.message })
    }
})

/**
 * Rota para DESATIVAR marca via requisição explícita DELETE.
 * (Atualmente a inativação no frontend está usando a rota PUT, mas essa existe caso seja necessária no futuro).
 */
app.delete('/api/marcas/:id', async (req, res) => {
    try {
        const { id } = req.params
        await crud.desativarMarca(id)
        
        // Em um DELETE genérico, precisamos descobrir o fk_idFabricante da marca que foi apagada,
        // mas aqui mantemos a compatibilidade caso a rota DELETE comece a ser usada dessa forma
        
        res.json({ message: 'Marca desativada com sucesso!' })
    } catch (error) {
        console.error('Erro ao desativar marca:', error)
        res.status(500).json({ message: 'Erro ao desativar marca.', error: error.message })
    }
})

// =========================================================================
// INICIALIZAÇÃO DO SERVIDOR
// =========================================================================
// Inicia o loop de escuta na porta definida lá em cima (3000)
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})
