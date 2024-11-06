import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
const Modal_Search = (props) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const { toggle, data, isOpen, SelectedUser } = props;

	const handleSearch = () => {
		if (searchTerm === "") {
			setSearchResults([]);
			return;
		}
		const results = data.filter((user) =>
			user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
		);
		if (results.length > 0) {
			setSearchResults(results);
		} else {
			setSearchResults([]);
		}
	};
	const HandleChoose = (user) => {
		SelectedUser(user);
		HandleToggle();
	};
	const HandleToggle = () => {
		toggle("isOpenModalSearch");
		setSearchTerm("");
		setSearchResults([]);
	};
	return (
		<div>
			<Modal show={isOpen} onHide={HandleToggle} centered size="lg">
				<Modal.Header closeButton>
					<Modal.Title>Find User</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="modal-user-body">
						<div className="row mb-3">
							<div className="col-md-12">
								<div className="input-group mb-3">
									<input
										type="text"
										className="form-control"
										placeholder="Search username"
										aria-label="Search username"
										aria-describedby="basic-addon2"
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
									/>
									<div className="input-group-append">
										<button
											className="btn btn-success"
											type="button"
											onClick={handleSearch}
										>
											Search
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
					<table className="table table-striped table-bordered" id="customers">
						<tbody>
							<tr>
								<th>STT</th>
								<th>User Name</th>
								<th>Number Phone</th>
								<th>Choose</th>
							</tr>
							{searchResults.length > 0 ? (
								searchResults.map((user, index) => (
									<tr key={index}>
										<td>{index + 1}</td>
										<td>{user.fullName}</td>
										<td>{user.phone}</td>
										<td>
											<button
												className="btn btn-primary"
												onClick={() => HandleChoose(user)}
											>
												Choose
											</button>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan="4" className="text-center text-danger">
										User Not Found
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" className="px-2" onClick={HandleToggle}>
						Cancel
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default Modal_Search;
