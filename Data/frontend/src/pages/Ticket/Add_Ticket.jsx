import React, { useContext, useEffect, useState } from "react";
import {
	useHistory,
	useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import { GetAllUser } from "../../services/userService";
import {
	CreateTicket,
	getTypeTicket,
	PaymentZaloPay,
} from "../../services/apiService";
import { UserContext } from "../../Context/UserProvider";
import { getAllCar } from "../../services/apiService";
import { toast } from "react-toastify";
import Modal_Search from "../../Component/ModalUser/Modal_Search";

const Add_Ticket = () => {
	const history = useHistory();
	const location = useLocation();
	const [users, setUsers] = useState([]);
	const { user } = useContext(UserContext);
	const [isOpenModalSearch, setIsOpenModalSearch] = useState(false);
	const defaultValue = {
		id_user: "",
		fullName: "",
		phone: "",
		type: "",
		price: "",
		paymentDate: "",
		licenseplate: "",
	};
	const [formValues, setFormValues] = useState(defaultValue);
	const [userCar, setUserCar] = useState([]);
	const [selectedTicketType, setSelectedTicketType] = useState("");
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormValues({
			...formValues,
			[name]: value,
		});
	};
	const GetData = async () => {
		try {
			let id_User = "ALL";
			if (user && user.isAuthenticated === true) {
				id_User = user.account.id || id_User;
			}
			let respone = await GetAllUser(id_User);
			if (respone && respone.errCode === 0) {
				if (Array.isArray(respone.user)) {
					setUsers(respone.user);
				} else {
					setUsers([respone.user]);
				}
			} else {
				toast.error("Get Data Failed");
			}
		} catch (e) {
			toast.error("Get Data Failed");
			console.log("err:", e);
		}
	};
	const GetUser_ticket = () => {
		if (location.state && location.state.user_ticket) {
			setFormValues({
				id_user: location.state.user_ticket.users.id,
				fullName: location.state.user_ticket.users.fullName,
				phone: location.state.user_ticket.users.phone,
				type: location.state.user_ticket.Reservation.type,
				price: location.state.user_ticket.Reservation.price,
				paymentDate: location.state.user_ticket.paymentDate,
				licenseplate: location.state.user_ticket.license_plate,
			});
			setSelectedTicketType(location.state.user_ticket.Reservation.type);
		} else {
			setFormValues(defaultValue);
		}
	};
	useEffect(() => {
		if (location && location.state !== "") {
			GetUser_ticket();
		}
	}, [location]);
	useEffect(() => {
		GetData();
		fetchUserCars();
	}, [formValues.id_user]);
	const HandleOpenModalSearch = () => {
		setIsOpenModalSearch(true);
	};
	const toggleUserModal = (name) => {
		setIsOpenModalSearch(!isOpenModalSearch);
	};
	const HandleUserSelect = (user) => {
		setFormValues({
			id_user: user.id,
			fullName: user.fullName,
			phone: user.phone,
		});
	};
	const formatDateForDisplay = (dateString) => {
		const date = new Date(dateString);
		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const year = date.getFullYear();
		return `${day}/${month}/${year}`;
	};
	const HandleSelectType = async (e) => {
		const selectedValue = e.target.value;
		setSelectedTicketType(selectedValue);
		if (selectedValue !== "Choose...") {
			let ticket = await getTypeTicket(selectedValue);
			let expirationDate = new Date();
			if (selectedValue === "Day") {
				expirationDate.setDate(expirationDate.getDate() + 1);
			} else if (selectedValue === "Month") {
				expirationDate.setMonth(expirationDate.getMonth() + 1);
			} else if (selectedValue === "Year") {
				expirationDate.setFullYear(expirationDate.getFullYear() + 1);
			}
			const formattedDate = formatDateForDisplay(expirationDate);
			setFormValues({
				...formValues,
				type: ticket.type,
				price: ticket.price,
				paymentDate: formattedDate,
			});
		} else {
			setFormValues({
				...formValues,
				type: "",
				price: "",
				paymentDate: "",
			});
		}
	};
	const handleSelectLicensePlate = (e) => {
		const selectedValue = e.target.value;
		if (selectedValue === "Choose...") {
			setFormValues({
				...formValues,
				licenseplate: "",
			});
		} else if (userCar.some((car) => car.license_plate === selectedValue)) {
			setFormValues({
				...formValues,
				licenseplate: selectedValue,
			});
		}
	};
	const fetchUserCars = async () => {
		try {
			if (formValues.id_user !== "") {
				const car_account = await getAllCar(formValues.id_user);
				if (car_account && car_account.errCode === 0) {
					setUserCar(car_account.car);
				} else {
					toast.error(car_account.errMessage);
				}
			}
		} catch (error) {
			console.error("Failed to fetch cars:", error);
		}
	};
	const HandleCreateTicket = async () => {
		try {
			let response = await CreateTicket(formValues);
			if (response && response.errCode === 0) {
				let payment = await PaymentZaloPay(formValues);
				if (payment && payment.return_code === 1) {
					window.location.href = payment.order_url;
				}
			} else {
				toast.error(response.errMessage);
			}
		} catch (e) {
			console.log("Error: ", e);
		}
	};
	const HandleReturn = () => {
		history.push("/ticket");
	};
	return (
		<>
			<Modal_Search
				isOpen={isOpenModalSearch}
				toggle={toggleUserModal}
				data={users}
				SelectedUser={HandleUserSelect}
			/>
			<div className="row mt-4">
				<div className="col-6"></div>
				<div className="col-6">
					<span className="fw-bold">User's Info:</span>
					<button
						className="btn btn-success ms-2"
						onClick={HandleOpenModalSearch}
					>
						Search
					</button>
				</div>
			</div>
			<div className="row mt-4">
				<div className="col-6">
					<div className="mb-3">
						<div className="input-group">
							<span className="input-group-text fw-bold">User's Name:</span>
							<input
								type="text"
								className="form-control"
								name="fullName"
								value={formValues.fullName}
								onChange={handleInputChange}
								disabled
							/>
						</div>
					</div>
					<div className="mb-3">
						<div className="input-group">
							<span className="input-group-text fw-bold">Phone Number:</span>
							<input
								type="text"
								className="form-control"
								name="phone"
								value={formValues.phone}
								onChange={handleInputChange}
								disabled
							/>
						</div>
					</div>
					<div className="mb-3">
						<div className="input-group">
							<span className="input-group-text fw-bold">Expiration Date:</span>
							<input
								type="text"
								className="form-control"
								name="paymentDate"
								value={formValues.paymentDate}
								onChange={handleInputChange}
								disabled
							/>
						</div>
					</div>
				</div>
				<div className="col-6">
					{location && location.state === undefined ? (
						<div className="input-group mb-3">
							<div className="input-group-prepend">
								<span className="input-group-text fw-bold">License Plate:</span>
							</div>
							<select
								className="form-select"
								onChange={handleSelectLicensePlate}
							>
								<option defaultValue>Choose...</option>
								{userCar &&
									userCar.length > 0 &&
									userCar.map((car, index) => {
										return (
											<option key={index} value={car.license_plate}>
												{car.license_plate}
											</option>
										);
									})}
							</select>
						</div>
					) : (
						<div className="input-group mb-3">
							<span className="input-group-text fw-bold">License Plate:</span>
							<input
								type="text"
								className="form-control"
								name="licenseplate"
								value={formValues.licenseplate}
								onChange={handleInputChange}
								disabled
							/>
						</div>
					)}
					<div className="mb-3">
						<div className="input-group">
							<span className="input-group-text fw-bold">Price:</span>
							<input
								type="text"
								className="form-control"
								name="price"
								value={formValues.price}
								onChange={handleInputChange}
								disabled
							/>
						</div>
					</div>
					{location && location.state === "" ? (
						<div className="input-group mb-3">
							<div className="input-group-prepend">
								<span className="input-group-text fw-bold">Ticket Type:</span>
							</div>
							<select className="form-select" onChange={HandleSelectType}>
								<option defaultValue>Choose...</option>
								<option value="Day">Day</option>
								<option value="Month">Month</option>
								<option value="Year">Year</option>
							</select>
						</div>
					) : (
						<div className="input-group mb-3">
							<div className="input-group-prepend">
								<span className="input-group-text fw-bold">Ticket Type:</span>
							</div>
							<select
								value={selectedTicketType}
								className="form-select"
								onChange={HandleSelectType}
							>
								<option defaultValue>Choose...</option>
								<option value="Day">Day</option>
								<option value="Month">Month</option>
								<option value="Year">Year</option>
							</select>
						</div>
					)}
				</div>
			</div>
			<div className="d-flex justify-content-center mt-5">
				<button
					className="btn btn-lg btn-secondary center"
					onClick={HandleReturn}
				>
					Back
				</button>
				<button
					className="btn btn-lg btn-success ms-4 center"
					onClick={HandleCreateTicket}
				>
					Save
				</button>
			</div>
		</>
	);
};

export default Add_Ticket;
