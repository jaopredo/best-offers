import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne
} from 'typeorm'
import { Category } from './category'
import { Font } from './font'


@Entity()
export class Item {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'text' })
    name: string

    @Column({ type: 'decimal', transformer: {
        to: (value: number) => value,
        from: (value: string) => parseFloat(value)
    } })
    price: number

    @Column({ type: 'text' })
    url: string

    @Column({ type: 'varchar', nullable: true })
    seller: string|null

    @ManyToOne(() => Category, (category) => category.items, {
        nullable: false
    })
    category: Category

    @ManyToOne(() => Font, (font) => font.items, {
        nullable: false,
        onDelete: 'CASCADE'
    })
    font: Font
}
