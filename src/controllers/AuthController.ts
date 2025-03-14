import { NextFunction, Request, Response } from 'express'
import { AuthRequest, RegisterUserRequest } from '../types'
import { UserService } from '../services/UserService'
import { Logger } from 'winston'
import { validationResult } from 'express-validator'
import { JwtPayload, sign } from 'jsonwebtoken'
import createHttpError from 'http-errors'
import { Config } from '../config'
import { AppDataSource } from '../config/data-source'
import { RefreshToken } from '../entity/RefreshToken'
import { TokenService } from '../services/TokenService'
import { PasswordService } from '../services/PasswordService'
export class AuthController {
    userService: UserService
    logger: Logger
    tokenService: TokenService
    passwordService: PasswordService
    constructor(
        userService: UserService,
        logger: Logger,
        tokenService: TokenService,
        passwordService: PasswordService,
    ) {
        this.userService = userService
        this.logger = logger
        this.tokenService = tokenService
        this.passwordService = passwordService
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
    async login(req: RegisterUserRequest, res: Response, next: NextFunction) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() })
        }

        const { email, password } = req.body

        this.logger.debug('New Request to Login', {
            email,
            password: '######',
        })

        // check if email exists
        // comapre passwords
        // generate tokens
        // add tokens to cookies
        // reponse return (id)

        try {
            const user = await this.userService.findbyEmail(email)

            if (!user) {
                const error = createHttpError(400, 'Email does not exist')
                next(error)
                return
            }

            const passwordMatched = await this.passwordService.comparePassword(
                password,
                user.password,
            )

            if (!passwordMatched) {
                const error = createHttpError(400, 'Incorrect Password')
                next(error)
                return
            }

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

            this.logger.info('User has been logged in', { id: user.id })
            res.status(200).json({ id: user.id })
        } catch (err) {
            next(err)
            return
        }
    }

    async self(req: AuthRequest, res: Response) {
        const user = await this.userService.findbyId(Number(req.auth.sub))
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.json({ ...user, password: undefined })
    }
}
