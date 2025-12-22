import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

/* CONTROLLERS */
import { FontController } from './font.controller';

/* SERVIÇOS */
import { FontService } from './fonts.service';

/* REPOSITÓRIOS */
import { Font } from 'database/models/font.entity';
import { Adapter } from 'database/models/adapter.entity';
import { Job } from 'database/models/job.entity';

@Module({
    imports: [AuthModule, TypeOrmModule.forFeature([Font, Adapter, Job])],
    controllers: [FontController],
    providers: [FontService],
    exports: [AuthModule],
})
export class FontModule {}
