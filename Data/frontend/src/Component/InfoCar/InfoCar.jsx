import React, { useContext, useEffect, useState } from "react";
import {
	useHistory,
	useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import "./infoCar.css";
import { UserContext } from "../../Context/UserProvider";
import { GetAllUser } from "../../services/userService";
import { toast } from "react-toastify";
import { getAllCar, getAllCar_Ticket } from "../../services/apiService";
const InfoCar = () => {
	const history = useHistory();
	const location = useLocation();
	const [formData, setFormData] = useState({
		email: "",
		fullName: "",
		id: "",
		phone: "",
	});
	const [users, setUsers] = useState([]);
	const { user } = useContext(UserContext);
	const [userTicket, setUserTicket] = useState([]);
	const [userCar, setUserCar] = useState([]);

	const GetData = async () => {
		try {
			let id_User = "ALL";
			if (user && user.isAuthenticated === true) {
				id_User = user.account.id || id_User;
			}
			let response = await GetAllUser(id_User);
			if (response && response.errCode === 0) {
				if (Array.isArray(response.user)) {
					setUsers(response.user);
				} else {
					setUsers([response.user]);
				}
			} else {
				toast.error("Get Data Failed");
			}
			setUsers([formData]);
		} catch (e) {
			toast.error("Get Data Failed");
			console.log("err:", e);
		}
	};

	const fetchUserCars = async () => {
		try {
			let user_id = users.map((userItem) => userItem.id);
			const car_account = await getAllCar(user_id);
			if (car_account && car_account.errCode === 0) {
				setUserCar(car_account.car);
			} else {
				toast.error(car_account.errMessage);
			}
		} catch (error) {
			console.error("Failed to fetch cars:", error);
		}
	};
	const formatDate = (dateString) => {
		const options = { year: "numeric", month: "2-digit", day: "2-digit" };
		const date = new Date(dateString);
		return date.toLocaleDateString("vi-VN", options);
	};
	const fetchTotal = () => {
		const combinedData = userCar.map((car) => {
			return {
				...car,
				users: users.find((user) => user.id === car.id_user) || {},
				paymentDate: car.paymentDate ? formatDate(car.paymentDate) : "",
			};
		});
		setUserTicket(combinedData);
	};
	useEffect(() => {
		let user = location.state && location.state.userInfo;
		if (user && Object.keys(user).length > 0) {
			setFormData({
				email: user.email,
				fullName: user.fullName,
				phone: user.phone,
				id: user.id,
			});
		}
	}, [location.state]);

	useEffect(() => {
		if (formData.id) {
			GetData();
		}
	}, [user.account.id, formData.id]);

	useEffect(() => {
		if (users.length > 0) {
			fetchUserCars();
		}
	}, [users]);

	useEffect(() => {
		if (users.length > 0 && userCar.length > 0) {
			fetchTotal();
		}
	}, [users, userCar]);

	const HandleReturn = () => {
		history.push("/users");
	};
	return (
		<div>
			<h3 className="text-center">User Infomations</h3>
			<div className="container-fluid">
				<div className="row d-flex flex-column align-content-center">
					<div className="col-md-4">
						<label className="titlesub">Email</label>
						<input
							type="text"
							className="form-control"
							value={formData.email}
							disabled
						/>
					</div>
					<div className="col-md-4">
						<label className="titlesub">Full Name</label>
						<input
							type="text"
							className="form-control"
							value={formData.fullName}
							disabled
						/>
					</div>
					<div className="col-md-4">
						<label className="titlesub">Phone Number</label>
						<input
							type="text"
							className="form-control"
							value={formData.phone}
							disabled
						/>
					</div>
				</div>
			</div>
			<h3 className="text-center mb-4">List View Car</h3>
			<div className="table-responsive">
				<table className="table table-striped table-bordered" id="customers">
					<tbody>
						<tr>
							<th>STT</th>
							<th>Name Car</th>
							<th>License Plate</th>
							<th>Type Car</th>
							<th>Type Ticket</th>
							<th>Expiration Date</th>
							<th>In Time</th>
							<th>Out Time</th>
						</tr>
						{userTicket && userTicket.length > 0 ? (
							userTicket.map((item, index) => {
								return (
									<tr>
										<td>{index + 1}</td>
										<td>{item.name}</td>
										<td>{item.license_plate}</td>
										<td>{item.type}</td>
										{item.Reservation ? (
											<td>{item.Reservation.type}</td>
										) : (
											<td className="text-danger">Not Have Ticket</td>
										)}
										{item.paymentDate ? (
											<td>{item.paymentDate}</td>
										) : (
											<td className="text-danger">Not Have Ticket</td>
										)}
										{item.inTime ? (
											<td>{item.inTime}</td>
										) : (
											<td className="text-danger">Not Have Data</td>
										)}
										{item.outTime ? (
											<td>{item.outTime}</td>
										) : (
											<td className="text-danger">Not Have Data</td>
										)}
									</tr>
								);
							})
						) : (
							<td colSpan="10">
								<h4 className="text-center text-danger">
									User Not Have Register Car
								</h4>
							</td>
						)}
					</tbody>
				</table>
			</div>
			<div className="d-flex justify-content-center mt-5">
				<button
					className="btn btn-lg btn-secondary center"
					onClick={HandleReturn}
				>
					Back
				</button>
			</div>
		</div>
	);
};

export default InfoCar;
