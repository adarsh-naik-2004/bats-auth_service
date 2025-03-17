import { Repository } from 'typeorm'
import { IStore } from '../types'
import { Store } from '../entity/Store'

export class StoreService {
    constructor(private storeRepository: Repository<Store>) {}

    async create(storeData: IStore) {
        return await this.storeRepository.save(storeData)
    }

    async update(id: number, storeData: IStore) {
        return await this.storeRepository.update(id, storeData)
    }

    async getAll() {
        return await this.storeRepository.find()
    }

    async getById(storeId: number) {
        return await this.storeRepository.findOne({ where: { id: storeId } })
    }

    async deleteById(storeId: number) {
        return await this.storeRepository.delete(storeId)
    }
}
