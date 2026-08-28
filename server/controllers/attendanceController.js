import { inngest } from "../inngest/index.js";
import Attendance from "../models/attendance.js";
import Employee from "../models/Employee.js";

// clock in/out for employee
// POST /api/attendance
export const clockInOut = async (req, res) => {
<<<<<<< HEAD
<<<<<<< HEAD
    try {
        const session = req.session;
        const employee = await Employee.findById({userId: session.userId});
        if(!employee) return res.status(404).json({error: "Employee not found"})
=======
=======
>>>>>>> 1c495c5f0cfe822b9f7afc3e1eefa095e58e0cdf
	try {
		const session = req.session;
		const employee = await Employee.findOne({ userId: session.userId });
		if (!employee) return res.status(404).json({ error: "Employee not found" });
<<<<<<< HEAD
>>>>>>> 2b58c15 (frontend and backend completed)
=======
>>>>>>> 1c495c5f0cfe822b9f7afc3e1eefa095e58e0cdf

		if (employee.isDeleted) {
			return res.status(403).json({
				error: "Your account is deactivated. You cannot clock in/out",
			});
		}

<<<<<<< HEAD
<<<<<<< HEAD
        const today = new Date();
        today.setHours(0, 0, 0, 0);
<<<<<<< HEAD
=======
		const today = new Date();
		today.setHours(0, 0, 0, 0);
>>>>>>> 1c495c5f0cfe822b9f7afc3e1eefa095e58e0cdf

		const existing = await Attendance.findOne({
			employeeId: employee._id,
			date: today,
		});

		const now = new Date();

		if (!existing) {
			const isLate = now.getHours() >= 9 && now.getMinutes() > 0;
			const attendance = await Attendance.create({
				employeeId: employee._id,
				date: today,
				checkIn: now,
				status: isLate ? "LATE" : "PRESENT",
			});

			await inngest.send({
				name: "employee/check-out",
				data: {
					employeeId: employee._id,
					attendanceId: attendance._id,
				},
			});

			return res.json({
				success: true,
				type: "CHECK-IN",
				data: attendance,
			});
		} else if (!existing.checkOut) {
			const checkInTime = new Date(existing.checkIn).getTime();
			const diffMs = now.getTime() - checkInTime;
			const diffHrs = diffMs / (1000 * 60 * 60);

			existing.checkOut = now;

			// compute working hour and day-type
			const workingHours = parseFloat(diffHrs.toFixed(2));
			let dayType = "Half Day";

			if (workingHours >= 8) dayType = "Full Day";
			else if (workingHours >= 6) dayType = "Three Quarter Day";
			else if (workingHours >= 6) dayType = "Three Quarter Day";
			else if (workingHours >= 4) dayType = "Half Day";
			else dayType = "Short Day";

			existing.workingHours = workingHours;
			existing.dayType = dayType;

<<<<<<< HEAD
            await existing.save();
            return res.json({success: true, type: "CHECK_OUT", data: existing})
        } else {
            return res.json({success: true, type: "CHECK_OUT", data: existing})
        }
=======
=======
		const today = new Date();
		today.setHours(0, 0, 0, 0);
>>>>>>> 2b58c15 (frontend and backend completed)

		const existing = await Attendance.findOne({
			employeeId: employee._id,
			date: today,
		});

		const now = new Date();

		if (!existing) {
			const isLate = now.getHours() >= 9 && now.getMinutes() > 0;
			const attendance = await Attendance.create({
				employeeId: employee._id,
				date: today,
				checkIn: now,
				status: isLate ? "LATE" : "PRESENT",
			});

			await inngest.send({
				name: "employee/check-out",
				data: {
					employeeId: employee._id,
					attendanceId: attendance._id,
				},
			});

			return res.json({
				success: true,
				type: "CHECK-IN",
				data: attendance,
			});
		} else if (!existing.checkOut) {
			const checkInTime = new Date(existing.checkIn).getTime();
			const diffMs = now.getTime() - checkInTime;
			const diffHrs = diffMs / (1000 * 60 * 60);

			existing.checkOut = now;

			// compute working hour and day-type
			const workingHours = parseFloat(diffHrs.toFixed(2));
			let dayType = "Half Day";

			if (workingHours >= 8) dayType = "Full Day";
			else if (workingHours >= 6) dayType = "Three Quarter Day";
			else if (workingHours >= 6) dayType = "Three Quarter Day";
			else if (workingHours >= 4) dayType = "Half Day";
			else dayType = "Short Day";

			existing.workingHours = workingHours;
			existing.dayType = dayType;

		    console.log(existing)


<<<<<<< HEAD
        return res.json({
            date: history,
            employee: {isDeleted:
                employee.isDeleted
            }
        }) */
>>>>>>> 18d2a73 (components updated)
    } catch (error) {
        console.error("Atendance Error: ", error);
        return res.status(500).json({error: 'Operation failed'})
    }
}
=======
=======
		    console.log(existing)


>>>>>>> 1c495c5f0cfe822b9f7afc3e1eefa095e58e0cdf
			await existing.save();
			return res.json({ success: true, type: "CHECK_OUT", data: existing });
		} else {
			return res.json({ success: true, type: "CHECK_OUT", data: existing, message: "Fuck you" });
		}

	} catch (error) {
		console.error("Atendance Error: ", error.message);
		return res
			.status(500)
			.json({ error: error.message || "Operations failed" });
	}
};
<<<<<<< HEAD
>>>>>>> 2b58c15 (frontend and backend completed)
=======
>>>>>>> 1c495c5f0cfe822b9f7afc3e1eefa095e58e0cdf

// get attendance for employee
// GET /api/attendance
export const getAttendance = async (req, res) => {
	try {
		const session = req.session;
		const employee = await Employee.findOne({ userId: session.userId });
		if (!employee) return res.status(404).json({ error: "Employee not found" });


		const limit = parseInt(req.query.limit || 30);
		const history = await Attendance.find({ employeeId: employee._id })
		.sort({ date: -1 })
		.limit(limit);

		return res.json({
			data: history,
			employee: { isDeleted: employee.isDeleted },
		});
	} catch (error) {
		return res.status(500).json({ error: "Operation failed" });
	}
};
