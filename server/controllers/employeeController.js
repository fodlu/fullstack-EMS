// Get employees
import Employee from "../models/Employee.js";
import bcrypt from "bcrypt";
import User from "../models/User.js";

// get /api/employees
export const getEmployees = async (req, res) => {
	try {
		const { department } = req.query;
		const where = {};

		if (department) {
			where.department = department;
		}

		const employees = await Employee.find(where)
			.sort({ createdAt: -1 })
			.populate("userId", "email role")
			.lean();
		const result = employees.map((employee) => ({
			...employee,
			id: employee._id.toString(),
			user:
				employee.userId ?
					{ email: employee.userId.email, role: employee.userId.role }
				:	null,
		}));
		return res.json(result);
	} catch (error) {
		return res.status(500).json({ error: "Failed to fetch employees" });
	}
};

// Create employee
// POST /api/employees
export const createEmployee = async (req, res) => {
	try {
		const { id } = req.params;
		const {
			firstName,
			lastName,
			email,
			password,
			phone,
			position,
			basicSalary,
			allowances,
			deductions,
			employmentStatus,
			joinDate,
			bio,
			department,
		} = req.body;

		if (!email || !password || !firstName || !lastName) {
			return res.status(404).json({ error: "Missing required fields" });
		}
		const hashed = await bcrypt.hash(password, 10);
		const user = await User.create({
			email,
			password: hashed,
			role: role || "EMPLOYEE",
		});

		const employee = await Employee.create({
			userId: user._id,
			firstName,
			lastName,
			email,
			phone,
			position,
			department: department || "Engineering",
			basicSalary: Number(basicSalary) || 0,
			allowances: Number(allowances) || 0,
			deductions: Number(deductions) || 0,
			joinDate: new Date(joinDate),
			bio: bio || "",
		});

		return res.status(201).json({ success: true, employee });
	} catch (error) {
		if (error.code === 11000) {
			return res.status(400).json({ error: "Email already exists" });
		}
		return res.status(500).json({ error: "Failed to update employee" });
	}
};

// Update employee
// PUT /api/employees/:id
export const updateEmployee = async (req, res) => {
	try {
		const { id } = req.params;
		const {
			firstName,
			lastName,
			password,
			email,
			phone,
			position,
			basicSalary,
			allowances,
			deductions,
			employementStatus,
			bio,
			department,
            role
		} = req.body;

		const employeeFind = await Employee.findById(id);

		if (!employeeFind)
			return res.status(404).json({ error: "Employee not found" });

		await Employee.findByIdAndUpdate(id, {
			firstName,
			lastName,
			email,
			phone,
			position,
			basicSalary: Number(basicSalary) || 0,
			allowances: Number(allowances) || 0,
			deductions: Number(deductions) || 0,
			employeeStatus: employmentStatus || "ACTIVE",
			joinDate: new Date(joinDate),
			bio: bio || "",
			department: department || "Engineering",
		});

        // update use record
        const userUpdate = {email};
        if(role) userUpdate.role = role;
        if(password) userUpdate.password = await bcrypt.hash(password, 10);

        await User.findByIdAndUpdate(employee.userId, userUpdate)

		return res.status(201).json({ success: true });
	} catch (error) {
		if (error.code === 11000) {
			return res.status(400).json({ error: "Email already exists" });
		}
		return res.status(500).json({ error: "Failed to update employee" });
	}
};

// Delete employee
// DELETE /api/employees/:id
export const deleteEmployee = async (req, res) => {
	try {
		const id = req.params;
		const employee = await Employee.findById(id);
		if (!employee) return res.status(404).json({ error: "Employee not found" });

		employee.isDeleted = true;
		employee.employementStatus = "INACTIVE";
		await Employee.save();
		await res.json({ success: true, message: "Employee deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: "Failed to delete employee" });
	}
};
