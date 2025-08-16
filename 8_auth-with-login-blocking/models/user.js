const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    const User = sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: DataTypes.STRING,
        login: DataTypes.STRING,
        password: DataTypes.STRING,
    })

    User.associate = (models) => {
        User.hasOne(models.attempts, { foreignKey: 'userId' })
    }
    return User
}
