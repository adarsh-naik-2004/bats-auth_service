import fs from 'fs'
import path from 'path'
import { JwtPayload, sign } from 'jsonwebtoken'
import createHttpError from 'http-errors'
import { Config } from '../config'
import { RefreshToken } from '../entity/RefreshToken'
import { User } from '../entity/User'
import { Repository } from 'typeorm'
import { AppDataSource } from '../config/data-source'
export class TokenService {
    generateAccessToken(payload: JwtPayload) {
        let privateKey: Buffer
        try {
            privateKey = fs.readFileSync(
                path.join(__dirname, '../../keys/private.pem'),
            )
        } catch (err) {
            const error = createHttpError(
                500,
                'Error while reading private key',
            )
            throw error
        }

        const accessToken = sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '1h',
            issuer: 'auth_service',
        })
        return accessToken
    }

    generateRefreshToken(payload: JwtPayload) {
        const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
            algorithm: 'HS256',
            expiresIn: '24h',
            issuer: 'auth_service',
            jwtid: String(payload.id),
        })
        return refreshToken
    }

    async saveRefreshToken(user: User) {
        const extra = 1000 * 60 * 60 * 24
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
