const pool = require('../db.js')

/*
    STATES:
    INIT           – starting point, no WHERE yet, can call join(), where(), orderBy(), limit()
    PENDING_VALUE  – just called where()/andWhere()/orWhere(), waiting for is()/isGreaterThan()/like()
    HAS_CONDITION  – at least one condition complete, can chain andWhere(), orWhere(), orderBy(), limit()
    AFTER_JOIN     – after a join(), still can call where(), join(), orderBy(), limit()
    AFTER_ORDER    – after orderBy(), can call limit() or another orderBy()
    AFTER_LIMIT    – after limit(), can call orderBy() or another limit()
*/

/*
    Rules:
    - where(...) — allowed in INIT and AFTER_JOIN (so you can join() first)
    - andWhere(key, value?) / orWhere(key) — only when a previous condition exists (HAS_CONDITION)
      andWhere(key, value) supports short form with value
      if value omitted -> PENDING_VALUE
    - is/isGreaterThan/like - only in PENDING_VALUE; after -> HAS_CONDITION
    - join(...) — allowed before where started (INIT or AFTER_JOIN)
    - orderBy/limit — not allowed in PENDING_VALUE (can't call while waiting for value)
    - getAll() — not allowed in PENDING_VALUE
*/

const STATES = {
    INIT: 'INIT',
    PENDING_VALUE: 'PENDING_VALUE',
    HAS_CONDITION: 'HAS_CONDITION',
    AFTER_JOIN: 'AFTER_JOIN',
    AFTER_ORDER: 'AFTER_ORDER',
    AFTER_LIMIT: 'AFTER_LIMIT',
}

class QueryBuilder {
    command = ''
    constructor(table) {
        this.table = table
        this._state = STATES.INIT
    }

    _checkAllowed(allowedStates, methodName) {
        if (!allowedStates.includes(this._state)) {
            throw new Error(
                `Invalid call to ${methodName}() in state ${
                    this._state
                }. Allowed states: ${allowedStates.join(', ')}`
            )
        }
    }

    _ensureSelect() {
        if (!this.command) {
            this.command = `SELECT * FROM ${this.table} `
        }
    }

    where(key) {
        this._checkAllowed([STATES.INIT, STATES.AFTER_JOIN], 'where')
        this._ensureSelect()
        this.command += `WHERE ${key} `
        this._state = STATES.PENDING_VALUE
        return this
    }

    andWhere(key, value) {
        this._checkAllowed([STATES.HAS_CONDITION], 'andWhere')

        if (typeof value !== 'undefined') {
            if (typeof value === 'string') {
                this.command += `AND ${key} = '${value}' `
            } else this.command += `AND ${key} = ${value} `
            this._state = STATES.HAS_CONDITION
        } else {
            this.command += `AND ${key} `
            this._state = STATES.PENDING_VALUE
        }
        return this
    }

    orWhere(key) {
        this._checkAllowed([STATES.HAS_CONDITION], 'orWhere')
        this.command += ` OR ${key} `
        this._state = STATES.PENDING_VALUE
        return this
    }

    isGreaterThan(value) {
        this._checkAllowed([STATES.PENDING_VALUE], 'isGreaterThan')
        this.command += `> ${value} `
        this._state = STATES.HAS_CONDITION
        return this
    }

    is(value) {
        this._checkAllowed([STATES.PENDING_VALUE], 'is')
        if (typeof value === 'string') {
            this.command += `= '${value}' `
        } else this.command += `= ${value} `
        this._state = STATES.HAS_CONDITION
        return this
    }

    orderBy(key, order = 'ASC') {
        this._checkAllowed(
            [
                STATES.INIT,
                STATES.HAS_CONDITION,
                STATES.AFTER_JOIN,
                STATES.AFTER_ORDER,
                STATES.AFTER_LIMIT,
            ],
            'orderBy'
        )
        this._ensureSelect()
        this.command += `ORDER BY ${key} ${order} `
        this._state = STATES.AFTER_ORDER
        return this
    }

    limit(count) {
        this._checkAllowed(
            [
                STATES.INIT,
                STATES.HAS_CONDITION,
                STATES.AFTER_JOIN,
                STATES.AFTER_ORDER,
                STATES.AFTER_LIMIT,
            ],
            'limit'
        )
        if (!Number.isInteger(count) || count < 0) {
            throw new Error('limit must be a non-negative integer')
        }
        this._ensureSelect()
        this.command += `LIMIT ${count} `
        this._state = STATES.AFTER_LIMIT
        return this
    }

    like(pattern) {
        this._checkAllowed([STATES.PENDING_VALUE], 'like')
        this.command += `LIKE '${pattern}' `
        this._state = STATES.HAS_CONDITION
        return this
    }

    join(rightColumn, leftKey, rightKey) {
        this._checkAllowed([STATES.INIT, STATES.AFTER_JOIN], 'join')
        this._ensureSelect()
        this.command += `INNER JOIN ${rightColumn} ON ${leftKey} = ${rightKey} `
        this._state = STATES.AFTER_JOIN
        return this
    }

    async getAll() {
        if (this._state === STATES.PENDING_VALUE) {
            throw new Error(
                'Expected a value-method (is / isGreaterThan / like) after where/andWhere/orWhere before calling getAll()'
            )
        }
        this._ensureSelect()
        const data = await pool.query(this.command)
        return data.rows
    }
}

module.exports = QueryBuilder
