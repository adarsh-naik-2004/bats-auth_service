import { NextFunction, Response } from 'express'
import { RegisterUserRequest } from '../types'
import { UserService } from '../services/UserService'
import { Logger } from 'winston'
import { validationResult } from 'express-validator'
import { JwtPayload, sign } from 'jsonwebtoken'
import createHttpError from 'http-errors'
import { Config } from '../config'
import { AppDataSource } from '../config/data-source'
import { RefreshToken } from '../entity/RefreshToken'
import { TokenService } from '../services/TokenService'
export class AuthController {
    userService: UserService
    logger: Logger
    tokenService: TokenService
    constructor(
        userService: UserService,
        logger: Logger,
        tokenService: TokenService,
    ) {
        this.userService = userService
        this.logger = logger
        this.tokenService = tokenService
    }

    async register(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() })
        }

        const { firstName, lastName, email, password } = req.body

        this.logger.debug('New Request to Register a User', {
            firstName,
            lastName,
            email,
            password: '#######',
        })

        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
            })

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            }

            const accessToken = this.tokenService.generateAccessToken(payload)

            const newRefreshToken =
                await this.tokenService.saveRefreshToken(user)

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            })

            res.cookie('accessToken', accessToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60, // 1 hr
                httpOnly: true,
            })

            res.cookie('refreshToken', refreshToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24, // 1 day
                httpOnly: true,
            })

            res.status(201).json({ id: user.id })

            this.logger.info('User has been Registered', { id: user.id })
        } catch (err) {
            next(err)
            return
        }
    }
}
