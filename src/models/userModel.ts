import { model, Schema } from "mongoose";
import { UserConfig } from "./types.js";
import pkg from 'validator';
import bcrypt from "bcryptjs";


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
    },
    password: {
        type: String,
        required: [true, "Password is a required field"],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, "Confirm Password is a required field"],
        minlength: 8,
        validate: {
            validator: function (el) {
                return el === this.password
            },
            message: "Passwords are not the same"
        }
    },
    passwordChangedAt: Date
});

userSchema.pre<UserConfig>('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        // Hash the password
        this.password = await bcrypt.hash(this.password, 12);

        // Set passwordConfirm to undefined
        this.passwordConfirm = undefined;

        next();
    } catch (err) {
        next(err as Error); // Pass the error to the next middleware
    }
})

userSchema.methods.checkPasswords = async function (candidatePassword: string, actualPassword: string) {
    return await bcrypt.compare(candidatePassword, actualPassword)
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
    if (this.passwordChangedAt) {
        const changeTimeInMili = parseInt(this.passwordChangedAt.getTime()) / 1000  // converting time to mili seconds
        return changeTimeInMili > JWTTimestamp
    }
    return false
}

const User = model<UserConfig>("User", userSchema)

export default User