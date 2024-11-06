import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Modal } from "react-bootstrap";
import Car_Modal from "../Car/Car_Modal";
import { CreateNewCar, getAllCar } from "../../services/apiService";
const Modal_Edit_User = (props) => {
	const [formData, setFormData] = useState({
		email: "",
		fullName: "",
		id: "",
		phone: "",
	});
	const [isOpenModalCar, setIsOpenModalCar] = useState(false);
	const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(props.isOpen);
	const [userCar, setUserCar] = useState([]);
	useEffect(() => {
		let user = props.userEdit;
		if (user && Object.keys(user).length > 0) {
			setFormData({
				email: user.email,
				fullName: user.fullName,
				phone: user.phone,
				id: user.id,
			});
		}
	}, [props.userEdit]);

	useEffect(() => {
		setIsEditUserModalOpen(props.isOpen);
	}, [props.isOpen]);

	useEffect(() => {
		if (props.isOpen && props.userEdit && props.userEdit.id) {
			fetchUserCars();
		}
	}, [props.isOpen, props.userEdit]);
	const fetchUserCars = async () => {
		try {
			const car_account = await getAllCar(props.userEdit.id);
			if (car_account && car_account.errCode === 0) {
				setUserCar(car_account.car);
			} else {
				toast.error(car_account.errMessage);
			}
		} catch (error) {
			console.error("Failed to fetch cars:", error);
		}
	};
	const HandleAddNewCar = () => {
		setIsOpenModalCar(true);
		setIsEditUserModalOpen(false);
	};
	const toggleCarModal = () => {
		setIsOpenModalCar(!isOpenModalCar);
		setIsEditUserModalOpen(true);
	};
	const createNewCar = async (car) => {
		try {
			const response = await CreateNewCar(car, props.userEdit);
			if (response && response.errCode === 0) {
				fetchUserCars();
				setIsOpenModalCar(false);
				setIsEditUserModalOpen(true);
				toast.success("Add Car success");
			} else {
				toast.error(response.errMessage);
			}
		} catch (e) {
			console.log(e);
		}
	};
	const handleChangeInput = (event, id) => {
		setFormData({
			...formData,
			[id]: event.target.value,
		});
	};
	const checkValidInput = () => {
		let isValid = true;
		const arrInput = ["email", "fullName", "phone"];
		for (let i = 0; i < arrInput.length; i++) {
			if (!formData[arrInput[i]]) {
				isValid = false;
				toast.error("Missing parameter: " + arrInput[i]);
				break;
			}
		}
		return isValid;
	};
	const handleEditUser = () => {
		const isValid = checkValidInput();
		if (isValid) {
			props.EditUser(formData);
		}
	};
	return (
		<div className="text-center">
			<Car_Modal
				isOpen={isOpenModalCar}
				toggle={toggleCarModal}
				createNewCar={createNewCar}
			/>
			<Modal
				show={isEditUserModalOpen}
				onHide={() => {
					props.toggle("isOpenModalEditUser");
					setIsEditUserModalOpen(false);
					if (isOpenModalCar) {
						setIsOpenModalCar(false);
					}
				}}
				className={"abc"}
				size="lg"
				centered
			>
				<Modal.Header toggle={() => props.toggle("isOpenModalEditUser")}>
					<Modal.Title>Edit User</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="modal-user-body">
						<div className="row mb-3">
							<div className="col-md-6">
								<label>Email</label>
								<input
									type="text"
									className="form-control"
									value={formData.email}
									onChange={(event) => handleChangeInput(event, "email")}
									disabled
								/>
							</div>
							<div className="col-md-6">
								<label>Full Name</label>
								<input
									type="text"
									className="form-control"
									value={formData.fullName}
									onChange={(event) => handleChangeInput(event, "fullName")}
								/>
							</div>
						</div>
						<div className="row mb-3">
							<div className="col-md-12">
								<label>Phone Number</label>
								<input
									type="text"
									className="form-control"
									value={formData.phone}
									onChange={(event) => handleChangeInput(event, "phone")}
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

							{userCar &&
								userCar.length > 0 &&
								userCar.map((item, index) => {
									return (
										<tr key={item.id_car}>
											<td>{index + 1}</td>
											<td>{item.name}</td>
											<td>{item.license_plate}</td>
											<td>{item.type}</td>
										</tr>
									);
								})}
						</tbody>
					</table>
					<button className="button_add_car" onClick={HandleAddNewCar}>
						Add Car
					</button>
				</Modal.Body>
				<Modal.Footer>
					<Button color="primary" className="px-2" onClick={handleEditUser}>
						Save Changes
					</Button>{" "}
					<Button
						color="secondary"
						className="px-2"
						onClick={() => props.toggle("isOpenModalEditUser")}
					>
						Cancel
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default Modal_Edit_User;
