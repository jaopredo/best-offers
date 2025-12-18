import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AdapterModule } from './adapter/adapter.module'
import { FontModule } from './fonts/font.module'
import { ItemModule } from './items/items.module'
import { ScrapperModule } from './scrapping/scrapper.module'
import { BullModule } from '@nestjs/bullmq'
import { JobModule } from './jobs/jobs.module'

/* MÓDULOS */
import { AuthModule } from './auth/auth.module'
import { CategoryModule } from './category/category.module'

/* MODELS */
import { User } from 'database/models/user'
import { Font } from 'database/models/font'
import { Adapter } from 'database/models/adapter'
import { Category } from 'database/models/category'
import { Item } from 'database/models/item'
import { Job } from 'database/models/job'


@Module({
    imports: [
        AuthModule,
        CategoryModule,
        AdapterModule,
        FontModule,
        ItemModule,
        ScrapperModule,
        JobModule,
        ConfigModule.forRoot({
            isGlobal: true
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                host: config.get('DB_HOST'),
                port: config.get<number>('DB_PORT'),
                username: config.get('DB_USER'),
                password: config.get('DB_PASSWORD'),
                database: config.get('DB_DB'),
                entities: [ User, Font, Adapter, Category, Item, Job ],
                synchronize: config.get('NODE_ENV') != 'production',
                logging: false,
            })
        }),
        BullModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                connection: {
                    host: config.get('REDIS_HOST'),
                    port: config.get<number>('REDIS_PORT')
                }
            })
        })
    ]
})
export class AppModule {}
