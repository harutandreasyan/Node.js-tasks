const express = require('express')
const db = require('../models')

const router = express.Router()
const { User } = db

router.get('/', async (req, res) => {
    try {
        const users = await User.findAll()
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
        // await user.update(req.body)
        return res.send({ user })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ error: 'Server error' })
    }
})

router.post('/', async (req, res) => {
    try {
        const { name, email } = req.body
        if (!name || typeof name !== 'string' || name.trim().length < 2) {
            return res.status(400).send({ error: 'Valid name is required' })
        }

        if (!email || typeof email !== 'string' || email.trim().length < 6) {
            return res.status(400).send({ error: 'Valid email is required' })
        }
        const user = await User.create({ name, email })
        return res.status(201).send({ user })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ error: 'Server error' })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const { name, email } = req.body
        if (!name || typeof name !== 'string' || name.trim().length < 2) {
            return res.status(400).send({ error: 'Valid name is required' })
        }

        if (!email || typeof email !== 'string' || email.trim().length < 6) {
            return res.status(400).send({ error: 'Valid email is required' })
        }
        const user = await User.findByPk(req.params.id)
        if (!user) return res.status(404).send({ error: 'User not found' })
        await user.update({ name, email })
        return res.send({ user })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ error: 'Server error' })
    }
})

router.patch('/:id', async (req, res) => {
    try {
        const updates = {}
        const { name, email } = req.body
        if (name) {
            if (typeof name !== 'string' || name.trim().length < 2)
                return res.status(400).send({ error: 'Valid name is required' })
            updates.name = name
        }

        if (email) {
            if (typeof email !== 'string' || email.trim().length < 6)
                return res.status(400).send({ error: 'Valid email is required' })
            updates.email = email
        }

        if (Object.keys(updates).length === 0) {
            return res
                .status(400)
                .send({ error: 'No valid fields provided for update' })
        }
        const user = await User.findByPk(req.params.id)
        if (!user) return res.status(404).send({ message: 'User not found' })
        await user.update(updates)
        return res.send({ user })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ error: 'Server error' })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id)
        if (!user) return res.status(404).send({ message: 'User not found' })
        await user.destroy()
        res.status(200).send({ message: 'User deleted successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'Server error' })
    }
})
module.exports = router
