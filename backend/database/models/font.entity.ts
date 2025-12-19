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
}
