import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    NotImplementedException,
    Param,
    Patch,
    Post,
    UseGuards
} from "@nestjs/common"

/* GUARDS */
import { JwtAuthGuard, RolesGuard } from "src/auth/auth.guard"

/* DECORADORES */
import { Roles } from "src/decorators/roles.decorator"

/* DTO */
import { CategoryPostDto } from "types/category/category.dto"

/* SERVIÇOS */
import { CategoryService } from "./category.service"


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('/category')
export class CategoryController {
    constructor(
        private categoryService: CategoryService
    ) {}

    @Post()
    @Roles(['admin'])
    async create(@Body() category: CategoryPostDto) {
        const createdCategory = await this.categoryService.create(category)

        return {
            message: 'Categoria criada com sucesso',
            statusCode: 201,
            category: createdCategory
        }
    }

    @Get('/:id')
    async get(@Param('id') id: string) {
        const foundCategory = await this.categoryService.get({
            id: Number(id)
        })

        if (!foundCategory) throw new NotFoundException('Categoria solicitada não encontrada')

        return foundCategory
    }

    @Get()
    async getAll() {
        throw new NotImplementedException()
    }

    @Patch('/:id')
    @Roles(['admin'])
    async patch(@Param('id') id: string, @Body() category: CategoryPostDto) {
        throw new NotImplementedException()
    }

    @Delete('/:id')
    @Roles(['admin'])
    async remove(@Param('id') id: string) {
        throw new NotImplementedException()
    }
}
