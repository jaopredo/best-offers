import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

/* CONTROLLERS */
import { ItemController } from './items.controller';

/* SERVIÇOS */
import { ItemService } from './items.service';

/* REPOSITÓRIOS */
import { Item } from 'database/models/item.entity';
import { Category } from 'database/models/category.entity';
import { Font } from 'database/models/font.entity';
import { Adapter } from 'database/models/adapter.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([Item, Category, Font, Adapter]),
    ],
    controllers: [ItemController],
    providers: [ItemService],
    exports: [AuthModule],
})
export class ItemModule {}
