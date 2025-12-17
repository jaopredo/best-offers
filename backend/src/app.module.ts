import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AdapterModule } from './adapter/adapter.module'
import { FontModule } from './fonts/font.module'

/* MÓDULOS */
import { AuthModule } from './auth/auth.module'
import { CategoryModule } from './category/category.module'

/* MODELS */
import { User } from 'database/models/user'
import { Font } from 'database/models/font'
import { Adapter } from 'database/models/adapter'
import { Category } from 'database/models/category'
import { Item } from 'database/models/item'


@Module({
    imports: [
        AuthModule,
        CategoryModule,
        AdapterModule,
        FontModule,
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
                entities: [ User, Font, Adapter, Category, Item ],
                synchronize: config.get('NODE_ENV') != 'production',
                logging: false,
            })
        })
    ]
})
export class AppModule {}
