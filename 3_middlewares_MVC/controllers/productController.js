const { ProductModel } = require('../models/ProductModel')

class ProductController {
    constructor() {
        this.productModel = new ProductModel()
    }

    addProduct = async (req, res) => {
        const newProduct = await this.productModel.addProduct(req.body)
        res.json(newProduct)
    }

    getProductById = async (req, res) => {
        const prod = await this.productModel.getProductById(req.params.id)
        if (prod) res.json(prod)
        else res.status(404).json({ message: 'Product not found!' })
    }

    removeProduct = async (req, res) => {
        const removed = await this.productModel.removeProduct(req.params.id)
        if (removed) res.json({ message: 'Product removed successfully!' })
        else res.status(404).json({ message: 'Product not found!' })
    }

    updateProduct = async (req, res) => {
        const prod = await this.productModel.updateProduct(req.params.id, req.body)
        if (prod) res.json(prod)
        else res.status(404).json({ message: 'Product not found!' })
    }

    getByCategory = async (req, res) => {
        const prods = await this.productModel.getByCategory(req.params.kind)
        console.log(prods)
        if (prods.length) res.json(prods)
        else res.json({ message: 'Products of chosen kind not found!' })
    }
}

module.exports = new ProductController()
