import express, { NextFunction, Request, Response } from 'express'
import { AuthController } from '../controllers/AuthController'
import { UserService } from '../services/UserService'
import { AppDataSource } from '../config/data-source'
import { User } from '../entity/User'
import logger from '../config/logger'
import { body } from 'express-validator'
import registerValidator from '../validators/register_validator'
import { TokenService } from '../services/TokenService'
import loginValidator from '../validators/login_validator'
import { PasswordService } from '../services/PasswordService'
import getacess from '../middlewares/getaccess'
import { AuthRequest } from '../types'

const router = express.Router()

// Initialize User Repository & Service
const userRepository = AppDataSource.getRepository(User)
const userService = new UserService(userRepository)

const tokenService = new TokenService()
const passwordService = new PasswordService()
const authController = new AuthController(
    userService,
    logger,
    tokenService,
    passwordService,
)

// Define Routes
router.post(
    '/register',
    registerValidator,
    async (req: Request, res: Response, next: NextFunction) => {
        await authController.register(req, res, next)
    },
)
router.post(
    '/login',
    loginValidator,
    async (req: Request, res: Response, next: NextFunction) => {
        await authController.login(req, res, next)
    },
)
router.get('/self', getacess, async (req: Request, res: Response) => {
    await authController.self(req as AuthRequest, res)
})

export default router
