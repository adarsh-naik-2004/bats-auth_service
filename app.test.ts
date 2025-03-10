import app from './src/app'
import { calculateDiscount } from './src/utils'
import request from 'supertest'

describe('App', () => {
    it('should return correct amount', () => {
        const discount = calculateDiscount(100, 15)
        expect(discount).toBe(15)
    })

    it('should return successfull statusCode 200 ', async () => {
        const response = await request(app).get('/').send()

        expect(response.statusCode).toBe(200)
    })
})
