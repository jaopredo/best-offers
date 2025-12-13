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

@Entity()
export class Font {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    url: string

    @Column()
    name: string

    @OneToOne(() => Adapter, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    adapter: Adapter

    @OneToMany(() => Item, (item) => item.font)
    items: Item[]
}
