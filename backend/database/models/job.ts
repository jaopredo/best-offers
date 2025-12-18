import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    OneToMany,
    ManyToOne
} from "typeorm"
import { Font } from "./font"
import { Adapter } from "./adapter"
import { JobStatusEnum } from "types/job/job.dto"

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

    @ManyToOne(() => Adapter, (adapter) => adapter.jobs, {
        nullable: false
    })
    adapter: Adapter
}
