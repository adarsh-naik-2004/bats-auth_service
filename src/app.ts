import express, { Request, Response, NextFunction } from 'express'
import logger from './config/logger'
import { HttpError } from 'http-errors'

const app = express()

app.get('/', (req, res) => {
    // const err = createHttpError(401, 'can not access this path')
    // // next(err) // next me kuch bhi doge wo isko error type hi lega
    // throw(err)
    res.send('yeeeeeeeeee')
})

// global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message)
    const statusCode = err.statusCode || 500

    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                msg: err.message,
                path: '',
                location: '',
            },
        ],
    })
})
// hello
export default app
