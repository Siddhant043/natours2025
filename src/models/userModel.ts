import { model, Schema } from "mongoose";
import { UserConfig } from "./types.js";
import pkg from 'validator';
const { isEmail } = pkg;

const userSchema: Schema<UserConfig> = new Schema({
    name: {
        type: String,
        required: [true, "Name is a required field"]
    },
    email: {
        type: String,
        required: [true, "Email is a required field"],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please provide a valid email"]
    },
    photo: {
        type: String,
        required: [true, "Photo is a required field"]
    },
    password: {
        type: String,
        required: [true, "Password is a required field"],
        minlength: 8,
    },

    passwordConfirm: {
        type: String,
        required: [true, "Confirm Password is a required field"],
        minlength: 8,
    }
})

const User = model<UserConfig>("User", userSchema)

export default User