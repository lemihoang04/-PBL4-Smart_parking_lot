import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
const Car_Modal = (props) => {
	const defaultValue = {
		name: "",
		license_plate: "",
		type: "",
	};
	const [formValues, setFormValues] = useState(defaultValue);
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormValues({
			...formValues,
			[name]: value,
		});
	};
	const checkValidInput = () => {
		let isValid = true;
		const arrInput = ["name", "license_plate", "type"];
		for (let i = 0; i < arrInput.length; i++) {
			if (!formValues[arrInput[i]]) {
				isValid = false;
				toast.error("Missing parameter: " + arrInput[i]);
				break;
			}
		}
		return isValid;
	};
	const handleAddNewCar = () => {
		const check = checkValidInput();
		if (check) {
			if (source === "Modal_User") {
				onAddCar(formValues);
			} else {
				createNewCar(formValues);
			}
			setFormValues(defaultValue);
		}
	};
	const handleToggle = () => {
		toggle();
		setFormValues(defaultValue);
	};

	const { isOpen, toggle, createNewCar, onAddCar, source } = props;
	return (
		<div className="text-center">
			<Modal show={isOpen} onHide={() => toggle()} centered size="lg">
				<Modal.Header closeButton>
					<Modal.Title>Add New Car</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="modal-user-body">
						<div className="row mb-4">
							<div className="col-md-12">
								<label>Name Car</label>
								<input
									type="text"
									className="form-control"
									name="name"
									value={formValues.name}
									onChange={handleInputChange}
								/>
							</div>
							<div className="col-md-12">
								<label>License Plate</label>
								<input
									type="text"
									className="form-control"
									name="license_plate"
									value={formValues.license_plate}
									onChange={handleInputChange}
								/>
							</div>
						</div>
						<div className="row">
							<div className="col-md-12">
								<label>Type Car</label>
								<input
									type="text"
									className="form-control"
									name="type"
									value={formValues.type}
									onChange={handleInputChange}
								/>
							</div>
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" className="px-2" onClick={handleAddNewCar}>
						Save Changes
					</Button>
					<Button
						variant="secondary"
						className="px-2"
						onClick={() => handleToggle()}
					>
						Cancel
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default Car_Modal;
