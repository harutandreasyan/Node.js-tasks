const { BaseModel } = require('./BaseModel')

class ProductModel extends BaseModel {
    constructor() {
        super('products.json')
    }

    async addProduct(prod) {
        const products = await this.readData()
        const newProduct = { id: Date.now(), ...prod }
        products.push(newProduct)
        await this.writeData(products)
        return newProduct
    }

    async getProductById(id) {
        id = Number(id)
        const products = await this.readData()
        return products.find((prod) => prod.id === id)
    }

    async removeProduct(id) {
        id = Number(id)
        const products = await this.readData()
        const filtered = products.filter((prod) => prod.id !== id)
        if (filtered.length === products.length) return false
        await this.writeData(filtered)
        return true
    }

    async updateProduct(id, data) {
        id = Number(id)
        const products = await this.readData()
        const idx = products.findIndex((prod) => prod.id === id)
        if (idx === -1) return null
        products[idx] = { ...products[idx], ...data }
        await this.writeData(products)
        return products[idx]
    }

    async getByCategory(kind) {
        const products = await this.readData()
        return products.filter((prod) => prod.category === kind)
    }
}

module.exports = { ProductModel }
