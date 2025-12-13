import {
    Entity,
    PrimaryGeneratedColumn,
    Column
} from "typeorm"


@Entity()
export class Adapter {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    searchFormClassName: string

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
