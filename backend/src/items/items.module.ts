import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

/* CONTROLLERS */
import { ItemController } from './items.controller'

/* SERVIÇOS */
import { ItemService } from './items.service'

/* REPOSITÓRIOS */
import { Item } from 'database/models/item'
import { Category } from 'database/models/category'
import { Font } from 'database/models/font'
import { Adapter } from 'database/models/adapter'
import { AuthModule } from 'src/auth/auth.module'

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([Item, Category, Font, Adapter]),
    ],
    controllers: [ItemController],
    providers: [ItemService],
    exports: [AuthModule]
})
export class ItemModule {}
