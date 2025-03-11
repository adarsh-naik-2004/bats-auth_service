import request from 'supertest'
import app from '../../src/app'
import { DataSource } from 'typeorm'
import { AppDataSource } from '../../src/config/data-source'
import { truncateTable } from '../utils'
import { User } from '../../src/entity/User'

describe('POST /auth/register', () => {
    // divide kardo happy and sad path

    let connection: DataSource

    beforeAll(async () => {
        connection = await AppDataSource.initialize()
    })

    beforeEach(async () => {
        await truncateTable(connection)
    })

    afterAll(async () => {
        await connection.destroy()
    })

    describe('Given all fields', () => {
        it('should return the 201 status code', async () => {
            // AAA method to write tests

            // ARRANGE DATA
            const userData = {
                firstName: 'Adarsh',
                lastName: 'Naik',
                email: 'adarshnaik270@gmail.com',
                password: 'password',
            }

            // ACT
            const response = await request(app as any)
                .post('/auth/register')
                .send(userData)

            // ASSERT -> EXPECTED
            expect(response.statusCode).toBe(201)
        })

        it('should return valid json response', async () => {
            // AAA method to write tests

            // ARRANGE DATA
            const userData = {
                firstName: 'Adarsh',
                lastName: 'Naik',
                email: 'adarshnaik270@gmail.com',
                password: 'password',
            }

            // ACT
            const response = await request(app as any)
                .post('/auth/register')
                .send(userData)

            // ASSERT -> EXPECTED
            expect(response.headers['content-type']).toEqual(
                expect.stringContaining('json'),
            )
        })

        it('should add user in the database', async () => {
            // AAA method to write tests

            // ARRANGE DATA
            const userData = {
                firstName: 'Adarsh',
                lastName: 'Naik',
                email: 'adarshnaik270@gmail.com',
                password: 'password',
            }

            // ACT
            await request(app as any)
                .post('/auth/register')
                .send(userData)

            // ASSERT -> EXPECTED
            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()

            expect(users).toHaveLength(1)
            expect(users[0].firstName).toBe(userData.firstName)
            expect(users[0].lastName).toBe(userData.lastName)
            expect(users[0].email).toBe(userData.email)
        })
    })
    describe('Fields are missing', () => {})
})
