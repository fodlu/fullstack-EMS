import {Inngest} from "inngest";
import Attendance from "../models/attendance.js";
import Employee from "../models/Employee.js";
import leaveApplication from "../models/leaveApplication.js";

// create an Inngest client to send events and recieve events
export const inngest = new Inngest({ id: 'fullstack-ems', name: 'Fullstack EMS' });

// Auto checkout for employees who forget to check out
// This function will run every day at 6pm and check for employees who have checked in but not checked out, and automatically check them out
const autoCheckout = inngest.createFunction(
    {id: 'auto-check-out', triggers: [{event: 'employee/check-out'}] },
    async ({event, step}) => {
        const {employeeId, attendanceId} = event.data;

        // wait for 9 hours after the employee checked in
        await step.sleepUntil("wait-9-hours", new Date(Date.now() + 9 * 60 * 60 * 1000));

        // get attendance record from the database
        let attendance = await Attendance.findById(attendanceId);

        if(!attendance?.checkOut) {
            // get employee data
            const employee = await Employee.findById(employeeId);

            // send reminder email

            // After 10 hours, mark attendance as checked out with status "LATE"
            await step.sleepUntil("wait-for-1-hours", new Date(Date.now() + 1 * 60 * 60 * 1000));

            attendance = await Attendance.findById(attendanceId);

            if(!attendance?.checkOut) {
                attendance.checkOut = new Date(attendance.checkIn).getTime() + 4 * 60 * 60 * 1000;
                attendance.workingHours = 4;
                attendance.dayType = "Half Day";
                attendance.status = "LATE";
                await attendance.save();
            }
        }
    }
);

// send email to admin, if admin doesn't take action on leave application within 24 hours
const leaveApplicationReminder = inngest.createFunction(
    {id: 'leave-application-reminder', triggers: [{event: 'leave/pending'}] },
    async ({event, step}) => {
        const {leaveApplicationId } = event.data;

        // wait for 24 hours
        await step.sleepUntil("wait-24-hours", new Date(new Date().getTime() + 24 * 60 * 60 * 1000));

        const leaveApplication = await leaveApplication.findById(leaveApplicationId);
        if(leaveApplication?.status === "PENDING") {
            const employee = await Employee.findById(leaveApplication.employeeId);
        }

        // send reminder email to admin to take action on leave application

    }
);

// Cron: Check attendance at 11:30 AM and email absent employees
const attendanceReminderCron = inngest.createFunction(
    {id: 'attendance-reminder-cron', triggers: [{cron: '0 0 6 * * *' }] }, // every day at 6:00 AM which is 2:00 PM Nigerian time
    async ({event, step}) => {
        // step1: Get today's date range
        const today = await step.run("get-todays-date-range", () => {
            const startUTC = new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Lagos" }) +"T00:00:00 +05:30");
            const endUTC = new Date(startUTC.getTime() + 24 * 60 * 60 * 1000);
            return { startUTC : startUTC.toISOString(), endUTC: endUTC.toISOString() };
        })

        // step 2: Get all active, non-deleted employees
        const activeEmployees = await step.run("get-active-employees", async () => {
            const employees = await Employee.find({ employmentStatus: true, isDeleted: false }).lean();
            return employees.map((e) => ({ _id: e._id.toString(), firstName: e.firstName, lastName: e.lastName, email: e.email, department: e.department }));
        });

        // step 3: Get employees ID on approved leave for today
        const onLeaveIds = await step.run("get-on-leave-id", async() => {
            const leaves = await leaveApplication.find({ status: "APPROVED", startDate: { $lte: today.endUTC }, endDate: { $gte: today.startUTC } }).lean();
            return leaves.map((l) => l.employeeId.toString());
        })

        // step 4: Get employees id who have checked in today
        const checkeInIds = await step.run("get-checked-in-id", async() => {
            const attendances = await Attendance.find({ date: { $gte: new Date(today.startUTC), $lte: new Date(today.endUTC) } }).lean();
            return attendances.map((a) => a.employeeId.toString());
        })

        // step 5: Get absent employees by filtering out active employees who are not on leave and have not checked in
        const absentEmployees = activeEmployees.filter((e) => !onLeaveIds.includes(e._id) && !checkeInIds.includes(e._id));

        // step 6: Send email to absent employees
        if(absentEmployees.length > 0) {
            await step.run("send-reminder-email", async() => {
                const emailPromises = absentEmployees.map((emp) => {
                    // send email to emp.email
                })
            })
        }

        return {totalActive: activeEmployees.length, onLeave: onLeaveIds.length, checkedIn: checkeInIds.length, absent: absentEmployees.length};
    }
);

// create an empty array where we will export future inngest functions
export const functions = [autoCheckout, leaveApplicationReminder, attendanceReminderCron];
