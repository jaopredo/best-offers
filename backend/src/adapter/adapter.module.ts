import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from 'src/auth/auth.module'

/* CONTROLLERS */
import { AdapterController } from './adapter.controller'

/* SERVIÇOS */
import { AdapterService } from './adapter.service'

/* REPOSITÓRIOS */
import { Adapter } from 'database/models/adapter'

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([Adapter]),
    ],
    controllers: [AdapterController],
    providers: [AdapterService],
    exports: [AuthModule]
})
export class AdapterModule {}
