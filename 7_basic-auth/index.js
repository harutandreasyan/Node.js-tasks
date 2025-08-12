const express = require('express')
const db = require('./models')
const authRouter = require('./routes/auth.js')
const setupSwagger = require('./utils/swagger-setup.js')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

setupSwagger(app)

app.get('/', (req, res) => res.json({ status: 'Ok' }))
app.use('/auth', authRouter)

db.sequelize
    .sync()
    .then(() => console.log('DB synced'))
    .catch((err) => {
        console.error('Unable to sync DB:', err)
        process.exit(1)
    })

const PORT = 4002
app.listen(PORT, () =>
    console.log(`Server started on http://localhost:${PORT}`)
)
