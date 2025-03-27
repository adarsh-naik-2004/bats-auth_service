import { Repository } from 'typeorm'
import { IStore, StoreQueryParams } from '../types'
import { Store } from '../entity/Store'

export class StoreService {
    constructor(private readonly storeRepository: Repository<Store>) {}

    async create(storeData: IStore) {
        return await this.storeRepository.save(storeData)
    }

    async update(id: number, storeData: IStore) {
        return await this.storeRepository.update(id, storeData)
    }

    async getAll(validatedQuery: StoreQueryParams) {
        const queryBuilder = this.storeRepository.createQueryBuilder('store')

        if (validatedQuery.q) {
            const searchTerm = `%${validatedQuery.q}%`
            queryBuilder.where(
                "CONCAT(store.name, ' ', store.address) ILike :q",
                { q: searchTerm },
            )
        }

        const result = await queryBuilder
            .skip((validatedQuery.currentPage - 1) * validatedQuery.perPage)
            .take(validatedQuery.perPage)
            .orderBy('store.id', 'DESC')
            .getManyAndCount()
        return result
    }

    async getById(storeId: number) {
        return await this.storeRepository.findOne({ where: { id: storeId } })
    }

    async deleteById(storeId: number) {
        return await this.storeRepository.delete(storeId)
    }
}
