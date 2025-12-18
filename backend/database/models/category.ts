import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany
} from 'typeorm'
import { Item } from './item'
import { Job } from './job'


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
