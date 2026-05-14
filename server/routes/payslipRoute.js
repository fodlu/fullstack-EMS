import express from 'express'
import { createPayslip, getPayslip, getPayslipById } from '../controllers/payslipsControllers.js';
import { protect, protectAdmin } from '../middleware/auth.js';

const payslipRoute = express.Router();

payslipRoute.post('/', protect, protectAdmin, createPayslip)
payslipRoute.get('/', protect, getPayslip)
payslipRoute.get('/:id', protect, getPayslipById)

export default payslipRoute;