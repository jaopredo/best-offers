import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from 'src/auth/auth.module'

/* CONTROLLERS */
import { FontController } from './font.controller'

/* SERVIÇOS */
import { FontService } from './fonts.service'

/* REPOSITÓRIOS */
import { Font } from 'database/models/font.entity'
import { Adapter } from 'database/models/adapter.entity'

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([Font, Adapter]),
    ],
    controllers: [FontController],
    providers: [FontService],
    exports: [AuthModule]
})
export class FontModule {}
