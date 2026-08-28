import express from 'express';
import { protect, protectAdmin } from '../middleware/auth.js';
import { createLeave, getLeave, updateLeaveStatus } from '../controllers/leaveController.js';
import multer from 'multer';

const leaveRouter = express.Router();
const upload = multer()

leaveRouter.post('/', protect, upload.none(), createLeave)
leaveRouter.get('/', protect, getLeave)
leaveRouter.patch('/:id', protect, protectAdmin, updateLeaveStatus)

export default leaveRouter;