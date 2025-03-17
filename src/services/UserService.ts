import { Repository } from 'typeorm'
import { User } from '../entity/User'
import { UserData, LimitedUserData } from '../types'
import createHttpError from 'http-errors'
import { Roles } from '../constants/roles'
import bcrypt from 'bcrypt'
export class UserService {
    userRepository: Repository<User>
    constructor(userRepository: Repository<User>) {
        this.userRepository = userRepository
    }

    async create({
        firstName,
        lastName,
        email,
        password,
        role,
        storeId,
    }: UserData) {
        // password hashing --> read about salt and rounds in more detail

        const user = await this.userRepository.findOne({
            where: { email: email },
        })

        if (user) {
            const err = createHttpError(403, 'Email already Exists')
            throw err
        }

        const rounds = 10
        const hashedPassword = await bcrypt.hash(password, rounds)

        try {
            const user = this.userRepository.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role,
                store: storeId ? { id: storeId } : undefined,
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

    async findbyEmailWithPassword(email: string) {
        return await this.userRepository.findOne({
            where: {
                email,
            },
            select: [
                'id',
                'firstName',
                'lastName',
                'email',
                'role',
                'password',
            ],
        })
    }

    async findbyId(id: number) {
        // console.log('Searching user with ID:', id)
        const user = await this.userRepository.findOneBy({ id })
        // console.log('User found:', user)
        return user
    }

    async update(
        userId: number,
        { firstName, lastName, role }: LimitedUserData,
    ) {
        try {
            return await this.userRepository.update(userId, {
                firstName,
                lastName,
                role,
            })
        } catch (err) {
            const error = createHttpError(
                500,
                'Failed to update the user in the database',
            )
            throw error
        }
    }

    async getAll() {
        return await this.userRepository.find()
    }

    async deletebyId(userId: number) {
        return await this.userRepository.delete(userId)
    }
}
