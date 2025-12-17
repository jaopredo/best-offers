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
import { ItemPostDto, ItemUpdateDto } from "types/item/item.dto"

/* SERVIÇOS */
import { ItemService } from "./items.service"
import { FontService } from "src/fonts/fonts.service"
import { CategoryService } from "src/category/category.service"


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('/item')
export class ItemController {
    constructor(
        private itemService: ItemService,
        private fontService: FontService,
        private categoryService: CategoryService
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
        throw new NotImplementedException()
    }

    @Get()
    async getAll(@Query() query: ItemUpdateDto) {
        throw new NotImplementedException()
    }

    @Patch('/:id')
    @Roles(['admin'])
    async patch(@Param('id', ParseIntPipe) id: number, @Body() item: ItemUpdateDto) {
        throw new NotImplementedException()
    }

    @Delete('/:id')
    @Roles(['admin'])
    async remove(@Param('id', ParseIntPipe) id: number) {
        throw new NotImplementedException()
    }
}
