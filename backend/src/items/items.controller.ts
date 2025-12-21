import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    NotImplementedException,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards
} from "@nestjs/common"

/* GUARDS */
import { JwtAuthGuard, RolesGuard } from "src/auth/auth.guard"

/* DECORADORES */
import { Roles } from "src/decorators/roles.decorator"

/* DTO */
import { ItemPaginationQueryDto, ItemPostDto, ItemUpdateDto } from "types/item/item.dto"

/* SERVIÇOS */
import { ItemService } from "./items.service"
import { cleanPagination } from "utils/paginationCleaner"


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('/item')
export class ItemController {
    constructor(
        private itemService: ItemService,
    ) {}

    @Post()
    @Roles(['admin'])
    async create(@Body() item: ItemPostDto) {
        const createdItem = await this.itemService.create(item)

        if (!createdItem) throw new NotFoundException('A fonte ou a categoria informados no corpo da requisição não foram encontrados')

        return {
            message: 'Item criado com sucesso',
            statusCode: 201,
            item: createdItem
        }
    }

    @Get('/:id')
    async get(@Param('id', ParseIntPipe) id: number) {
        const foundItem = await this.itemService.get(id)

        if (!foundItem) throw new NotFoundException('Item especificado não encontrado')
        
        return {
            message: 'Item encontrado com sucesso',
            statusCode: 200,
            item: foundItem
        }
    }

    @Get()
    async getAll(@Query() query: ItemPaginationQueryDto) {
        const where = cleanPagination<ItemPaginationQueryDto>(query)
        delete where.fontId
        delete where.categoryId

        const {
            items,
            count
        } = await this.itemService.getAll(query.limit, query.page, where)

        return {
            data: items,
            meta: {
                page: query.page,
                limit: query.limit,
                total: count,
                totalPages: Math.ceil(count / query.limit)
            }
        }
    }

    @Patch('/:id')
    @Roles(['admin'])
    async patch(@Param('id', ParseIntPipe) id: number, @Body() item: ItemUpdateDto) {
        const updatedItem = await this.itemService.update(id, item)

        if (!updatedItem) throw new NotFoundException('Ou o item, ou a fonte, ou a categoria especificados não foram encontrados')

        return {
            message: 'Item atualizado com sucesso',
            statusCode: 200,
            item: updatedItem
        }
    }

    @Delete('/:id')
    @Roles(['admin'])
    async remove(@Param('id', ParseIntPipe) id: number) {
        const item = await this.itemService.get(id)
        if (!item) throw new NotFoundException('O item especificado não foi encontrado')
        await this.itemService.pop(item.id)
        
        return {
            message: 'Item deletado com sucesso',
            statusCode: 200,
            item
        }
    }
}
