import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from 'src/auth/auth.module'

/* CONTROLLERS */
import { CategoryController } from './category.controller'

/* SERVIÇOS */
import { CategoryService } from './category.service'

/* REPOSITÓRIOS */
import { Category } from 'database/models/category.entity'
import { Item } from 'database/models/item.entity'

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([Category, Item]),
    ],
    controllers: [CategoryController],
    providers: [CategoryService],
    exports: [AuthModule]
})
export class CategoryModule {}
