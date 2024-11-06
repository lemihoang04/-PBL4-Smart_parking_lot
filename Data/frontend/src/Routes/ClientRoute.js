import React from "react";
import Login from "../Component/Login/Login";
import Register from "../Component/Register/Register";
import Home from "../pages/Home/Home";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import Users from "../Component/Users/Users";
import Login_Admin from "../pages/Admin/Login_Admin";
import Ticket from "../pages/Ticket/Ticket";
import InfoCar from "../Component/InfoCar/InfoCar";
import Add_Ticket from "../pages/Ticket/Add_Ticket";
import PaymentCall from "../pages/Ticket/PaymentCall";
import Slot_Car from "../Component/Slot_Car/Slot_Car";
const ClientRoute = () => {
	return (
		<div>
			<Switch>
				<PrivateRoutes path="/users" component={Users} />
				<PrivateRoutes path="/ticket" exact component={Ticket} />
				<PrivateRoutes path="/info-car/id=:id_user" component={InfoCar} />
				<PrivateRoutes path="/ticket/create" component={Add_Ticket} />
				<PrivateRoutes path="/ProcessPayment" component={PaymentCall} />
				<PrivateRoutes path="/SlotCar" component={Slot_Car} />
				<Route path="/admin">
					<Login_Admin />
				</Route>
				<Route path="/login">
					<Login />
				</Route>
				<Route path="/register">
					<Register />
				</Route>
				<Route path="/users">users</Route>
				<Route path="/" exact>
					<Home />
				</Route>
				<Route path="*">404 Not Found</Route>
			</Switch>
		</div>
	);
};

export default ClientRoute;
