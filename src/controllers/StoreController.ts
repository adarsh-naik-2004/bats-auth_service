import { NextFunction, Request, Response } from 'express'
import { StoreService } from '../services/StoreService'
import { CreateStoreRequest } from '../types'
import { Logger } from 'winston'
import createHttpError from 'http-errors'
import { validationResult } from 'express-validator'

export class StoreController {
    constructor(
        private readonly storeService: StoreService,
        private readonly logger: Logger,
    ) {}

    async create(req: CreateStoreRequest, res: Response, next: NextFunction) {
        // Validation
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() })
        }

        const { name, address } = req.body
        this.logger.debug('Request for creating a store', req.body)

        try {
            const store = await this.storeService.create({ name, address })
            this.logger.info('Store has been created', { id: store.id })

            res.status(201).json({ id: store.id })
        } catch (error) {
            next(error)
        }
    }

    async update(req: CreateStoreRequest, res: Response, next: NextFunction) {
        // Validation
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() })
        }

        const { name, address } = req.body
        const storeId = req.params.id

        if (isNaN(Number(storeId))) {
            next(createHttpError(400, 'Invalid url param.'))
            return
        }

        this.logger.debug('Request for updating a store', req.body)

        try {
            await this.storeService.update(Number(storeId), {
                name,
                address,
            })

            this.logger.info('Store has been updated', { id: storeId })

            res.json({ id: Number(storeId) })
        } catch (error) {
            next(error)
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const stores = await this.storeService.getAll()

            this.logger.info('All store have been fetched')
            res.json(stores)
        } catch (error) {
            next(error)
        }
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const storeId = req.params.id

        if (isNaN(Number(storeId))) {
            next(createHttpError(400, 'Invalid url param.'))
            return
        }

        try {
            const store = await this.storeService.getById(Number(storeId))

            if (!store) {
                next(createHttpError(400, 'Store does not exist.'))
                return
            }

            this.logger.info('Store has been fetched')
            res.json(store)
        } catch (error) {
            next(error)
        }
    }

    async destroy(req: Request, res: Response, next: NextFunction) {
        const storeId = req.params.id

        if (isNaN(Number(storeId))) {
            next(createHttpError(400, 'Invalid url param.'))
            return
        }

        try {
            await this.storeService.deleteById(Number(storeId))

            this.logger.info('Store has been deleted', {
                id: Number(storeId),
            })
            res.json({ id: Number(storeId) })
        } catch (error) {
            next(error)
        }
    }
}
