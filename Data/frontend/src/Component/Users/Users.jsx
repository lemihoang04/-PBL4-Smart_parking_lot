import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
	CreateNewUser,
	DeleteUser,
	EditUserService,
	GetAllUser,
	LogOutUser,
} from "../../services/userService";
import "../Users/users.css";
import { UserContext } from "../../Context/UserProvider";
import Modal_User from "../ModalUser/Modal_User";
import Modal_Edit_User from "../Modal_Edit_User/Modal_Edit_User";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
const Users = () => {
	const history = useHistory();
	const [users, setUsers] = useState([]);
	const { user, loginContext, logoutContext } = useContext(UserContext);
	const [userEdit, setUserEdit] = useState({});
	const [isOpenModalUser, setIsOpenModalUser] = useState(false);
	const [isOpenModalInfo, setIsOpenModalInfo] = useState(false);
	const [isOpenModalEditUser, setIsOpenModalEditUser] = useState(false);
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
	useEffect(() => {
		GetData();
	}, []);
	const HandleAddNewUser = () => {
		setIsOpenModalUser(true);
	};
	const HandleEditUser = (user) => {
		setIsOpenModalEditUser(true);
		setUserEdit(user);
	};
	const HandleGetInfoUser = (userInfo) => {
		// setIsOpenModalInfo(true);
		// setUserEdit(userInfo);
		history.push(`/info-car/id=${userInfo.id}`, { userInfo });
	};
	const toggleUserModal = (name) => {
		if (name === "isOpenModalUser") {
			setIsOpenModalUser(!isOpenModalUser);
		} else if (name === "isOpenModalEditUser") {
			setIsOpenModalEditUser(!isOpenModalEditUser);
		} else if (name === "isOpenModalInfo") {
			setIsOpenModalInfo(!isOpenModalInfo);
		}
	};
	const DoEditUser = async (user_edit) => {
		try {
			let response = await EditUserService(user_edit);
			if (response && response.errCode === 0) {
				setIsOpenModalEditUser(false);
				if (!user.account.id_admin) {
					let token = response.DT.access_token;
					let data = {
						isAuthenticated: true,
						token: token,
						id: response.user.id,
						account: response.user,
					};
					loginContext(data);
				} else {
					let token = response.DT.access_token;
					let data = {
						isAuthenticated: true,
						token: token,
						id: response.user.id,
						account: response.user,
					};
				}
				GetData();
				toast.success("Update success");
			} else {
				alert(response.errMessage);
			}
		} catch (e) {
			console.log(e);
		}
	};
	const createNewUser = async (formValues) => {
		try {
			const response = await CreateNewUser(formValues);
			if (response && response.errCode === 0) {
				setIsOpenModalUser(false);
				toast.success("Create New User Success");
				GetData();
				return response;
			} else {
				toast.error(response.errMessage);
			}
		} catch (e) {
			toast.error("Create User failed. Please try again.");
			console.log(e);
		}
	};
	const HandleDeleteUser = async (user_id) => {
		try {
			const response = await DeleteUser(user_id);
			if (response && response.errCode === 0) {
				if (user && user.account && user.account.id === user_id) {
					let data = await LogOutUser();
					logoutContext();
					if (data && data.errCode === 0) {
						history.push("/");
						toast.success("account has been deleted");
					} else {
						toast.error(data.errMessage);
					}
					return;
				}
				toast.success("Delete User Success");
				GetData();
			} else {
				toast.error(response.errMessage);
			}
		} catch (e) {
			toast.error("Delete User failed. Please try again.");
			console.log(e);
		}
	};
	return (
		<div className="user-container">
			<Modal_User
				isOpen={isOpenModalUser}
				toggle={toggleUserModal}
				createNewUser={createNewUser}
			/>
			{isOpenModalEditUser && (
				<Modal_Edit_User
					isOpen={isOpenModalEditUser}
					toggle={toggleUserModal}
					userEdit={userEdit}
					EditUser={DoEditUser}
				/>
			)}
			<div className="title text-center">
				<h2>Manage user</h2>
			</div>
			{user.account.id === undefined ? (
				<div className="mx-1">
					<button
						className="btn btn-primary px-3"
						onClick={() => HandleAddNewUser()}
					>
						<i className="fas fa-plus"></i> Add New User
					</button>
				</div>
			) : (
				<></>
			)}
			<div className="users-table mt-3 mx-1">
				<table id="customers">
					<tbody>
						<tr>
							<th>Id</th>
							<th>Email</th>
							<th>FullName</th>
							<th>Phone Number</th>
							<th className="px-5">Action</th>
							<th>Car Information</th>
						</tr>
						{users &&
							users.length > 0 &&
							users.map((item, index) => {
								return (
									<tr key={index}>
										<td>{index + 1}</td>
										<td>{item.email}</td>
										<td>{item.fullName}</td>
										<td>{item.phone}</td>
										<td>
											<button
												className="btn btn-outline-light text-warning mx-2"
												onClick={() => HandleEditUser(item)}
											>
												<i className="bi bi-pencil"></i>
											</button>
											<button
												className="btn btn-outline-light text-danger ms-3"
												onClick={() => HandleDeleteUser(item.id)}
											>
												<i className="bi bi-trash"></i>
											</button>
										</td>
										<td>
											<button
												className="btn btn-outline-light text-black mx-4"
												onClick={() => HandleGetInfoUser(item)}
											>
												<i className="bi bi-eye"></i>
											</button>
										</td>
									</tr>
								);
							})}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Users;
