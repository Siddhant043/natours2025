import { NextFunction, Request, Response } from 'express'
import User from '../models/userModel.js'
import catchAsync from '../utils/catchAsync.js'
import jwt from 'jsonwebtoken'
import AppError from '../utils/appError.js'


const signToken = (id: string) => {
    const jwtSecret = process.env.JWT_SECRET || "secret-should-be-at-least-thirty-two-characters-long"

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