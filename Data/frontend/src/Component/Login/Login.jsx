import { useState, React, useContext } from "react";
import { useHistory } from "react-router-dom";
import "./login.css";
import { toast } from "react-toastify";
import { LoginUser } from "../../services/userService";
import { UserContext } from "../../Context/UserProvider";
const Login = () => {
	const { loginContext } = useContext(UserContext);
	let history = useHistory();
	const [formValues, setFormValues] = useState({
		email: "",
		password: "",
	});
	const defaultobjvalidinput = {
		isValidLogin: true,
		isValidPass: true,
	};
	const [objvalidinput, setObjvalidinput] = useState(defaultobjvalidinput);
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormValues({
			...formValues,
			[name]: value,
		});
	};
	const HandleCreateAccount = () => {
		history.push("/register");
	};
	const ReHomePage = () => {
		history.push("/");
	};
	const HandleLogin = async (e) => {
		e.preventDefault();
		setObjvalidinput(defaultobjvalidinput);
		if (!formValues.email && !formValues.password) {
			setObjvalidinput({
				...defaultobjvalidinput,
				isValidLogin: false,
				isValidPass: false,
			});
			toast.error("Please fill in your email and password");
			return;
		}
		if (!formValues.email) {
			setObjvalidinput({ ...defaultobjvalidinput, isValidLogin: false });
			toast.error("Please fill in your email");
			return;
		}
		if (!formValues.password) {
			setObjvalidinput({ ...defaultobjvalidinput, isValidPass: false });
			toast.error("Please fill in your password");
		}
		try {
			const response = await LoginUser(formValues);
			if (response && response.errcode === 0) {
				toast.success("Success Login");
				let token = response.DT.access_token;
				let data = {
					isAuthenticated: true,
					token: token,
					id: response.user.id,
					account: response.user,
				};
				loginContext(data);
				history.push("/users");
			} else {
				toast.error(response.message);
			}
		} catch (e) {
			toast.error("Login failed. Please try again.");
		}
	};
	return (
		<section className="section_login">
			<div className="container-fluid">
				<div className="row">
					<div className="col-7 content-left">
						<div className="brand" onClick={() => ReHomePage()}>
							Parking Car Systems
						</div>
						<div className="title">
							Find available parking spots in real-time, with seamless
							navigation and booking options.Optimize your parking experience
							with automated entry and secure payment options.Your parking
							journey simplified. Easy access, real-time updates, and secure
							payment solutions.
						</div>
					</div>
					<div className="col-4 content-right login-form">
						<form className="mx-auto d-flex flex-column">
							<h4 className="text-center">Login</h4>
							<div className="form-group mb-3 mt-2">
								<label for="exampleInputEmail1" className="form-label">
									Email address
								</label>
								<input
									type="email"
									className={
										objvalidinput.isValidLogin
											? "form-control"
											: "is-invalid form-control"
									}
									id="exampleInputEmail1"
									name="email"
									value={formValues.email}
									onChange={handleInputChange}
									aria-describedby="emailHelp"
									placeholder="Enter email"
								/>
							</div>
							<div className="form-group">
								<label for="exampleInputPassword1" className="form-label">
									Password
								</label>
								<input
									type="password"
									className={
										objvalidinput.isValidPass
											? "form-control"
											: "is-invalid form-control"
									}
									id="exampleInputPassword1"
									name="password"
									value={formValues.password}
									onChange={handleInputChange}
									placeholder="Password"
								/>
								<div id="emailHelp" className="form-text text-center">
									<a href="/register" className="forget_pass">
										Forget password?
									</a>
								</div>
							</div>
							<button
								type="submit"
								className="btn btn-primary mt-3"
								onClick={HandleLogin}
							>
								Login
							</button>
							<hr />
							<button
								className="btn btn-success content-center mb-3"
								onClick={() => HandleCreateAccount()}
							>
								Create New Account
							</button>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Login;
