const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { isStrongPassword, safeData } = require('../utils/validators.js')
const db = require('../models/')
require('dotenv').config()
const { User } = db

async function register(req, res) {
	try {
		const { name, surname, username, password } = req.body
		if (!name) {
			return res.status(400).json({ error: 'Name is required!' })
		}
		if (!surname) {
			return res.status(400).json({ error: 'Surname is required!' })
		}
		if (!username) {
			return res.status(400).json({ error: 'Username is required!' })
		}
		if (!password) {
			return res.status(400).json({ error: 'Password is required!' })
		}

		if (!isStrongPassword(password)) {
			return res.status(400).json({ error: 'Password must be strong!' })
		}

		const exists = await User.findOne({ where: { username } })
		if (exists) {
			return res.status(409).json({ error: 'Username already exists!' })
		}

		const hashedPwd = await bcrypt.hash(password, 10)
		const user = await User.create({
			name,
			surname,
			username,
			password: hashedPwd,
		})
		return res.status(201).json({ user: safeData(user) })
	} catch (err) {
		console.error(err)
		return res.status(500).json({ error: 'Server error!' })
	}
}

async function login(req, res, next) {
	try {
		const { username, password } = req.body
		if (!username) {
			return res.status(400).json({ error: 'Username is required!' })
		}
		if (!password) {
			return res.status(400).json({ error: 'Password is required!' })
		}

		const user = await User.findOne({ where: { username } })
		if (!user) {
			return res.status(401).json({ error: 'Invalid credentials!' })
		}

		const match = await bcrypt.compare(password, user.password)
		if (!match) {
			return res.status(401).json({ error: 'Invalid credentials!' })
		}

		const payload = { id: user.id, username: user.username }
		const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })

		return res.json({ accessToken: token, expiresIn: '1h' })
	} catch (err) {
		console.error(err)
		return res.status(500).json({ error: 'Server error!' })
	}
}

async function profile(req, res, next) {
	try {
		const userId = req.user.id
		if (!userId) {
			return res.status(401).json({ error: 'Unauthorized!' })
		}

		const user = await User.findByPk(userId)
		if (!user) return res.status(404).json({ error: 'User not found!' })
		return res.json({ user: safeData(user) })
	} catch (err) {
		console.error(err)
		return res.status(500).json({ error: 'Server error!' })
	}
}

module.exports = { register, login, profile }
