import bcrypt from 'bcryptjs'
export class PasswordService {
    async comparePassword(userPassword: string, passwordHash: string) {
        return await bcrypt.compare(userPassword, passwordHash)
    }
}
