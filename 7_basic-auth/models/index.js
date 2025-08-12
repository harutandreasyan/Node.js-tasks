const sequelize = require('../config/db.js')
const User = require('./user.js')

const db = {}
db.sequelize = sequelize
db.User = User(sequelize)

module.exports = db