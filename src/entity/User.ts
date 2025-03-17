import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { Store } from './Store'

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column({ unique: true })
    email: string

    @Column({ select: false })
    password: string

    @Column()
    role: string

    @ManyToOne(() => Store)
    store: Store
}
