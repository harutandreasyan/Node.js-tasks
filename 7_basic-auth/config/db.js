const { Sequelize } = require('sequelize')
require('dotenv').config()

const { DB_NAME, DB_USER, DB_PASSWORD, DB_PORT, DB_HOST } = process.env

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    logging: false,
})

module.exports = sequelize
