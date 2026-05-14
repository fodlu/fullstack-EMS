import 'dotenv/config';
import connectDB from './config/db.js';
import User from './models/User.js';
import bcrypt from 'bcrypt'

const temporaryPassword = 'admin123';

async function registerAdmin() {
    try {
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

        if(!ADMIN_EMAIL) {
            console.error("Missing ADMIN_EMAIL env variable");
            process.exit(1)
        }

        await connectDB();

        const exisitingAdmin = await User.findOne({email: process.env.ADMIN_EMAIL});

        if(exisitingAdmin){
            console.log("User already as role", exisitingAdmin.role);
            process.exit(0)
        }

        const hashedPassword = await bcrypt.hash(temporaryPassword, 10)

        const admin =await User.create({
            email: process.env.ADMIN_EMAIL,
            password: hashedPassword,
            role: 'ADMIN'
        })

        console.log("Admin user created");
        console.log("\nEmail:", admin.email);
        console.log("password: ", temporaryPassword);
        console.log("\nChange the password after login");

        process.exit(0);
    } catch (error) {
        console.log("Seed fail: ", error)
    }
}

registerAdmin()