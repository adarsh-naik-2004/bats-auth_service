import { Config } from './config'
import app from './app'

const startServer = () => {
    const PORT = Config.PORT
    try {
        app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

startServer()
