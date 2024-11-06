import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import {
	DeleteTicket,
	getAllCar,
	getAllCar_Ticket,
} from "../../services/apiService";
import { toast } from "react-toastify";
import { UserContext } from "../../Context/UserProvider";
import { GetAllUser } from "../../services/userService";

const Ticket = () => {
	const history = useHistory();
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
		} catch (e) {
			toast.error("Get Data Failed");
			console.log("err:", e);
		}
	};

	const fetchUserCars = async () => {
		try {
			let user_id = users.map((userItem) => userItem.id);
			const car_account = await getAllCar_Ticket(user_id);
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
		GetData();
	}, [user.account.id]);

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
	const HandleEditTicket = (user_ticket) => {
		history.push("/ticket/create", { user_ticket });
	};
	const HandleDeleteTicket = async (data) => {
		try {
			let result = await DeleteTicket(data);
			if (result && result.errCode === 0) {
				toast.success(result.message);
			} else {
				toast.error(result.errMessage);
			}
			await GetData();
			await fetchUserCars();
			fetchTotal();
		} catch (e) {
			console.log("err: ", e);
		}
	};
	const HandleAddTicket = () => {
		history.push("/ticket/create");
	};

	return (
		<div className="users-table mt-3 mx-1">
			<div className="title text-center mb-3">
				<h2>Manage Ticket</h2>
			</div>
			<table id="customers">
				<tbody>
					<tr>
						<th>STT</th>
						<th>Id Ticket</th>
						<th>License Plate</th>
						<th>User Name</th>
						<th>Phone Number</th>
						<th>Type Ticket</th>
						<th>Price Ticket</th>
						<th>Expiration Date</th>
						<th>Ticket Renewal</th>
						<th>Delete</th>
					</tr>
					{userTicket && userTicket.length > 0 ? (
						userTicket.map((item, index) => {
							return (
								<tr key={index}>
									<td>{index + 1}</td>
									<td>MV - {index + 1}</td>
									<td>{item.license_plate}</td>
									<td>{item.users.fullName}</td>
									<td>{item.users.phone}</td>
									<td>{item.Reservation.type}</td>
									<td>{item.Reservation.price}</td>
									<td>{item.paymentDate}</td>
									<td>
										<button
											className="btn btn-outline-light text-warning mx-2"
											onClick={() => HandleEditTicket(item)}
										>
											<i className="bi bi-pencil"></i>
										</button>
									</td>
									<td>
										<button
											className="btn btn-outline-light text-danger ms-3"
											onClick={() => HandleDeleteTicket(item)}
										>
											<i className="bi bi-trash"></i>
										</button>
									</td>
								</tr>
							);
						})
					) : (
						<tr>
							<td colSpan="10" className="text-center text-danger">
								<h4>No Tickets Yet</h4>
							</td>
						</tr>
					)}
				</tbody>
			</table>
			<button className="btn btn-success mt-5 ms-5" onClick={HandleAddTicket}>
				Add Ticket
			</button>
		</div>
	);
};

export default Ticket;
