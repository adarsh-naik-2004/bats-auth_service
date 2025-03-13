import { NextFunction, Response } from 'express'
import { RegisterUserRequest } from '../types'
import { UserService } from '../services/UserService'
import { Logger } from 'winston'
import { validationResult } from 'express-validator'
import { JwtPayload, sign } from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import createHttpError from 'http-errors'
import { Config } from '../config'
import { AppDataSource } from '../config/data-source'
import { RefreshToken } from '../entity/RefreshToken'
export class AuthController {
    userService: UserService
    logger: Logger
    constructor(userService: UserService, logger: Logger) {
        this.userService = userService
        this.logger = logger
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

            let privateKey: Buffer

            try {
                privateKey = fs.readFileSync(
                    path.join(__dirname, '../../keys/private.pem'),
                )
            } catch (error) {
                const err = createHttpError(
                    500,
                    'Error reading the private key',
                )
                next(err)
                return
            }

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            }

            const accessToken = sign(payload, privateKey, {
                algorithm: 'RS256',
                expiresIn: '1h',
                issuer: 'auth_service',
            })

            const refreshTokenRepo = AppDataSource.getRepository(RefreshToken)

            const extra = 1000 * 60 * 60 * 24

            const newRefreshToken = await refreshTokenRepo.save({
                user: user,
                expiresAt: new Date(Date.now() + extra),
            })

            const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
                algorithm: 'HS256',
                expiresIn: '24h',
                issuer: 'auth_service',
                jwtid: String(newRefreshToken.id),
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
