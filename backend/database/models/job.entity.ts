import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    OneToMany,
    ManyToOne
} from "typeorm"
import { Font } from "./font.entity"
import { JobStatusEnum } from "types/job/job.dto"
import { Category } from "./category.entity"

@Entity()
export class Job {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'enum',
        enum: JobStatusEnum,
        default: JobStatusEnum.RUNNING
    })
    status: JobStatusEnum

    @ManyToOne(() => Font, (font) => font.jobs, {
        nullable: false
    })
    font: Font

    @ManyToOne(() => Category, (category) => category.jobs, {
        nullable: false
    })
    category: Category
}
