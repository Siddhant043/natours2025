import { NextFunction, Request, Response } from 'express'
import User from '../models/userModel.js'
import catchAsync from '../utils/catchAsync.js'
import jwt from 'jsonwebtoken'
import AppError from '../utils/appError.js'
import { DecodedConfig } from '../types/auth.js'
// import { promisify } from 'util'

const jwtSecret = process.env.JWT_SECRET || "secret-should-be-at-least-thirty-two-characters-long"
const signToken = (id: string) => {
    const token = jwt.sign({ id }, jwtSecret, { expiresIn: "90d" })
    return token
}


export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    })

    const token = signToken(newUser._id)

    res.status(201).json({
        status: "success",
        token,
        data: {
            user: newUser
        }
    })
})

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body

    if (!email || !password) {
        return next(new AppError("Please provide email and password", 400))
    }

    const user = await User.findOne({ email }).select("+password")

    const correct = user ? await user.checkPasswords(password, user.password) : false

    if (!user || !correct) {
        return next(new AppError("Incorrect email or password", 401))
    }

    const token = signToken(user._id)

    res.status(200).json({
        status: "success",
        token
    })
})

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // 1. Checking the existence of the token in req
    let token;
    if (req.headers.authorization && req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]
    }
    if (!token) {
        return next(new AppError("You are not logged in. Please login to get access", 401))
    }

    // 2. Verification of the token
    const decoded: DecodedConfig = await new Promise((resolve, reject) => {
        jwt.verify(token, jwtSecret, (err: any, decodedToken: any) => {
            if (err) reject(err);
            else resolve(decodedToken);
        });
    });

    // 3. Check if user still exists
    const currentUser = decoded && await User.findById(decoded.id)
    if (!currentUser) {
        return next(new AppError("User does not exist", 404))
    }

    // 4. Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError("User recently updated password. Please login again.", 401))
    }

    //req.user = currentUser;
    next()
});