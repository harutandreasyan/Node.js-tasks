const express = require('express')
const authRouter = require('./routes/auth')
const swagger = require('swagger-ui-express')
const YAML = require('yamljs')
const db = require('./models')
const app = express()

db.sequelize.sync().then(() => console.log('DB SYNC'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const docs = YAML.load('./docs/api.yaml')

app.use('/auth', authRouter)
app.use('/api', swagger.serve, swagger.setup(docs))

app.listen(4002, () => console.log('http://localhost:4002/api'))
