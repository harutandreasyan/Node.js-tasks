const { readFile, writeFile } = require('fs/promises')
const path = require('path')

class BaseModel {
    constructor(filename) {
        this.filePath = path.join(__dirname, '../data', filename)
    }

	async readData() {
        try {
            const data = await readFile(this.filePath, 'utf-8')
            return JSON.parse(data)
        } catch (err) {
            return []
        }
    }

    async writeData(data) {
        await writeFile(this.filePath, JSON.stringify(data, null, 2))
    }
}

module.exports = { BaseModel }
