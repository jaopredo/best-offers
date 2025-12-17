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
    UseGuards
} from "@nestjs/common"

/* GUARDS */
import { JwtAuthGuard, RolesGuard } from "src/auth/auth.guard"

/* DECORADORES */
import { Roles } from "src/decorators/roles.decorator"

/* DTO */
import { FontPostDto, FontUpdateDto } from "types/font/font.dto"

/* SERVIÇOS */
import { FontService } from "./fonts.service"


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('/font')
export class FontController {
    constructor(
        private fontService: FontService
    ) {}

    @Post()
    @Roles(['admin'])
    async create(@Body() font: FontPostDto) {
        const createdFont = await this.fontService.create(font)

        if (!createdFont) throw new NotFoundException('O adapter informado no corpo da requisição não foi encontrado')

        return {
            message: 'Categoria criada com sucesso',
            statusCode: 201,
            font: createdFont
        }
    }

    @Get('/:id')
    async get(@Param('id', ParseIntPipe) id: number) {
        throw new NotImplementedException()
    }

    @Get()
    async getAll() {
        throw new NotImplementedException()
    }

    @Patch('/:id')
    @Roles(['admin'])
    async patch(@Param('id', ParseIntPipe) id: number, @Body() font: FontUpdateDto) {
        throw new NotImplementedException()
    }

    @Delete('/:id')
    @Roles(['admin'])
    async remove(@Param('id', ParseIntPipe) id: number) {
        throw new NotImplementedException()
    }
}
