const { UserModel } = require('../models/UserModel')

class UserController {
	constructor() {
		this.userModel = new UserModel()
	}

	addUser = async (req, res) => {
		const newUser = await this.userModel.addUser(req.body)
		res.json(newUser)
	}

	removeUser = async (req, res) => {
		const removed = await this.userModel.removeUser(req.params.id)
		if (removed) {
			res.json({ message: 'User deleted successfully!' })
		} else {
			res.status(404).json({ message: 'User not found!' })
		}
	}

	getUserById = async (req, res) => {
		const founded = await this.userModel.getUserById(req.params.id)
		if (founded) {
			res.json(founded)
		} else {
			res.status(404).json({ message: 'User not found!' })
		}
	}

	updateUser = async (req, res) => {
		const founded = await this.userModel.updateUser(req.params.id, req.body)
		if (founded) {
			res.json(founded)
		} else {
			res.status(404).json({ message: 'User not found!' })
		}
	}
}

module.exports = new UserController()
