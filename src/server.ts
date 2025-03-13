import { Config } from './config'
import app from './app'
import logger from './config/logger'
import { AppDataSource } from './config/data-source'

const startServer = async () => {
    const PORT = Config.PORT
    try {
        await AppDataSource.initialize()
        logger.info('Database Connected')

        app.listen(PORT, () => {
            logger.info('Server Listening on port', { port: PORT })
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            logger.error(error.message)
            setTimeout(() => {
                process.exit(1)
            }, 1000)
        }
    }
}
//hello
void startServer()
