import { DataSource } from 'typeorm'
import request from 'supertest'
import createJWKSMock from 'mock-jwks'
import { AppDataSource } from '../../src/config/data-source'
import app from '../../src/app'
import { Roles } from '../../src/constants/roles'
import { User } from '../../src/entity/User'
import { Store } from '../../src/entity/Store'
import { createStore } from '../utils'

describe('POST /users', () => {
    let connection: DataSource
    let jwks: ReturnType<typeof createJWKSMock>

    beforeAll(async () => {
        jwks = createJWKSMock('http://localhost:7373')
        connection = await AppDataSource.initialize()
    })

    beforeEach(async () => {
        jwks.start()
        await connection.dropDatabase()
        await connection.synchronize()
    })

    afterEach(() => {
        jwks.stop()
    })

    afterAll(async () => {
        await connection.destroy()
    })

    describe('Given all fields', () => {
        it('should save the user in database', async () => {
            const adminToken = jwks.token({
                sub: '1',
                role: Roles.ADMIN,
            })

            const store = await createStore(connection.getRepository(Store))

            // Register user
            const userData = {
                firstName: 'Adarsh',
                lastName: 'Naik',
                email: 'adarshnaik2707@gmail.com',
                password: 'password',
                storeId: store.id,
                role: Roles.MANAGER,
            }

            // Add token to cookie
            await request(app as any)
                .post('/users')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(userData)

            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()

            expect(users).toHaveLength(1)
            expect(users[0].email).toBe(userData.email)
        })

        it('should create a manager user', async () => {
            const adminToken = jwks.token({
                sub: '1',
                role: Roles.ADMIN,
            })

            const store = await createStore(connection.getRepository(Store))

            // Register user
            const userData = {
                firstName: 'Adarsh',
                lastName: 'Naik',
                email: 'adarshnaik2707@gmail.com',
                password: 'password',
                storeId: store.id,
                role: Roles.MANAGER,
            }

            // Add token to cookie
            await request(app as any)
                .post('/users')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(userData)

            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()

            expect(users).toHaveLength(1)
            expect(users[0].role).toBe(Roles.MANAGER)
        })
    })
})
