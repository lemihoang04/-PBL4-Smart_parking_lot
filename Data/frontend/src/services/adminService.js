import axios from "../setup/axios";

const LoginAdmin = (data) => {
	return axios
		.post("/api/admin_login", data)
		.then((response) => {
			return response;
		})
		.catch((error) => {
			console.error(error);
		});
};

export { LoginAdmin };
