import express from 'express';
import { createEmployee, deleteEmployee, getEmployees, updateEmployee } from '../controllers/employeeController.js';
import { changePassword, login, session } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const authRouter = express.Router();

authRouter.post('/login', login)
authRouter.get('/session', protect, session)
authRouter.post('/change-password', protect, changePassword)

export default authRouter