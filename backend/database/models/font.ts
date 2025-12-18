import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    OneToMany
} from "typeorm"
import { Adapter } from "./adapter"
import { Item } from "./item"
import { Job } from "./job"

@Entity()
export class Font {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    url: string

    @Column()
    name: string

    @OneToOne(() => Adapter)
    @JoinColumn()
    adapter: Adapter

    @OneToMany(() => Item, (item) => item.font)
    items: Item[]

    @OneToMany(() => Job, (job) => job.font)
    jobs: Job[]
}
