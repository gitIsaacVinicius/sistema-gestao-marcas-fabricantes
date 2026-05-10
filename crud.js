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
    return await db('Fabricante').where('status_fabricante', 'Ativo').select('*')
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

async function desativarFabricante(id) {
  return await db('Fabricante')
    .where({ id })
    .update({ status_fabricante: 'inativo' });
}


// CRUD de Marca
async function criarMarca(fk_idFabricante, nome_marca, logotipo) {
    return await db('Marca').insert({
        fk_idFabricante,
        nome_marca,
        logotipo,
    })
}

async function listarMarcas() {
    return await db('Marca').where('status_marca', 'Ativo').select('*')
}

async function atualizarMarca(id, fk_idFabricante, nome_marca, logotipo, status_marca) {
    return await db('Marca').where({ id }).update({
        fk_idFabricante,
        nome_marca,
        logotipo,
        status_marca
    })
}

async function desativarMarca(id) {
  return await db('Marca')
    .where({ id })
    .update({ status_marca: 'inativo' });
}

module.exports = {
    criarFabricante,
    listarFabricantes,
    atualizarFabricante,
    desativarFabricante,
    criarMarca,
    listarMarcas,
    atualizarMarca,
    desativarMarca
}