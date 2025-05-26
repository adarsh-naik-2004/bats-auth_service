import { Brackets, Repository } from 'typeorm'
import { User } from '../entity/User'
import { UserData, LimitedUserData, UserQueryParams } from '../types'
import createHttpError from 'http-errors'
import bcrypt from 'bcryptjs'
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
            relations: {
                store: true,
            },
        })
    }

    async findbyId(id: number) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: { store: true }, // Include related store entity
        })
        return user
    }

    async update(
        userId: number,
        { firstName, lastName, role, email, storeId }: LimitedUserData,
    ) {
        try {
            return await this.userRepository.update(userId, {
                firstName,
                lastName,
                role,
                email,
                store: storeId ? { id: storeId } : undefined,
            })
        } catch (err) {
            const error = createHttpError(
                500,
                'Failed to update the user in the database',
            )
            throw error
        }
    }

    async getAll(validatedQuery: UserQueryParams) {
        const queryBuilder = this.userRepository.createQueryBuilder('user')

        if (validatedQuery.q) {
            const searchTerm = `%${validatedQuery.q}%`
            queryBuilder.where(
                new Brackets((qb) => {
                    qb.where(
                        "CONCAT(user.firstName, ' ', user.lastName) ILike :q",
                        { q: searchTerm },
                    ).orWhere('user.email ILike :q', { q: searchTerm })
                }),
            )
        }

        if (validatedQuery.role) {
            queryBuilder.andWhere('user.role = :role', {
                role: validatedQuery.role,
            })
        }

        const result = await queryBuilder
            .leftJoinAndSelect('user.store', 'store')
            .skip((validatedQuery.currentPage - 1) * validatedQuery.perPage)
            .take(validatedQuery.perPage)
            .orderBy('user.id', 'DESC')
            .getManyAndCount()
        return result
    }

    async deletebyId(userId: number) {
        return await this.userRepository.delete(userId)
    }
}
