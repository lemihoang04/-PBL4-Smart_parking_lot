"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Payment extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Payment.belongsTo(models.Car, { foreignKey: "id_car" });
		}
	}
	Payment.init(
		{
			id_payment: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			amount: DataTypes.INTEGER,
			paymentDate: DataTypes.DATE,
			id_car: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "Payment",
			defaultScope: {
				attributes: { exclude: ["id"] },
			},
		}
	);
	return Payment;
};
