import express from "express";
import userController from "../controllers/userController";
import adminController from "../controllers/adminController";
import { checkUserJWT } from "../middleware/JWT_Action";
import apiController from "../controllers/apiController";
let router = express.Router();

let initWebRoutes = (app) => {
	router.all("*", checkUserJWT);
	router.post("/api/login", userController.HandleLogin);
	router.post("/api/admin_login", adminController.HandleLoginAdmin);
	router.post("/api/logout", userController.HandleLogOut);
	router.get("/api/get-all-user", userController.HandleGetAllUser);
	router.get("/api/get-all-slot", apiController.HandleGetAllSlot);
	router.get("/api/get-info-car", userController.HandleGetInfoCar);
	router.get("/api/getAllCar", apiController.HandleGetAllCar);
	router.get("/api/getAllCar_Ticket", apiController.HandleGetAllCar_Ticket);
	router.get("/api/account", userController.getUserAccount);
	router.get("/api/getTypeTicket", apiController.HandleGetTypeTicket);
	router.put("/api/edit-user", userController.HandleEditUser);
	router.post("/api/create-new-user", userController.HandleCreateNewUser);
	router.post("/api/create-new-car", apiController.HandleCreateNewCar);
	router.post("/api/create-ticket", apiController.HandleCreatePayment);
	router.post("/api/delete-ticket", apiController.HandleDeleteTicket);
	router.post("/api/createTime", apiController.HandleCreateTime);
	router.post("/api/updateSlot", apiController.UpdateSlot);
	router.delete("/api/delete-user", userController.HandleDeleteUser);
	router.post("/payment", apiController.HandlePaymentMoMo);
	router.post("/payment/ZaloPay", apiController.handlePaymentZaloPay);
	router.post("/payment/CheckZaloPay", apiController.handleCheckZaloPay);
	router.post("/callback", apiController.handleCallBackZaloPay);
	return app.use("/", router);
};

module.exports = initWebRoutes;
