import express from 'express'
import authRouter from './routes/auth'
import storeRouter from './routes/store'
import userRouter from './routes/user'
import 'reflect-metadata'
import cookieParser from 'cookie-parser'
import path from 'path'
import cors from 'cors'
import { Config } from './config'
import { globalErrorHandler } from './middlewares/globalErrorHandler'

const app = express()
const ALLOWED_DOMAINS = [Config.ADMIN_UI_DOMAIN]
app.use(cors({ origin: ALLOWED_DOMAINS as string[], credentials: true }))
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(cookieParser())
app.use(express.json())

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

app.use(globalErrorHandler)
// hello
export default app
