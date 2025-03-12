import request from 'supertest'
import app from '../../src/app'
import { DataSource } from 'typeorm'
import { AppDataSource } from '../../src/config/data-source'
import { User } from '../../src/entity/User'
import { Roles } from '../../src/constants/roles'

describe('POST /auth/register', () => {
    // divide kardo happy and sad path

    let connection: DataSource

    beforeAll(async () => {
        connection = await AppDataSource.initialize()
    })

    beforeEach(async () => {
        await connection.dropDatabase()
        await connection.synchronize()
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
        it('should return an id of the created user', async () => {
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
            expect(response.body).toHaveProperty('id')
            const repository = connection.getRepository(User)
            const users = await repository.find()
            expect((response.body as Record<string, string>).id).toBe(
                users[0].id,
            )
        })
        it('should allow only users to register', async () => {
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
            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()
            expect(users[0]).toHaveProperty('role')
            expect(users[0].role).toBe(Roles.CUSTOMER)
        })
        it('should store hased passwords in databse', async () => {
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
            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()
            expect(users[0].password).not.toBe(userData.password)
            expect(users[0].password).toHaveLength(60)
            // console.log(users[0].password)
        })
        it('should return 403 status code if email already exists', async () => {
            // AAA method to write tests

            // ARRANGE DATA
            const userData = {
                firstName: 'Adarsh',
                lastName: 'Naik',
                email: 'adarshnaik270@gmail.com',
                password: 'password',
            }

            const userRepository = connection.getRepository(User)
            await userRepository.save({ ...userData, role: Roles.CUSTOMER })

            // ACT
            const response = await request(app as any)
                .post('/auth/register')
                .send(userData)

            // ASSERT -> EXPECTED
            expect(response.statusCode).toBe(403)
            const users = await userRepository.find()
            expect(users).toHaveLength(1)
        })
    })

    describe('Fields are missing', () => {
        it('should return 400 status code', async () => {
            const userData = {
                firstName: 'Adarsh',
                lastName: 'Naik',
                email: '',
                password: 'password',
            }

            // ACT
            const response = await request(app as any)
                .post('/auth/register')
                .send(userData)

            // ASSERT -> EXPECTED
            expect(response.statusCode).toBe(400)
            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()
            expect(users).toHaveLength(0)
        })
    })
    describe('Fields are not in proper format', () => {
        it('should correct the email format', async () => {
            const userData = {
                firstName: 'Adarsh',
                lastName: 'Naik',
                email: ' adarsh@gmail.com ',
                password: 'password',
            }

            // ACT
            await request(app as any)
                .post('/auth/register')
                .send(userData)

            // ASSERT -> EXPECTED
            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()
            const user = users[0]
            expect(user.email).toBe('adarsh@gmail.com')
        })
    })
})
