import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['ADMIN', 'EMPLOYEE'],
        default: 'EMPLOYEE',
    },
    password: {
        type: String,
        required: true,
    },
}, {timestamps: true});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;