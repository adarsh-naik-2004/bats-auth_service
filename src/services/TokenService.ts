import { JwtPayload, sign } from 'jsonwebtoken'
import createHttpError from 'http-errors'
import { Config } from '../config/index'
import { RefreshToken } from '../entity/RefreshToken'
import { User } from '../entity/User'
import { AppDataSource } from '../config/data-source'
export class TokenService {
    generateAccessToken(payload: JwtPayload) {
        if (!Config.PRIVATE_KEY) {
            throw createHttpError(500, 'Error while reading private key')
        }
        const accessToken = sign(payload, Config.PRIVATE_KEY, {
            algorithm: 'RS256',
            expiresIn: '1d',
            issuer: 'auth_service',
        })
        return accessToken
    }

    generateRefreshToken(payload: JwtPayload) {
        const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
            algorithm: 'HS256',
            expiresIn: '1y',
            issuer: 'auth_service',
            jwtid: String(payload.id),
        })
        return refreshToken
    }

    async saveRefreshToken(user: User) {
        const extra = 1000 * 60 * 60 * 24 * 365
        const refreshTokenRepo = AppDataSource.getRepository(RefreshToken)
        const newRefreshToken = await refreshTokenRepo.save({
            user: user,
            expiresAt: new Date(Date.now() + extra),
        })
        return newRefreshToken
    }

    async deleteRefreshToken(tokenId: number) {
        const refreshTokenRepo = AppDataSource.getRepository(RefreshToken)
        return await refreshTokenRepo.delete({ id: tokenId })
    }
}
