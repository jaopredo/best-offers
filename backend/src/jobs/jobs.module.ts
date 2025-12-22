import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

/* CONTROLLERS */
import { JobController } from './jobs.controller';

/* SERVIÇOS */
import { JobService } from './jobs.service';

/* REPOSITÓRIOS */
import { Adapter } from 'database/models/adapter.entity';
import { Font } from 'database/models/font.entity';
import { Item } from 'database/models/item.entity';
import { Job } from 'database/models/job.entity';
import { Category } from 'database/models/category.entity';

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([Item, Font, Adapter, Job, Category]),
    ],
    controllers: [JobController],
    providers: [JobService],
    exports: [AuthModule],
})
export class JobModule {}
