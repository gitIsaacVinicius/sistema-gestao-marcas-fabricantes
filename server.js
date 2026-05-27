const express = require('express')
const path = require('path')
const cors = require('cors')
const crud = require('./src/models/crud')

const app = express()
const PORT = 3000

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Servir arquivos estáticos (HTML, CSS, JS do frontend)
app.use(express.static(path.join(__dirname, 'public')))

// ========================
// ROTAS DE FABRICANTE
// ========================

// Criar fabricante
app.post('/api/fabricantes', async (req, res) => {
    try {
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

        res.status(201).json({ message: 'Fabricante cadastrado com sucesso!', id: insertedId, nome_fabricante })
    } catch (error) {
        console.error('Erro ao criar fabricante:', error)
        res.status(500).json({ message: 'Erro ao cadastrar fabricante.', error: error.message })
    }
})

// Listar fabricantes
app.get('/api/fabricantes', async (req, res) => {
    try {
        const fabricantes = await crud.listarFabricantes()
        res.json(fabricantes)
    } catch (error) {
        console.error('Erro ao listar fabricantes:', error)
        res.status(500).json({ message: 'Erro ao listar fabricantes.', error: error.message })
    }
})

// Atualizar fabricante
app.put('/api/fabricantes/:id', async (req, res) => {
    try {
        const { id } = req.params
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

// Desativar fabricante
app.delete('/api/fabricantes/:id', async (req, res) => {
    try {
        const { id } = req.params
        await crud.desativarFabricante(id)
        res.json({ message: 'Fabricante desativado com sucesso!' })
    } catch (error) {
        console.error('Erro ao desativar fabricante:', error)
        res.status(500).json({ message: 'Erro ao desativar fabricante.', error: error.message })
    }
})

// ========================
// ROTAS DE MARCA
// ========================

// Criar marca
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

// Listar marcas
app.get('/api/marcas', async (req, res) => {
    try {
        const marcas = await crud.listarMarcas()
        res.json(marcas)
    } catch (error) {
        console.error('Erro ao listar marcas:', error)
        res.status(500).json({ message: 'Erro ao listar marcas.', error: error.message })
    }
})

// Atualizar marca
app.put('/api/marcas/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { fk_idFabricante, nome_marca, logotipo_marca, status_marca } = req.body
        await crud.atualizarMarca(id, fk_idFabricante, nome_marca, logotipo_marca, status_marca)
        res.json({ message: 'Marca atualizada com sucesso!' })
    } catch (error) {
        console.error('Erro ao atualizar marca:', error)
        res.status(500).json({ message: 'Erro ao atualizar marca.', error: error.message })
    }
})

// Desativar marca
app.delete('/api/marcas/:id', async (req, res) => {
    try {
        const { id } = req.params
        await crud.desativarMarca(id)
        res.json({ message: 'Marca desativada com sucesso!' })
    } catch (error) {
        console.error('Erro ao desativar marca:', error)
        res.status(500).json({ message: 'Erro ao desativar marca.', error: error.message })
    }
})

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})
