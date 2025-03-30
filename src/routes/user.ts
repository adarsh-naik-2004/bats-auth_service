import express, { NextFunction, RequestHandler, Response } from 'express'
import getaccess from '../middlewares/getaccessToken'
import { canAccess } from '../middlewares/canAccess'
import { Roles } from '../constants/roles'
import { UserController } from '../controllers/UserController'
import { UserService } from '../services/UserService'
import { AppDataSource } from '../config/data-source'
import { User } from '../entity/User'
import logger from '../config/logger'
import createUserValidator from '../validators/create_user_validator'
import { CreateUserRequest, UpdateUserRequest } from '../types'
import updateUserValidator from '../validators/update_user_validator'
import listUsersValidator from '../validators/list_users_validator'
import { Request } from 'express-jwt'

const router = express.Router()

const userRepository = AppDataSource.getRepository(User)
const userService = new UserService(userRepository)
const userController = new UserController(userService, logger)

router.post(
    '/',
    getaccess as RequestHandler,
    canAccess([Roles.ADMIN]),
    createUserValidator,
    async (
        req: CreateUserRequest,
        res: Response,
        next: NextFunction,
    ): Promise<any> => await userController.create(req, res, next),
)

router.patch(
    '/:id',
    getaccess as RequestHandler,
    canAccess([Roles.ADMIN]),
    updateUserValidator,
    async (
        req: UpdateUserRequest,
        res: Response,
        next: NextFunction,
    ): Promise<any> => {
        // console.log('Received PATCH request with body:', req.body);
        await userController.update(req, res, next)
    },
)

router.get(
    '/',
    getaccess as RequestHandler,
    canAccess([Roles.ADMIN]),
    listUsersValidator,
    async (req: Request, res: Response, next: NextFunction) =>
        await userController.getAll(req, res, next),
)

router.get(
    '/:id',
    getaccess as RequestHandler,
    canAccess([Roles.ADMIN]),
    async (req, res, next) => await userController.getOne(req, res, next),
)

router.delete(
    '/:id',
    getaccess as RequestHandler,
    canAccess([Roles.ADMIN]),
    async (req, res, next) => await userController.destroy(req, res, next),
)

export default router
