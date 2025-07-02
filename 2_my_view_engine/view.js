/* Adding our own view engine - using 'engine' method */

const express = require('express')
const fs = require('fs/promises')

const app = express()

app.engine('vjs', async (file, options, callback) => {
    try {
        let datas = await fs.readFile(file, 'utf-8')
        for (let i = 0; i < datas.length; ++i) {
            if (datas[i] === '{') {
                i++
                let word = ''
                while (datas[i] !== '}') {
                    word += datas[i]
                    ++i
                }
                const finalResult = datas.replaceAll(`{${word}}`, options[word])
                datas = finalResult
            }
        }

        callback(null, datas)
    } catch (err) {
        callback(err)
    }
})

app.set('view engine', 'vjs')
app.set('views', 'pages')

app.get('/', (req, res) => {
    res.render('home', { name: 'Ashot', age: 28 })
})

const PORT = 3000

app.listen(PORT, () =>
    console.log(`Server is started on http://localhost:${PORT}`)
)
