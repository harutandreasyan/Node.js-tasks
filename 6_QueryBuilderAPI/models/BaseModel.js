const pool = require('../db.js')
const QueryBuilder = require('./QueryBuilder.js')

class BaseModel {
    table = null

    constructor() {
        if(new.target === 'BaseModel') {
             throw new Error('Base model is an abstract class!')
        }

        
    }

    search() {
        return new QueryBuilder(this.table)
    }
}

module.exports = { BaseModel }
