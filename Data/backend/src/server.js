import express from "express";
import bodyParser from "body-parser";
import initWebRouters from "./routes/web";
import connectDB from "../config/connectDB";
import cors from "cors";
import cookieParser from "cookie-parser";
require("dotenv").config();

let app = express();
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

initWebRouters(app);

connectDB();
app.use((req, res) => {
	return res.send("404 Not Found");
});

let port = process.env.PORT || 6969;
app.listen(port, () => {
	console.log("Backend Nodejs is running on the port: " + port);
});
