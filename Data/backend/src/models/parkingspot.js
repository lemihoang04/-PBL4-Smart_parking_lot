"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class ParkingSpot extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	ParkingSpot.init(
		{
			id_parkingspot: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			location: DataTypes.STRING,
			status: DataTypes.ENUM("ACTIVE", "INACTIVE"),
		},
		{
			sequelize,
			modelName: "ParkingSpot",
			defaultScope: {
				attributes: { exclude: ["id"] },
			},
		}
	);
	return ParkingSpot;
};
