const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    const Comment = sequelize.define(
        'Comment',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        {
            tableName: 'comments',
            timestamp: true
        }
    )

    Comment.associate = (models) => {
        Comment.belongsTo(models.User, { foreignKey: 'userId' })
    }
    
    return Comment
}
