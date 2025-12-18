import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from 'src/auth/auth.module'

/* CONTROLLERS */
import { JobController } from './jobs.controller'

/* SERVIÇOS */
import { JobService } from './jobs.service'

/* REPOSITÓRIOS */
import { Adapter } from 'database/models/adapter'
import { Font } from 'database/models/font'
import { Item } from 'database/models/item'
import { Job } from 'database/models/job'
import { Category } from 'database/models/category'

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([Item, Font, Adapter, Job, Category]),
    ],
    controllers: [JobController],
    providers: [JobService],
    exports: [AuthModule]
})
export class JobModule {}
