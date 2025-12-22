import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';

/* GUARDS */
import { JwtAuthGuard, RolesGuard } from 'src/auth/auth.guard';

/* DECORADORES */
import { Roles } from 'src/decorators/roles.decorator';

/* DTO */
import {
    FontPaginationQueryDto,
    FontPostDto,
    FontUpdateDto,
} from 'types/font/font.dto';

/* SERVIÇOS */
import { FontService } from './fonts.service';
import { cleanPagination } from 'utils/paginationCleaner';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('/font')
export class FontController {
    constructor(private fontService: FontService) {}

    @Post()
    @Roles(['admin'])
    async create(@Body() font: FontPostDto) {
        const createdFont = await this.fontService.create(font);

        if (!createdFont)
            throw new NotFoundException(
                'O adapter informado no corpo da requisição não foi encontrado',
            );

        return {
            message: 'Fonte criada com sucesso',
            statusCode: 201,
            font: createdFont,
        };
    }

    @Get('/:id')
    async get(@Param('id', ParseIntPipe) id: number) {
        const foundFont = await this.fontService.get(id);

        if (!foundFont)
            throw new NotFoundException('Fonte especificada não encontrada');

        return {
            message: 'Fonte encontrada com sucesso',
            statusCode: 200,
            font: foundFont,
        };
    }

    @Get()
    async getAll(@Query() query: FontPaginationQueryDto) {
        const where = cleanPagination<FontPaginationQueryDto>(query);
        delete where.adapterId;
        const { fonts, count } = await this.fontService.getAll(
            query.limit,
            query.page,
            where,
        );

        return {
            data: fonts,
            meta: {
                page: query.page,
                limit: query.limit,
                total: count,
                totalPages: Math.ceil(count / query.limit),
            },
        };
    }

    @Patch('/:id')
    @Roles(['admin'])
    async patch(
        @Param('id', ParseIntPipe) id: number,
        @Body() font: FontUpdateDto,
    ) {
        const updatedFont = await this.fontService.update(id, font);

        if (!updatedFont)
            throw new NotFoundException(
                'A fonte passada ou o adapter passado no corpo não foram encontrados',
            );

        return {
            message: 'Fonte atualizada com sucesso',
            statusCode: 200,
            font: updatedFont,
        };
    }

    @Delete('/:id')
    @Roles(['admin'])
    async remove(@Param('id', ParseIntPipe) id: number) {
        const font = await this.fontService.get(id);
        if (!font)
            throw new NotFoundException(
                'A fonte especificada não foi encontrada',
            );
        await this.fontService.pop(font.id);

        return {
            message: 'Fonte deletada com sucesso',
            statusCode: 200,
            font,
        };
    }
}
