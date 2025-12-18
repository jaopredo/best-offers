import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany
} from "typeorm"
import { Job } from "./job"


@Entity()
export class Adapter {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    searchURL: string
    
    @Column({ nullable: true })
    searchParameter: string

    @Column()
    sep: string

    @Column()
    itemURLClassName: string

    @Column()
    itemContainerClassName: string

    @Column()
    itemNameClassName: string

    @Column()
    itemPriceClassName: string

    @Column()
    itemSellerClassName: string
}
