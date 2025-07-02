const express = require('express')
const userRouter = express.Router()
const controller = require('../controllers/userController')

userRouter.post('/', controller.addUser)
userRouter.delete('/:id', controller.removeUser)
userRouter.get('/:id', controller.getUserById)
userRouter.put('/:id', controller.updateUser)

module.exports = { userRouter }
