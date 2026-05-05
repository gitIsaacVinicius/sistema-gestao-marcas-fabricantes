const db = require('./database')

// CRUD de Fabricante
async function criarFabricante(tipo_pessoa, documento_fiscal, nome_fabricante, email_fabricante, telefone_fabricante, cep, estado, cidade, bairro, logradouro, numero, complemento) {
    return await db('Fabricante').insert({
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
    })

}

async function listarFabricantes() {
    return await db('Fabricante').select('*')
}

async function atualizarFabricante(id, tipo_pessoa, documento_fiscal, nome_fabricante, email_fabricante, telefone_fabricante, cep, estado, cidade, bairro, logradouro, numero, complemento) {
    return await db('Fabricante').where({ id }).update({
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
    })
}

async function deletarFabricante(id) {
    return await db('Fabricante').where({ id }).del()
}

// CRUD de Marca
async function criarMarca(fk_idFabricante, nome_marca, logotipo, status_marca) {
    return await db('Marca').insert({
        fk_idFabricante,
        nome_marca,
        logotipo,
        status_marca
    })
}

async function listarMarcas() {
    return await db('Marca').select('*')
}

async function atualizarMarca(id, fk_idFabricante, nome_marca, logotipo, status_marca) {
    return await db('Marca').where({ id }).update({
        fk_idFabricante,
        nome_marca,
        logotipo,
        status_marca
    })
}

async function deletarMarca(id) {
    return await db('Marca').where({ id }).del()
}

module.exports = {
    criarFabricante,
    listarFabricantes,
    atualizarFabricante,
    deletarFabricante,
    criarMarca,
    listarMarcas,
    atualizarMarca,
    deletarMarca
}