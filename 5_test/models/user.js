const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
	const User = sequelize.define(
		'user',
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
			timestamps: true,
		}
	)

	User.associate = (models) => {
		User.hasMany(models.Comment, { foreignKey: 'userId' })
	}

	return User
}
