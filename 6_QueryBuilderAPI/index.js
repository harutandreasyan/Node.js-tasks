const express = require('express')
const app = express()
const employees = require('./models/EmployeeModel.js')

app.use(express.json())

// 1
app.get('/', async (req, res) => {
    try {
        const data = await employees
            .search()
            .where('salary')
            .isGreaterThan(40000)
            .andWhere('department_id')
            .is(5)
            .andWhere('position', 'Recruiter')
            .getAll()

        res.send({ rows: data })
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// 2
app.get('/a', async (req, res) => {
    try {
        const data = await employees
            .search()
            .where('department_id')
            .is(1)
            .orWhere('department_id')
            .is(2)
            .getAll()

        res.send({ rows: data })
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// 3
app.get('/b', async (req, res) => {
    try {
        const data = await employees
            .search()
            .orderBy('salary')
            .limit(5)
            .getAll()

        res.send({ rows: data })
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// 4
app.get('/c', async (req, res) => {
    try {
        const data = await employees
            .search()
            .where('full_name')
            .like('I%')
            .getAll()

        res.send({ rows: data })
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// 5
app.get('/d', async (req, res) => {
    try {
        const data = await employees
            .search()
            .where('department_id')
            .is(3)
            .andWhere('salary')
            .isGreaterThan(30000)
            .orWhere('department_id')
            .is(5)
            .orderBy('salary', 'ASC')
            .limit(10)
            .getAll()

        res.send({ rows: data })
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// 6
app.get('/e', async (req, res) => {
    try {
        const data = await employees
            .search()
            .join('departments', 'employees.department_id', 'departments.id')
            .where('departments.name')
            .is('IT')
            .andWhere('employees.salary')
            .isGreaterThan(50000)
            .getAll()

        res.send({ rows: data })
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

const PORT = 4002
app.listen(PORT, () =>
    console.log(`Server started on http://localhost:${PORT}`)
)
