const fs = require('fs/promises')

async function myrender(req, res, file, data) {
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
                const finalResult = datas.replaceAll(`{${word}}`, data[word])
                datas = finalResult
            }
        }
        return datas
    } catch (err) {
        console.error(err)
        return 'Render Failed ' + err
    }
}

module.exports = { myrender }
