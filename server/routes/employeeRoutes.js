import express from 'express';
import { createEmployee, deleteEmployee, getEmployees, updateEmployee } from '../controllers/employeeController.js';
import { protect, protectAdmin } from '../middleware/auth.js';
import multer from 'multer';

const employeeRouter = express.Router();
const upload = multer()

employeeRouter.get('/', protect, protectAdmin, getEmployees)
employeeRouter.post('/', protect, protectAdmin, upload.none(), createEmployee)
employeeRouter.put('/:id', protect, protectAdmin, upload.none(), updateEmployee)
employeeRouter.delete('/:id', protect, protectAdmin,  deleteEmployee)

export default employeeRouter