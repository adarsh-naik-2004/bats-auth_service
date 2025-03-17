import { DataSource, Repository } from 'typeorm'
import { Store } from './entity/Store'

export const calculateDiscount = (price: number, percentage: number) => {
    return price * (percentage / 100)
}

export const truncateTable = async (connection: DataSource) => {
    const entities = connection.entityMetadatas

    for (const entity of entities) {
        const repository = connection.getRepository(entity.name)

        await repository.clear()
    }
}

export const isJWT = (token: string | null): boolean => {
    if (token === null) {
        return false
    }

    const parts = token.split('.')

    if (parts.length !== 3) {
        return false
    }

    try {
        parts.forEach((part) => {
            Buffer.from(part, 'base64').toString('utf-8')
        })
        return true
    } catch (error) {
        return false
    }
}

export const createStore = async (repository: Repository<Store>) => {
    const store = await repository.save({
        name: 'Test store',
        address: 'Test address',
    })
    return store
}
