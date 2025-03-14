import { DataSource } from 'typeorm'
import bcrypt from 'bcrypt'
import request from 'supertest'
import { AppDataSource } from '../../src/config/data-source'
import app from '../../src/app'
import { isJWT } from '../utils'
import { User } from '../../src/entity/User'
import { Roles } from '../../src/constants/roles'
import createJWKSMock from 'mock-jwks'

describe('GET /auth/self', () => {
    let connection: DataSource
    let jwks: ReturnType<typeof createJWKSMock>
    let userData: User

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
        it('should return 200 status code', async () => {
            const userRepository = connection.getRepository(User)
            const userData = {
                firstName: 'Adarsh',
                lastName: 'Naik',
                email: 'adarshnaik2707@gmail.com',
                password: 'password',
                role: Roles.CUSTOMER,
            }

            const savedUser = await userRepository.save(userData)

            // Generate a token with the user's ID
            const accessToken = jwks.token({
                sub: String(savedUser.id),
                role: Roles.CUSTOMER,
            })

            // Make the request with the token
            const response = await request(app as any)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken}`])
                .send()

            expect(response.statusCode).toBe(200)
        })
        it('should return user data', async () => {
            // register user
            // generate token
            // add token to cookie

            const userData = {
                firstName: 'Adarsh',
                lastName: 'Naik',
                email: 'adarshnaik270@gmail.com',
                password: 'password',
            }

            const userRepository = connection.getRepository(User)
            const data = await userRepository.save({
                ...userData,
                role: Roles.CUSTOMER,
            })

            const accessToken = jwks.token({
                sub: String(data.id),
                role: data.role,
            })

            const response = await request(app as any)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken};`])
                .send()

            expect((response.body as Record<string, string>).id).toBe(data.id)
        })
        it('should not return the password field', async () => {
            // Register user
            const userData = {
                firstName: 'Adarsh',
                lastName: 'Naik',
                email: 'adarshnaik270@gmail.com',
                password: 'password',
            }
            const userRepository = connection.getRepository(User)
            const data = await userRepository.save({
                ...userData,
                role: Roles.CUSTOMER,
            })
            // Generate token
            const accessToken = jwks.token({
                sub: String(data.id),
                role: data.role,
            })

            // Add token to cookie
            const response = await request(app as any)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken};`])
                .send()
            // Assert
            // Check if user id matches with registered user
            expect(response.body as Record<string, string>).not.toHaveProperty(
                'password',
            )
        })
    })
})
