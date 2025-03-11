import request from 'supertest'
import app from '../../src/app'

describe('POST /auth/register', () => {
    // divide kardo happy and sad path

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
            const response = await request(app)
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
            const response = await request(app)
                .post('/auth/register')
                .send(userData)

            // ASSERT -> EXPECTED
            expect(response.headers['content-type']).toEqual(
                expect.stringContaining('json'),
            )
        })
    })
    describe('Fields are missing', () => {})
})
