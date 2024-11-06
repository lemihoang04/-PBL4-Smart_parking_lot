import adminService from "../service/adminService";
let HandleLoginAdmin = async (req, res) => {
	let email = req.body.email;
	let pass = req.body.password;
	if (!email || !pass) {
		return res.status(500).json({
			errcode: 1,
			message: "Missing inputs parameter!",
		});
	}

	let userdata = await adminService.HandleAdminLogin(email, pass);
	if (userdata && userdata.DT && userdata.DT.access_token) {
		res.cookie("jwt", userdata.DT.access_token, {
			httpOnly: true,
			maxAge: 60 * 60 * 1000,
		});
	}
	return res.status(200).json({
		errcode: userdata.errCode,
		message: userdata.errMessage,
		user: userdata.user ? userdata.user : {},
		DT: userdata.DT,
	});
};

module.exports = {
	HandleLoginAdmin: HandleLoginAdmin,
};
