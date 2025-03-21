import express, { NextFunction, Request, Response } from 'express'
import { AuthController } from '../controllers/AuthController'
import { UserService } from '../services/UserService'
import { AppDataSource } from '../config/data-source'
import { User } from '../entity/User'
import logger from '../config/logger'
import registerValidator from '../validators/register_validator'
import { TokenService } from '../services/TokenService'
import loginValidator from '../validators/login_validator'
import { PasswordService } from '../services/PasswordService'
import getaccess from '../middlewares/getaccessToken'
import { AuthRequest } from '../types'
import checkRefreshToken from '../middlewares/checkRefreshToken'
import parseRefreshToken from '../middlewares/parseRefreshToken'

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
router.get('/self', getaccess, async (req: Request, res: Response) => {
    await authController.self(req as AuthRequest, res)
})
router.post(
    '/refresh',
    checkRefreshToken,
    async (req: Request, res: Response, next: NextFunction) => {
        await authController.refresh(req as AuthRequest, res, next)
    },
)

router.post(
    '/logout',
    getaccess,
    parseRefreshToken,
    (req: Request, res: Response, next: NextFunction) =>
        authController.logout(req as AuthRequest, res, next),
)

export default router
