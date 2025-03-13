import express, { NextFunction, Request, Response } from 'express'
import { AuthController } from '../controllers/AuthController'
import { UserService } from '../services/UserService'
import { AppDataSource } from '../config/data-source'
import { User } from '../entity/User'
import logger from '../config/logger'
import { body } from 'express-validator'
import registerValidator from '../validators/register_validator'
import { TokenService } from '../services/TokenService'

const router = express.Router()

// Initialize User Repository & Service
const userRepository = AppDataSource.getRepository(User)
const userService = new UserService(userRepository)

const tokenService = new TokenService()
const authController = new AuthController(userService, logger, tokenService)

// Define Routes
router.post(
    '/register',
    registerValidator,
    async (req: Request, res: Response, next: NextFunction) => {
        await authController.register(req, res, next)
    },
)

export default router
