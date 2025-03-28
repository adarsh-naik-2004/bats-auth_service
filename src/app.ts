import express, { Request, Response, NextFunction } from 'express'
import logger from './config/logger'
import { HttpError } from 'http-errors'
import authRouter from './routes/auth'
import storeRouter from './routes/store'
import userRouter from './routes/user'
import 'reflect-metadata'
import cookieParser from 'cookie-parser'
import path from 'path'
import cors from 'cors'
import { Config } from './config'

const app = express()
const ALLOWED_DOMAINS = [Config.ADMIN_UI_DOMAIN]
app.use(cors({ origin: ALLOWED_DOMAINS as string[], credentials: true }))
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(cookieParser())
app.use(express.json())

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled Error:', err) // Log the full error object
    logger.error(err.message || 'Unknown error')
    res.status(err.statusCode || 500).json({
        error: err.message || 'Unknown error',
    })
})

app.get('/', (req, res) => {
    // const err = createHttpError(401, 'can not access this path')
    // // next(err) // next me kuch bhi doge wo isko error type hi lega
    // throw(err)
    res.send('yeeeeee')
})

app.use('/auth', authRouter)
app.use('/stores', storeRouter)
app.use('/users', userRouter)
// global error handler

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    // console.log(err)
    logger.error(err.message)
    const statusCode = err.statusCode || err.status || 500

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
