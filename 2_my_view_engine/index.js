const express = require('express')
const { myrender } = require('./myrender')

const app = express()

app.get('/', async (req, res) => {
    const datas = await myrender(req, res, 'pages/home.vjs', {
        name: 'Ashot',
        age: 28,
    })

    res.end(datas)
})

const PORT = 3000

app.listen(PORT, () =>
    console.log(`Server is started on http://localhost:${PORT}`)
)
