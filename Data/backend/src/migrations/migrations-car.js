"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Cars", {
			id_car: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name: {
				type: Sequelize.STRING,
			},
			license_plate: {
				type: Sequelize.STRING,
			},
			type: {
				type: Sequelize.STRING,
			},
			inTime: {
				type: Sequelize.DATE,
			},
			outTime: {
				type: Sequelize.DATE,
			},
			id_user: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "Users",
					key: "id",
				},
			},
			id_reservation: {
				type: Sequelize.INTEGER,
				allowNull: true,
				references: {
					model: "Reservations",
					key: "id_reservation",
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
		await queryInterface.dropTable("Cars");
	},
};
