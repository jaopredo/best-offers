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

/* TIPOS */
import { Pagination } from "types/pagination/pagination.dto"

/* GUARDS */
import { JwtAuthGuard, RolesGuard } from "src/auth/auth.guard"

/* DECORADORES */
import { Roles } from "src/decorators/roles.decorator"

/* DTO */
import { CategoryPaginationQueryDto, CategoryPostDto, CategoryUpdateDto } from "types/category/category.dto"

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
    async get(@Param('id', ParseIntPipe) id: number) {
        const foundCategory = await this.categoryService.get(id)

        if (!foundCategory) throw new NotFoundException('Categoria solicitada não encontrada')

        return foundCategory
    }

    @Get()
    async getAll(@Query() query: CategoryPaginationQueryDto) {
        const {
            categories,
            count
        } = await this.categoryService.getAll(query.limit, query.page, {
            name: query.name
        })

        return {
            data: categories,
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
    async patch(@Param('id', ParseIntPipe) id: number, @Body() category: CategoryUpdateDto) {
        const updatedCategory = await this.categoryService.update(id, category)

        if (!updatedCategory) throw new NotFoundException('A categoria passada não foi encontrada')

        return {
            message: 'Categoria atualizada com sucesso',
            statusCode: 200,
            category: updatedCategory
        }
    }

    @Delete('/:id')
    @Roles(['admin'])
    async remove(@Param('id', ParseIntPipe) id: number) {
        const category = await this.categoryService.get(id)
        if (!category) throw new NotFoundException('A categoria especificada não foi encontrada')
        await this.categoryService.pop(category.id)
        
        return {
            message: 'Categoria deletada com sucesso',
            statusCode: 200,
            category
        }
    }
}
