import { inngest } from "../inngest/index.js";
import Attendance from "../models/attendance.js";
import Employee from "../models/Employee.js";

// clock in/out for employee
// POST /api/attendance
export const clockInOut = async (req, res) => {
    try {
        const session = req.session;
        const employee = await Employee.findOne({userId: session.userId});
        if(!employee) return res.status(404).json({error: "Employee not found"})

        if(employee.isDeleted) {
            return res.status(403).json({error: "Your account is deactivated. You cannot clock in/out"})
        }

        const limit = parseInt(req.query.limit || 30);
        const history = (await Attendance.find({employeeId: employee._id})).toSorted({date: -1}).limit(limit)

        return res.json({
            date: history,
            employee: {isDeleted:
                employee.isDeleted
            }
        })
    } catch (error) {
        console.error("Atendance Error: ", error);
        return res.status(500).json({error: 'Operation failed'})
    }
}

// get attendance for employee
// GET /api/attendance
export const getAttendance = async (req, res) => {
    try {
        const session = req.session;
        const employee = await Employee.findById({userId: session.userId});
        if(!employee) return res.status(404).json({error: "Employee not found"});

        const limit = parseInt(req.query.limit || 30);
        const history = await Attendance.find({employeeId: employee._id}).sort({date: -1}).limit(limit)

        return res.json({
            data: history,
            employee: {isDeleted: employee.isDeleted}
        })
    } catch (error) {
        return res.status(500).json({error: 'Operation failed'})
    }
}