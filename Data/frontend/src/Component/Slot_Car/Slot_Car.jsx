import React, { useEffect, useState } from "react";
import { GetSlotCar, UpdateSlot } from "../../services/apiService";

const Slot_Car = () => {
	const [slots, setSlots] = useState([]);
	const [slotStatus, setSlotStatus] = useState("");
	const fetchSlots = async () => {
		try {
			let slotCar = await GetSlotCar();
			setSlots(slotCar);
		} catch (error) {
			console.error("Failed to fetch slots:", error);
		}
	};
	const updateSlot = async () => {
		try {
			let rs = await UpdateSlot(slotStatus);
			if (rs && rs.errCode === 0) {
				fetchSlots();
			}
		} catch (error) {
			console.error("Failed to update slots:", error);
		}
	};
	useEffect(() => {
		fetchSlots();
		const ws = new WebSocket("ws://192.168.1.10:81");
		ws.onmessage = (event) => {
			setSlotStatus(event.data);
		};
		return () => ws.close();
	}, []);
	useEffect(() => {
		if (slotStatus) {
			updateSlot();
		}
	}, [slotStatus]);
	return (
		<>
			<div className="title text-center">
				<h2>Manage Slot Parking Car</h2>
			</div>
			<div className="users-table mt-3 mx-1">
				<table id="customers">
					<tbody>
						<tr>
							<th>Id Slot</th>
							<th>Location Slot</th>
							<th>Status Slot</th>
						</tr>
						{slots &&
							slots.length > 0 &&
							slots.map((item, index) => {
								return (
									<tr key={index}>
										<td>{index + 1}</td>
										<td>{item.location}</td>
										{item.status === "INACTIVE" ? (
											<td className="text-success">Available</td>
										) : (
											<td className="text-danger">Unavailable</td>
										)}
									</tr>
								);
							})}
					</tbody>
				</table>
			</div>
		</>
	);
};

export default Slot_Car;
