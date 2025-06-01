import { NextFunction, Response } from 'express'
import { AuthRequest, RegisterUserRequest } from '../types'
import { UserService } from '../services/UserService'
import { Logger } from 'winston'
import { validationResult } from 'express-validator'
import { JwtPayload } from 'jsonwebtoken'
import createHttpError from 'http-errors'
import { TokenService } from '../services/TokenService'
import { PasswordService } from '../services/PasswordService'
import { Roles } from '../constants/roles'
import { Config } from '../config/index'
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
                role: Roles.CUSTOMER,
            })

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
                store: user.store ? String(user.store.id) : '',

                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            }

            const accessToken = this.tokenService.generateAccessToken(payload)

            const newRefreshToken =
                await this.tokenService.saveRefreshToken(user)

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            })

            res.cookie('accessToken', accessToken, {
                domain: Config.MAIN_DOMAIN,
                sameSite: 'none',
                secure: true,
                maxAge: 1000 * 60 * 60, // 1h
                httpOnly: true,
            })

            res.cookie('refreshToken', refreshToken, {
                domain: Config.MAIN_DOMAIN,
                sameSite: 'none',
                secure: true,
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1y
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
            const user = await this.userService.findbyEmailWithPassword(email)

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
                store: user.store ? String(user.store.id) : '',
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            }

            const accessToken = this.tokenService.generateAccessToken(payload)

            const newRefreshToken =
                await this.tokenService.saveRefreshToken(user)

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            })

            res.cookie('accessToken', accessToken, {
                domain: Config.MAIN_DOMAIN,
                sameSite: 'none',
                secure: true,
                maxAge: 1000 * 60 * 60, // 1h
                httpOnly: true,
            })

            res.cookie('refreshToken', refreshToken, {
                domain: Config.MAIN_DOMAIN,
                sameSite: 'none',
                secure: true,
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1y
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

    async refresh(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const payload: JwtPayload = {
                sub: req.auth.sub,
                role: req.auth.role,
                store: req.auth.store,
                firstName: req.auth.firstName,
                lastName: req.auth.lastName,
                email: req.auth.email,
            }

            const accessToken = this.tokenService.generateAccessToken(payload)

            const user = await this.userService.findbyId(Number(req.auth.sub))

            if (!user) {
                const error = createHttpError(400, 'User with token not found')
                next(error)
                return
            }

            // Persist the refresh token
            const newRefreshToken =
                await this.tokenService.saveRefreshToken(user)

            // Delete old refresh token
            await this.tokenService.deleteRefreshToken(Number(req.auth.id))

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            })

            res.cookie('accessToken', accessToken, {
                domain: Config.MAIN_DOMAIN,
                sameSite: 'none',
                secure: true,
                maxAge: 1000 * 60 * 60, // 1h
                httpOnly: true,
            })

            res.cookie('refreshToken', refreshToken, {
                domain: Config.MAIN_DOMAIN,
                sameSite: 'none',
                secure: true,
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1y
                httpOnly: true,
            })

            this.logger.info('User has been logged in', { id: user.id })
            res.json({ id: user.id })
        } catch (err) {
            next(err)
            return
        }
    }

    async logout(req: AuthRequest, res: Response, next: NextFunction) {
        // console.log(req.auth)
        try {
            await this.tokenService.deleteRefreshToken(Number(req.auth.id))
            this.logger.info('Refresh token has been deleted', {
                id: req.auth.id,
            })
            this.logger.info('User has been logged out', { id: req.auth.sub })

            res.clearCookie('accessToken', {
                domain: Config.MAIN_DOMAIN,
                sameSite: 'none',
                secure: true,
                httpOnly: true,
                path: '/',
            })

            res.clearCookie('refreshToken', {
                domain: Config.MAIN_DOMAIN,
                sameSite: 'none',
                secure: true,
                httpOnly: true,
                path: '/',
            })
            res.json({})
        } catch (error) {
            next(error)
            return
        }
    }
}
