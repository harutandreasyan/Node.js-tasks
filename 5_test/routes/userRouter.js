const express = require('express')
const router = express.Router()
const db = require('../models')
const { User, Comment } = db

router.get('/', async (req, res) => {
	try {
		const limit = parseInt(req.query.limit) || 10
		const page = parseInt(req.query.page) || 1
		const offset = (page - 1) * limit

		const { rows: users } = await User.findAndCountAll({
			limit,
			offset,
			include: [
				{
					model: Comment,
					attributes: ['id', 'content'],
				},
			],
		})
		return res.send({ users })
	} catch (err) {
		console.log(err)
		return res.status(500).send({ error: 'Server error' })
	}
})

router.get('/:id', async (req, res) => {
	try {
		const user = await User.findByPk(req.params.id)
		if (!user) return res.status(404).send({ error: 'User not found' })
		return res.send({ user })
	} catch (err) {
		console.error(err)
		return res.status(500).send({ error: 'Server error' })
	}
})

router.get('/:id/comments', async (req, res) => {
	try {
		const userId = +req.params.id
		const user = await User.findByPk(userId)
		if (!user) {
			return res.status(404).json({ error: 'User not found' })
		}

		const comments = await Comment.findAll({
			where: { userId },
			attributes: ['id', 'content', 'createdAt'],
			order: [['createdAt', 'DESC']]
		})

		return res.send({
			userId,
			totalComments: comments.length,
			comments,
		})
	} catch (err) {
		console.error(err)
		return res.status(500).send({ error: 'Server error' })
	}
})

module.exports = router
