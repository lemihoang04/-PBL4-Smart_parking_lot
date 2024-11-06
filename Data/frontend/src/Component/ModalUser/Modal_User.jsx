import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import "../ModalUser/modalUser.css";
import { toast } from "react-toastify";
import Car_Modal from "../Car/Car_Modal";
import { CreateNewCar } from "../../services/apiService";
const Modal_User = (props) => {
	const defaultValue = {
		email: "",
		password: "",
		fullName: "",
		phone: "",
	};
	const [formValues, setFormValues] = useState(defaultValue);
	const [isOpenModalCar, setIsOpenModalCar] = useState(false);
	const [isUserModalOpen, setIsUserModalOpen] = useState(props.isOpen);
	const [CarList, setCarList] = useState([]);
	const { toggle, createNewUser } = props;
	const resetForm = () => {
		setFormValues(defaultValue);
		setCarList([]);
	};
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormValues({
			...formValues,
			[name]: value,
		});
	};
	const checkValidInput = () => {
		let isValid = true;
		const arrInput = ["email", "password", "fullName", "phone"];
		for (let i = 0; i < arrInput.length; i++) {
			if (!formValues[arrInput[i]]) {
				isValid = false;
				toast.error("Missing parameter: " + arrInput[i]);
				break;
			}
		}
		return isValid;
	};
	const handleAddNewUser = async () => {
		const check = checkValidInput();
		if (check) {
			let newUser = await createNewUser(formValues);
			if (newUser && newUser.user.id) {
				let cars = CarList;
				await createNewCar(cars, newUser.user);
				setIsOpenModalCar(false);
				setIsUserModalOpen(false);
			}
			resetForm();
		}
	};
	useEffect(() => {
		setIsUserModalOpen(props.isOpen);
	}, [props.isOpen]);
	useEffect(() => {
		if (props.isOpen) {
			setFormValues(defaultValue);
			setCarList([]);
		}
	}, [props.isOpen]);
	const handleAddCar = (car) => {
		setCarList((prevCarList) => [...prevCarList, car]);
		setIsOpenModalCar(false);
		setIsUserModalOpen(true);
	};
	const createNewCar = async (car, newUser) => {
		try {
			const response = await CreateNewCar(car, newUser);
			if (response && response.errCode === 0) {
				setIsOpenModalCar(false);
				setIsUserModalOpen(true);
			} else {
				toast.error(response.errMessage);
			}
		} catch (e) {
			console.log(e);
		}
	};
	const toggleCarModal = () => {
		setIsOpenModalCar(!isOpenModalCar);
		if (!isOpenModalCar) {
			setIsUserModalOpen(false);
		} else {
			setIsUserModalOpen(true);
		}
	};

	return (
		<div className="text-center">
			<Car_Modal
				isOpen={isOpenModalCar}
				toggle={toggleCarModal}
				onAddCar={handleAddCar}
				source="Modal_User"
			/>
			<Modal
				show={isUserModalOpen}
				onHide={() => {
					toggle("isOpenModalUser");
					setIsUserModalOpen(false);
					resetForm();
					if (isOpenModalCar) {
						setIsOpenModalCar(false);
					}
				}}
				centered
				size="lg"
			>
				<Modal.Header closeButton>
					<Modal.Title>Create New User</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="modal-user-body">
						<div className="row mb-3">
							<div className="col-md-6">
								<label>Email</label>
								<input
									type="text"
									className="form-control"
									name="email"
									value={formValues.email}
									onChange={handleInputChange}
								/>
							</div>
							<div className="col-md-6">
								<label>Password</label>
								<input
									type="password"
									className="form-control"
									name="password"
									value={formValues.password}
									onChange={handleInputChange}
								/>
							</div>
						</div>
						<div className="row mb-3">
							<div className="col-md-6">
								<label>Full Name</label>
								<input
									type="text"
									className="form-control"
									name="fullName"
									value={formValues.fullName}
									onChange={handleInputChange}
								/>
							</div>
							<div className="col-md-6">
								<label>Phone Number</label>
								<input
									type="text"
									className="form-control"
									name="phone"
									value={formValues.phone}
									onChange={handleInputChange}
								/>
							</div>
						</div>
					</div>
					<h3 className="text-center mb-4">List View Car</h3>

					<table className="table table-striped table-bordered" id="customers">
						<tbody>
							<tr>
								<th>STT</th>
								<th>Name Car</th>
								<th>License Plate</th>
								<th>Type Car</th>
							</tr>
							{CarList.map((car, index) => (
								<tr key={index}>
									<td>{index + 1}</td>
									<td>{car.name}</td>
									<td>{car.license_plate}</td>
									<td>{car.type}</td>
								</tr>
							))}
						</tbody>
					</table>
					<button className="button_add_car" onClick={toggleCarModal}>
						Add Car
					</button>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" className="px-2" onClick={handleAddNewUser}>
						Save Changes
					</Button>
					<Button
						variant="secondary"
						className="px-2"
						onClick={() => toggle("isOpenModalUser")}
					>
						Cancel
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default Modal_User;
