import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    OneToMany
} from "typeorm"
import { Adapter } from "./adapter.entity"
import { Item } from "./item.entity"
import { Job } from "./job.entity"

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
