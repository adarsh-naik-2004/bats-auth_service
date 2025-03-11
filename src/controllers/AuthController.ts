import { NextFunction, Response } from 'express'
import { RegisterUserRequest } from '../types'
import { UserService } from '../services/UserService'
import { Logger } from 'winston'

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

            res.status(201).json({ id: user.id })

            this.logger.info('User has been Registered', { id: user.id })
        } catch (err) {
            next(err)
            return
        }
    }
}
