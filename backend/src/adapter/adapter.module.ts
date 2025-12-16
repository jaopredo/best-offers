import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

/* CONTROLLERS */
import { AdapterController } from './adapter.controller'

/* SERVIÇOS */
import { AdapterService } from './adapter.service'

/* REPOSITÓRIOS */
import { Adapter } from 'database/models/adapter'
import { JwtModule } from '@nestjs/jwt'

@Module({
    imports: [
        JwtModule,
        TypeOrmModule.forFeature([Adapter]),
    ],
    controllers: [AdapterController],
    providers: [AdapterService],
    exports: [JwtModule]
})
export class AdapterModule {}
