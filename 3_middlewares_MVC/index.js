const express = require('express')
const bodyParser = require('body-parser')
const { userRouter } = require('./routers/userRouter')
const { productRouter } = require('./routers/productRouter')

const app = express()

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

app.use('/users', userRouter)
app.use('/products', productRouter)

const PORT = 4002
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`)
})
