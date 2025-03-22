import { AppDataSource } from '../../src/config/data-source'
import { RefreshToken } from '../../src/entity/RefreshToken'
import { TokenService } from '../../src/services/TokenService'

it('should delete refresh token with given tokenId', async () => {
    const tokenService = new TokenService()
    const mockDelete = jest.fn().mockResolvedValue({ affected: 1 })

    const mockRepo = { delete: mockDelete }
    jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(mockRepo as any)

    const result = await tokenService.deleteRefreshToken(123)

    expect(AppDataSource.getRepository).toHaveBeenCalledWith(RefreshToken)
    expect(mockDelete).toHaveBeenCalledWith({ id: 123 })
    expect(result).toEqual({ affected: 1 })
})
