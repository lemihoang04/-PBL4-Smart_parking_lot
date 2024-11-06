import React, { useEffect, useRef } from "react";
import { CheckPayment, DeleteTicket } from "../../services/apiService";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

const PaymentCall = () => {
	const history = useHistory();
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const appTransId = queryParams.get("apptransid");
	const id_car = queryParams.get("id_car");
	const status = queryParams.get("status");
	const hasChecked = useRef(false);

	const handleCheck = async () => {
		if (hasChecked.current) return;
		hasChecked.current = true;

		let carId = typeof id_car === "object" ? Object.keys(id_car)[0] : id_car;
		if (status !== "-49") {
			const paymentStatus = await CheckPayment(appTransId);
			if (paymentStatus && paymentStatus.return_code === 1) {
				toast.success("Successful Transaction");
				history.push("/ticket");
			} else {
				toast.error(paymentStatus.return_message);
				await DeleteTicket(carId);
				history.push("/ticket/create");
			}
		} else {
			toast.error("Transaction Failed");
			await DeleteTicket(carId);
			history.push("/ticket/create");
		}
	};

	useEffect(() => {
		handleCheck();
	}, []); // Chạy useEffect một lần khi component mount

	return null;
};

export default PaymentCall;
