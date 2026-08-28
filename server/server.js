import express from 'express';
import cors from 'cors';
import "dotenv/config";
import multer from 'multer';
import connectDB from './config/db.js';
import authRouter from './routes/authRoute.js';
import employeeRouter from './routes/EmployeeRoute.js';
import profileRouter from './routes/profileRoutes.js';
import attendanceRouter from './routes/attendanceRoute.js';
import payslipRoute from './routes/payslipRoute.js';
import leaveRouter from './routes/leaveRouter.js';
import dashboardRouter from './routes/dashboardRoute.js';

import {serve} from 'inngest/express';
import {inngest, functions} from './inngest/index.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(multer().none);

// Routes
app.get('/', (req, res) => res.send('Server is running!'));

app.use('/api/auth', authRouter)
app.use('/api/employees', employeeRouter)
app.use('/api/profile', profileRouter)
app.use('/api/attendance', attendanceRouter)
app.use('/api/leaves', leaveRouter)
app.use('/api/payslips', payslipRoute)
app.use('/api/dashboard', dashboardRouter);
app.use('/api/inngest', serve({client: inngest, functions}));


await connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});