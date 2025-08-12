const express = require('express')
const route = express.Router()
const { register, login, profile } = require('../controllers/authController.js')
const authMiddleware = require('../middlewares/authMiddleware.js')

route.post('/register', register)
route.post('/login', login)
route.get('/profile', authMiddleware, profile)

module.exports = route
