import { NextFunction, Request, Response } from 'express'
import User from '../models/userModel.js'
import catchAsync from '../utils/catchAsync.js'
import jwt from 'jsonwebtoken'


export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    })
    const jwtSecret = process.env.JWT_SECRET || "secret-should-be-at-least-thirty-two-characters-long"

    const token = jwt.sign({ id: newUser._id }, jwtSecret, { expiresIn: "90d" })


    res.status(201).json({
        status: "success",
        token,
        data: {
            user: newUser
        }
    })
})