import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';

/* CONTROLLERS */
import { ScrapperController } from './scrapper.controller'

/* SERVIÇOS */
import { ScrapperService } from './scrapper.service'
import { AdapterService } from 'src/adapter/adapter.service'
import { FontService } from 'src/fonts/fonts.service'
import { ScrapperLogic } from './scrapper.logic'

/* PROCESSADOR */
import { ScrapperProcessor } from './scrapper.consumer'

/* REPOSITÓRIOS */
import { Font } from 'database/models/font'
import { Adapter } from 'database/models/adapter'
import { Category } from 'database/models/category'
import { Item } from 'database/models/item'
import { BullModule } from '@nestjs/bullmq'
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([Font, Adapter, Category, Item]),
        BullModule.registerQueue({
            name: 'scrapping',
        })
    ],
    controllers: [ScrapperController],
    providers: [ScrapperService, ScrapperProcessor, AdapterService, FontService, ScrapperLogic],
    exports: [AuthModule]
})
export class ScrapperModule {}
