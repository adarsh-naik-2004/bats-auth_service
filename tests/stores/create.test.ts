import { DataSource } from 'typeorm'
import request from 'supertest'
import { AppDataSource } from '../../src/config/data-source'
import app from '../../src/app'
import { Store } from '../../src/entity/Store'
import createJWKSMock from 'mock-jwks'
import { Roles } from '../../src/constants/roles'

describe('POST /stores', () => {
    let connection: DataSource
    let jwks: ReturnType<typeof createJWKSMock>
    let adminToken: string

    beforeAll(async () => {
        connection = await AppDataSource.initialize()
        jwks = createJWKSMock('http://localhost:7373')
    })

    beforeEach(async () => {
        await connection.dropDatabase()
        await connection.synchronize()
        jwks.start()

        adminToken = jwks.token({
            sub: '1',
            role: Roles.ADMIN,
        })
    })

    afterAll(async () => {
        await connection.destroy()
    })

    afterEach(() => {
        jwks.stop()
    })

    describe('Given all fields', () => {
        it('should return a 201 status code', async () => {
            const storeData = {
                name: 'Store name',
                address: 'Store address',
            }
            const response = await request(app as any)
                .post('/stores')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(storeData)

            expect(response.statusCode).toBe(201)
        })

        it('should create a store in database', async () => {
            const storeData = {
                name: 'store name',
                address: 'Store address',
            }

            await request(app as any)
                .post('/stores')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(storeData)

            const storeRepository = connection.getRepository(Store)
            const stores = await storeRepository.find()
            expect(stores).toHaveLength(1)
            expect(stores[0].name).toBe(storeData.name)
            expect(stores[0].address).toBe(storeData.address)
        })

        it('should return 401 if user not authorized', async () => {
            const storeData = {
                name: 'Store name',
                address: 'Store address',
            }

            const response = await request(app as any)
                .post('/stores')
                .send(storeData)
            expect(response.statusCode).toBe(401)

            const storeRepository = connection.getRepository(Store)
            const stores = await storeRepository.find()

            expect(stores).toHaveLength(0)
        })

        it('should return 403 if user is not admin', async () => {
            const managerToken = jwks.token({
                sub: '1',
                role: Roles.MANAGER,
            })

            const storeData = {
                name: 'Store name',
                address: 'Store address',
            }

            const response = await request(app as any)
                .post('/stores')
                .set('Cookie', [`accessToken=${managerToken}`])
                .send(storeData)
            expect(response.statusCode).toBe(403)

            const storeRepository = connection.getRepository(Store)
            const stores = await storeRepository.find()

            expect(stores).toHaveLength(0)
        })
    })
})
