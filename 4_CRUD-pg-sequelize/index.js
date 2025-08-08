const express = require('express')
const db = require('./models')
const userRouter = require('./routes/user.js')
const app = express()
const YAML = require('yamljs')
const swagger = require('swagger-ui-express')

const swaggerOptions = YAML.load('./docs/api.yaml')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/users', userRouter)
app.use('/api', swagger.serve, swagger.setup(swaggerOptions))
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
