import app from './src/app'
import { calculateDiscount } from './tests/utils'
import request from 'supertest'

describe.skip('App', () => {
    it('should return correct amount', () => {
        const discount = calculateDiscount(100, 15)
        expect(discount).toBe(15)
    })

    it('should return successfull statusCode 200 ', async () => {
        const response = await request(app as any)
            .get('/')
            .send()

        expect(response.statusCode).toBe(200)
    })
})
