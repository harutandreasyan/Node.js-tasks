function isStrongPassword(password) {
    if (typeof password !== 'string') return false
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/
    return regex.test(password)
}

function safeData(userInstance) {
    if (!userInstance) return null
    const { id, name, surname, username, createdAt, updatedAt } = userInstance
    return { id, name, surname, username, createdAt, updatedAt }
}

module.exports = {
    isStrongPassword,
    safeData,
}
