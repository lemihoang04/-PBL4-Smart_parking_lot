"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Payments", {
			id_payment: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			amount: {
				type: Sequelize.INTEGER,
			},
			paymentDate: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			id_car: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "Cars",
					key: "id_car",
				},
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("Payments");
	},
};
