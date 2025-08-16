const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    const Attempt = sequelize.define('attempts', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        attempts: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
        time: {
            type: DataTypes.BIGINT
        }
    })

    Attempt.associate = (models) => {
        Attempt.belongsTo(models.users, { foreignKey: 'userId' })
    }

    return Attempt
}
