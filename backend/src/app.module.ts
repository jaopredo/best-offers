import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AdapterModule } from './adapter/adapter.module'
import { FontModule } from './fonts/font.module'
import { ItemModule } from './items/items.module'

/* MÓDULOS */
import { AuthModule } from './auth/auth.module'
import { CategoryModule } from './category/category.module'

/* MODELS */
// import { User } from 'database/models/user.entity'
// import { Font } from 'database/models/font.entity'
// import { Adapter } from 'database/models/adapter.entity'
// import { Category } from 'database/models/category.entity'
// import { Item } from 'database/models/item.entity'


@Module({
    imports: [
        AuthModule,
        CategoryModule,
        AdapterModule,
        FontModule,
        ItemModule,
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
                autoLoadEntities: true,
                // synchronize: config.get('NODE_ENV') != 'production',
                synchronize: true,
                logging: false,
            })
        })
    ]
})
export class AppModule {}
