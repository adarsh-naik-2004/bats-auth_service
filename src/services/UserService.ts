import { Repository } from 'typeorm'
import { User } from '../entity/User'
import { UserData } from '../types'
import createHttpError from 'http-errors'

export class UserService {
    userRepository: Repository<User>
    constructor(userRepository: Repository<User>) {
        this.userRepository = userRepository
    }

    async create({ firstName, lastName, email, password }: UserData) {
        try {
            const user = this.userRepository.create({
                firstName,
                lastName,
                email,
                password,
            })
            await this.userRepository.save(user)
            return user // Return the saved user
        } catch (err) {
            const error = createHttpError(
                500,
                'Failed to store data in the database',
            )
            throw error
        }
    }
}
