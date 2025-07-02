const { BaseModel } = require('./BaseModel')

class UserModel extends BaseModel {
	constructor() {
		super('users.json')
	}

	async addUser(data) {
		const users = await this.readData()
		const newUser = { id: Date.now(), ...data }
		users.push(newUser)
		await this.writeData(users)
		return newUser
	}

	async removeUser(id) {
		id = Number(id)
		const users = await this.readData()
		const filtered = users.filter((user) => user.id !== id)
		if (filtered.length === users.length) return false
		await this.writeData(filtered)
		return true
	}

	async getUserById(id) {
		id = Number(id)
		const users = await this.readData()
		return users.find((user) => user.id === id)
	}

	async updateUser(id, data) {
		id = Number(id)
		const users = await this.readData()
		const idx = users.findIndex((user) => user.id === id)
		if (idx === -1) return null
		users[idx] = { ...users[idx], ...data }
		await this.writeData(users)
		return users[idx]
	}
}

module.exports = { UserModel }
