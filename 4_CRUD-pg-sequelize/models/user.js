const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    const User = sequelize.define(
        'Users',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            tableName: 'users',
            timestamps: true,
        }
    )

    return User
}
