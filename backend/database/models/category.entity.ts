import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany
} from 'typeorm'
import { Item } from './item.entity'
import { Job } from './job.entity'


@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToMany(() => Item, (item) => item.category)
    items: Item[]

    @OneToMany(() => Job, (job) => job.font)
    jobs: Job[]
}
