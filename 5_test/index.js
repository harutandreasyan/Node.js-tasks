const express = require('express')
const YAML = require('yamljs')
const swagger = require('swagger-ui-express')
const userRouter = require('./routes/userRouter.js')
const commentRouter = require('./routes/commentRouter.js')
const db = require('./models')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const swaggerConfig = YAML.load('./docs/api.yaml')
app.use('/api', swagger.serve, swagger.setup(swaggerConfig))
app.use('/users', userRouter)
app.use('/comments', commentRouter)

db.sequelize
	.sync()
	.then(() => console.log('DB synced'))
	.catch((err) => {
		console.error('Unable to sync DB:', err)
		process.exit(1)
	})

const PORT = 3002
app.listen(PORT, () =>
	console.log(`Server started on http://localhost:${PORT}`)
)
