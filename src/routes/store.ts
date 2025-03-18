import express, { NextFunction, Response } from 'express'
import { StoreController } from '../controllers/StoreController'
import { StoreService } from '../services/StoreService'
import { AppDataSource } from '../config/data-source'
import logger from '../config/logger'
import getaccess from '../middlewares/getaccessToken'
import { canAccess } from '../middlewares/canAccess'
import { Roles } from '../constants/roles'
import storeValidator from '../validators/store_validator'
import { CreateStoreRequest } from '../types'
import { Store } from '../entity/Store'
import list_users_validator from '../validators/list_users_validator'
import { Request } from 'express-jwt'

const router = express.Router()

const storeRepository = AppDataSource.getRepository(Store)
const storeService = new StoreService(storeRepository)
const storeController = new StoreController(storeService, logger)

router.post(
    '/',
    getaccess,
    canAccess([Roles.ADMIN]),
    storeValidator,
    async (
        req: CreateStoreRequest,
        res: Response,
        next: NextFunction,
    ): Promise<any> => await storeController.create(req, res, next),
)

router.patch(
    '/:id',
    getaccess,
    canAccess([Roles.ADMIN]),
    storeValidator,
    async (
        req: CreateStoreRequest,
        res: Response,
        next: NextFunction,
    ): Promise<any> => await storeController.update(req, res, next),
)

router.get(
    '/',
    list_users_validator,
    async (req: Request, res: Response, next: NextFunction) =>
        await storeController.getAll(req, res, next),
)

router.get(
    '/:id',
    getaccess,
    canAccess([Roles.ADMIN]),
    async (req, res, next) => await storeController.getOne(req, res, next),
)

router.delete(
    '/:id',
    getaccess,
    canAccess([Roles.ADMIN]),
    async (req, res, next) => await storeController.destroy(req, res, next),
)

export default router
