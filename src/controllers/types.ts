import { Request } from 'express'
import { UserConfig } from '../models/types.js'


export interface CustomRequest extends Request {
    user: UserConfig;
}