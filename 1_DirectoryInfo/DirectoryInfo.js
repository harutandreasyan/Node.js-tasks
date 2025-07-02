const fs = require('fs/promises')
const path = require('path')

class DirectoryInfo {
    constructor(folderPath) {
        this.folderPath = folderPath
    }

    async #validateDirectory() {
        try {
            const stat = await fs.stat(this.folderPath)
            if (!stat.isDirectory()) {
                throw new Error(`${this.folderPath} is not a directory`)
            }
        } catch (err) {
            throw new Error(`Invalid path: ${this.folderPath}`)
        }
    }

    async getFiles() {
        this.#validateDirectory()
        const members = await fs.readdir(this.folderPath, { withFileTypes: true })
        return members
            .filter((member) => member.isFile())
            .map((member) => member.name)
    }

    async getDirectories() {
        this.#validateDirectory()
        const members = await fs.readdir(this.folderPath, { withFileTypes: true })
        return members
            .filter((member) => member.isDirectory())
            .map((member) => member.name)
    }

    async printTree(indent = 0, currentPath = this.folderPath) {
        const prefix = ' '.repeat(indent * 2)
        const name = path.basename(currentPath)
        console.log(`${prefix}${name}`)

        const members = await fs.readdir(currentPath, { withFileTypes: true })

        for (const member of members) {
            const fullPath = path.join(currentPath, member.name)
            if (member.isDirectory()) {
                await this.printTree(indent + 1, fullPath)
            } else {
                console.log(`${' '.repeat((indent + 1) * 2)}${member.name}`)
            }
        }
    }

    async organize() {
        await this.#validateDirectory()
        const members = await fs.readdir(this.folderPath, { withFileTypes: true })

        for (const member of members) {
            if (member.isDirectory()) continue

            const ext = path.extname(member.name).slice(1) // .txt => txt
            if (!ext) continue

            const targetDir = path.join(this.folderPath, ext)
            const oldPath = path.join(this.folderPath, member.name)
            const newPath = path.join(targetDir, member.name)

            try {
                await fs.mkdir(targetDir, { recursive: true })
                await fs.rename(oldPath, newPath)
            } catch (err) {
                console.error(`Error moving file ${member.name}:`, err.message)
            }
        }
    }
}

module.exports = { DirectoryInfo }
