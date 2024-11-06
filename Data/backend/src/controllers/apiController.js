import apiService from "../service/apiService";

let HandleCreateNewCar = async (req, res) => {
	// const user = req.user;
	// const carData = req.body;
	const { car, user } = req.body;
	try {
		const result = await apiService.CreateNewCar(car, user);
		return res.status(200).json(result);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ errCode: 1, message: "Error creating car" });
	}
};
let HandleGetAllCar = async (req, res) => {
	let id = req.query.id;
	if (!id) {
		return res.status(200).json({
			errCode: 1,
			errMessage: "Missing required parameter",
			car: [],
		});
	}
	let car = await apiService.GetAllCar(id);
	return res.status(200).json({
		errCode: 0,
		errMessage: "OK",
		car: car,
	});
};
let HandleGetAllCar_Ticket = async (req, res) => {
	let id = req.query.id;
	if (!id) {
		return res.status(200).json({
			errCode: 1,
			errMessage: "Missing required parameter",
			car: [],
		});
	}
	let car = await apiService.GetCar_Ticket(id);
	return res.status(200).json({
		errCode: 0,
		errMessage: "OK",
		car: car,
	});
};

let HandleGetTypeTicket = async (req, res) => {
	let type_ticket = req.query.type;
	try {
		const result = await apiService.GetTicketType(type_ticket);
		return res.status(200).json(result);
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ errCode: 1, message: "Error get type ticket" });
	}
};
let HandleCreatePayment = async (req, res) => {
	let data = req.body;
	try {
		const result = await apiService.CreatePayment(data);
		return res.status(200).json({
			errCode: result.errCode,
			errMessage: result.errMessage,
		});
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ errCode: 1, errMessage: "Error Create Ticket" });
	}
};
let HandleDeleteTicket = async (req, res) => {
	if (!req.body) {
		return res.status(200).json({
			errCode: 1,
			errMessage: "Missing required parameters!",
		});
	}
	let message = await apiService.DeleteTicket(req.body.id_car || req.body);
	return res.status(200).json({
		...message,
	});
};
let HandleCreateTime = async (req, res) => {
	const { license_plate } = req.body;
	if (!license_plate) {
		return res.status(400).send("Is Not License Plate");
	}
	try {
		let result = await apiService.CreateTimeCar(license_plate);
		return res.status(200).json({
			errCode: result.errCode,
			errMessage: result.errMessage,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ errCode: 1, errMessage: "Error Car" });
	}
};
let HandlePaymentMoMo = async (req, res) => {
	try {
		const { amount } = req.body;
		if (!amount || isNaN(amount)) {
			return res.status(400).json({ error: "Invalid amount" });
		}
		const paymentResult = await apiService.PaymentMoMo(amount);
		if (paymentResult && paymentResult.resultCode === 0) {
			return res.status(200).json({
				message: "Payment successful",
				data: paymentResult,
			});
		} else {
			return res.status(500).json({
				message: "Payment failed",
				error: paymentResult,
			});
		}
	} catch (error) {
		console.error("Payment error:", error);
		return res.status(500).json({
			message: "An error occurred during payment processing",
			error: error.message,
		});
	}
};
let handlePaymentZaloPay = async (req, res) => {
	try {
		const paymentResult = await apiService.createZaloPayOrder(req.body);
		return res.status(200).json(paymentResult);
	} catch (error) {
		console.error("ZaloPay error:", error);
		return res.status(500).json({
			message: "An error occurred during ZaloPay processing",
			error: error.message,
		});
	}
};
let handleCheckZaloPay = async (req, res) => {
	try {
		const { app_trans_id } = req.body;
		const paymentResult = await apiService.checkZaloPayOrderStatus(
			app_trans_id
		);
		return res.status(200).json(paymentResult);
	} catch (error) {
		console.error("ZaloPay error:", error);
		return res.status(500).json({
			message: "An error occurred during ZaloPay processing",
			error: error.message,
		});
	}
};
let handleCallBackZaloPay = async (req, res) => {
	try {
		const paymentResult = await apiService.callbackZaloPayOrder(req.body);
		return res.status(200).json(paymentResult);
	} catch (error) {
		console.error("ZaloPay error:", error);
		return res.status(500).json({
			message: "An error occurred during ZaloPay processing",
			error: error.message,
		});
	}
};
let HandleGetAllSlot = async (req, res) => {
	let slots = await apiService.getSlotCar();
	return res.status(200).json({
		errCode: 0,
		errMessage: "OK",
		slots,
	});
};
let UpdateSlot = async (req, res) => {
	let { data } = req.body;
	console.log("control", data);
	let check = await apiService.updateSlot(data);
	return res.status(200).json({
		errCode: check.errCode,
		errMessage: check.errMessage,
	});
};
module.exports = {
	HandleCreateNewCar: HandleCreateNewCar,
	HandleGetAllCar: HandleGetAllCar,
	HandleGetAllCar_Ticket: HandleGetAllCar_Ticket,
	HandleGetTypeTicket: HandleGetTypeTicket,
	HandleCreatePayment: HandleCreatePayment,
	HandleDeleteTicket: HandleDeleteTicket,
	HandleCreateTime: HandleCreateTime,
	HandlePaymentMoMo: HandlePaymentMoMo,
	handlePaymentZaloPay: handlePaymentZaloPay,
	handleCheckZaloPay: handleCheckZaloPay,
	handleCallBackZaloPay: handleCallBackZaloPay,
	HandleGetAllSlot: HandleGetAllSlot,
	UpdateSlot: UpdateSlot,
};
