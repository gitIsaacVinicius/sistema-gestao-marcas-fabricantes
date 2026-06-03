// Importa as configurações de conexão com o banco de dados. 
// O objeto 'db' representa a instância do Knex (ou biblioteca similar) configurada para falar com o MySQL.
const db = require('../config/database')

// =========================================================================
// CRUD DE FABRICANTE (Create, Read, Update, Delete Lógico)
// =========================================================================

/**
 * Cria um novo fabricante no banco de dados.
 * O que cria: Realiza um 'INSERT INTO Fabricante' com os dados passados do formulário.
 */
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

/**
 * Busca todos os fabricantes ativos.
 * O que faz: Executa 'SELECT * FROM Fabricante WHERE status_fabricante = "Ativo"'.
 * Impede que fabricantes inativos/desativados apareçam nas listas e tabelas.
 */
async function listarFabricantes() {
    return await db('Fabricante').where('status_fabricante', 'Ativo').select('*')
}

/**
 * Atualiza todas as informações de um fabricante existente.
 * O que faz: Executa 'UPDATE Fabricante SET ... WHERE idFabricante = id'.
 */
async function atualizarFabricante(id, tipo_pessoa, documento_fiscal, nome_fabricante, email_fabricante, telefone_fabricante, cep, estado, cidade, bairro, logradouro, numero, complemento) {
    return await db('Fabricante').where({ idFabricante: id }).update({
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

/**
 * Realiza uma exclusão lógica (Soft Delete) do Fabricante.
 * O que faz: Não apaga a linha do banco de dados definitivamente. Em vez disso, 
 * muda o campo 'status_fabricante' para 'inativo'. Assim, o histórico não é perdido,
 * mas ele não aparece mais para o usuário comum (graças à restrição em listarFabricantes).
 */
async function desativarFabricante(id) {
  return await db('Fabricante')
    .where({ idFabricante: id })
    .update({ status_fabricante: 'Inativo' });
}


// =========================================================================
// CRUD DE MARCA
// =========================================================================

/**
 * Cria uma nova marca vinculando-a a um fabricante existente.
 * O que cria: Realiza um 'INSERT INTO Marca' recebendo a chave estrangeira (fk_idFabricante).
 */
async function criarMarca(fk_idFabricante, nome_marca, logotipo_marca) {
    return await db('Marca').insert({
        fk_idFabricante,
        nome_marca,
        logotipo_marca,
    })
}

/**
 * Busca todas as marcas ativas do banco.
 * O que faz: Executa um 'SELECT * FROM Marca WHERE status_marca = "Ativo"'.
 */
async function listarMarcas() {
    return await db('Marca').where('status_marca', 'Ativo').select('*')
}

/**
 * Busca uma marca pelo seu ID.
 */
async function obterMarca(id) {
    return await db('Marca').where({ idMarca: id }).first();
}

/**
 * Atualiza os dados da marca, podendo inclusive mudar o fabricante a qual ela pertence.
 * O que faz: Executa um 'UPDATE Marca SET fk_idFabricante = ?, nome_marca = ?, ... WHERE idMarca = id'.
 */
async function atualizarMarca(id, fk_idFabricante, nome_marca, logotipo_marca, status_marca) {
    return await db('Marca').where({ idMarca: id }).update({
        fk_idFabricante,
        nome_marca,
        logotipo_marca,
        status_marca
    })
}

/**
 * Realiza uma exclusão lógica (Soft Delete) da Marca.
 * O que faz: Apenas altera o 'status_marca' para 'Inativo'.
 */
async function desativarMarca(id) {
  return await db('Marca')
    .where({ idMarca: id })
    .update({ status_marca: 'Inativo' });
}

/**
 * Desativa todas as marcas vinculadas a um fabricante específico.
 */
async function desativarMarcasPorFabricante(fk_idFabricante) {
    return await db('Marca')
        .where({ fk_idFabricante: fk_idFabricante })
        .update({ status_marca: 'Inativo' });
}

/**
 * Função utilitária para manter a regra de negócio (Desativação em Cascata Segura).
 * O que faz: Conta (COUNT) quantas marcas ativas ainda restam associadas a um fabricante específico.
 * É essencial para saber se o fabricante deve ou não ser inativado após inativar uma marca.
 */
async function contarMarcasAtivasPorFabricante(fk_idFabricante) {
    // Busca quantas marcas do fabricante NÃO estão inativas
    const result = await db('Marca')
        .where('fk_idFabricante', fk_idFabricante)
        .whereNotIn('status_marca', ['0', 'Inativo', 'inativo'])
        .count('* as total');
    
    // Como a contagem é retornada como um array de um objeto (ex: [{ total: 2 }]), extraímos apenas o número.
    return result[0].total;
}

// Exporta todas as funções para que outros arquivos (como o server.js) possam importá-las e utilizá-las.
module.exports = {
    criarFabricante,
    listarFabricantes,
    atualizarFabricante,
    desativarFabricante,
    criarMarca,
    listarMarcas,
    obterMarca,
    atualizarMarca,
    desativarMarca,
    desativarMarcasPorFabricante,
    contarMarcasAtivasPorFabricante
}