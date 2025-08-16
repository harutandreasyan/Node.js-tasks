const express = require('express')
const auth = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../models')
const authMiddleware = require('../middlewares/authMiddleware.js')
require('dotenv').config()

auth.post('/register', async (req, res) => {
    const { name = '', login = '', password = '' } = req.body
    if (!name.trim() || !login.trim() || !password.trim()) {
        return res.status(400).send({ error: 'Please fill all the fields!' })
    }

    if (password.length < 6) {
        return res.status(400).send({ error: 'Password is weak!' })
    }

    const found = await db.users.findOne({ where: { login } })
    if (found) return res.status(400).send({ error: 'Login is busy!' })
    const user = new db.users({
        name,
        login,
        password: await bcrypt.hash(password, 10),
    })

    await user.save()
    return res.status(201).send({ message: 'success' })
})

auth.post('/login', async (req, res) => {
    const { login, password } = req.body
    if (!login.trim() || !password.trim()) {
        return res.status(400).send({ error: 'Please fill all the fields!' })
    }

    const found = await db.users.findOne({ where: { login } })
    if (!found) return res.status(400).send({ error: 'Wrong credentials!' })

    const match = await bcrypt.compare(password, found.password)
    let attempt = await db.attempts.findOne({ where: { userId: found.id } })

    if (!match) {
        if (!attempt) {
            attempt = await db.attempts.create({
                userId: found.id,
                time: Date.now(),
                attempts: 1,
            })
        } else {
            await attempt.update({ attempts: attempt.attempts + 1, time: Date.now() })
        }

        if (attempt.attempts >= 3) {
            return res.status(400).send({ error: 'Account locked for 2 minutes' })
        }
        return res.status(400).send({ error: 'Wrong credentials!' })
    }

    if (attempt) {
        if (Date.now() - attempt.time < 2 * 60 * 1000 && attempt.attempts >= 3) {
            const rest = Math.ceil(
                (2 * 60 * 1000 - (Date.now() - attempt.time)) / 1000
            )
            return res
                .status(400)
                .send({ error: `You can try again after ${rest} seconds` })
        }
        await attempt.destroy()
    }

    const token = jwt.sign(
        { id: found.id, name: found.name },
        process.env.JWT_SECRET,
        { expiresIn: '20m' }
    )

    return res.send({ token })
})

auth.get('/profile', authMiddleware, (req, res) => {
    return res.send({ user: req.user })
})

module.exports = auth
