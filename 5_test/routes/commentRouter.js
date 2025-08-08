const express = require('express')
const router = express.Router()
const db = require('../models')
const { Comment } = db

router.post('/', async (req, res) => {
	try {
		const { content } = req.body
		if (!content || typeof content !== 'string') {
			return res.status(400).send({ error: 'Valid comment is required' })
		}
		const newComment = await Comment.create(req.body)
		return res.send(newComment)
	} catch (err) {
		console.error(err)
		return res.status(500).send({ error: 'Server error' })
	}
})

router.delete('/:id', async (req, res) => {
	try {
		const comment = await Comment.findByPk(req.params.id)
		if (!comment) return res.status(404).send({ error: 'Comment not found' })
		await comment.destroy()

		res.status(200).send({ message: 'User deleted successfully' })
	} catch (err) {
		console.error(err)
		return res.status(500).send({ error: 'Server error' })
	}
})

module.exports = router
