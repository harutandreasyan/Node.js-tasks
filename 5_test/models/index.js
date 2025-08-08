const sequelize  = require('../config/db.js')
const User = require('./user.js')
const Comment = require('./comment.js')

const db = {}
db.sequelize = sequelize
db.User = User(sequelize)
db.Comment = Comment(sequelize)

Object.values(db)
	.filter((m) => typeof m.associate === 'function')
	.forEach((m) => m.associate(db))

module.exports = db
