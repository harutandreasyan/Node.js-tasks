const express = require('express')
const productRouter = express.Router()
const controller = require('../controllers/productController')

productRouter.post('/', controller.addProduct)
productRouter.get('/:id', controller.getProductById)
productRouter.delete('/:id', controller.removeProduct)
productRouter.put('/:id', controller.updateProduct)
productRouter.get('/category/:kind', controller.getByCategory)

module.exports = { productRouter }