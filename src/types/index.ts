import { Request } from 'express'

export interface UserData {
    firstName: string
    lastName: string
    email: string
    password: string
    role: string
    storeId?: number
}

export interface RegisterUserRequest extends Request {
    body: UserData
}

export interface AuthRequest extends Request {
    auth: {
        sub: string
        role: string
        id?: string
    }
}

export type AuthCookie = {
    accessToken: string
    refreshToken: string
}

export interface IRefreshTokenPayload {
    id: string
}

export interface IStore {
    name: string
    address: string
}

export interface CreateStoreRequest extends Request {
    body: IStore
}

export interface CreateUserRequest extends Request {
    body: UserData
}

export interface LimitedUserData {
    firstName: string
    lastName: string
    role: string
}

export interface UpdateUserRequest extends Request {
    body: LimitedUserData
}
