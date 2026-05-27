const knex = require('knex')

const connection = knex({
    client: 'mysql2',
    connection: {
        host : '',
        user : '',
        password : '', //MUDAR SENHA CONFORME O PC
        database : ''
    }
})

module.exports = connection