"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Admin extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Admin.init(
		{
			id_admin: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			email: DataTypes.STRING,
			password: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "Admin",
			defaultScope: {
				attributes: { exclude: ["id"] },
			},
		}
	);
	return Admin;
};
