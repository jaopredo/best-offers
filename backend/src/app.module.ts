import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'

/* MODELS */
import { User } from 'database/models/user'
import { Font } from 'database/models/font'
import { Adapter } from 'database/models/adapter'
import { Category } from 'database/models/category'
import { Item } from 'database/models/item'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'database',
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DB,
      entities: [ User, Font, Adapter, Category, Item ],
      synchronize: true,
      logging: false
  })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
