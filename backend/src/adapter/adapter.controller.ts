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
import { AdapterDto, AdapterPaginationQueryDto, AdapterUpdateDto } from "types/adapter/adapter.dto"

/* SERVIÇOS */
import { AdapterService } from "./adapter.service"
import { cleanPagination } from "utils/paginationCleaner"


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('/adapter')
export class AdapterController {
    constructor(
        private adapterService: AdapterService
    ) {}

    @Post()
    @Roles(['admin'])
    async create(@Body() adapter: AdapterDto) {
        const registeredAdapter = await this.adapterService.create(adapter)

        return {
            message: 'Adaptador criado com sucesso',
            statusCode: 201,
            adapter: registeredAdapter
        }
    }

    @Get('/:id')
    async get(@Param('id', ParseIntPipe) id: number) {
        const foundAdapter = await this.adapterService.get(id)

        if (!foundAdapter) throw new NotFoundException('Adapter especificado não encontrado')
        
        return foundAdapter
    }

    @Get()
    async getAll(@Query() query: AdapterPaginationQueryDto) {
        const where = cleanPagination<AdapterPaginationQueryDto>(query)

        const {
            adapters,
            count
        } = await this.adapterService.getAll(query.limit, query.page, where)

        return {
            data: adapters,
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
    async patch(@Param('id', ParseIntPipe) id: number, @Body() adapter: AdapterUpdateDto) {
        const updatedAdapter = await this.adapterService.update(id, adapter)

        if (!updatedAdapter) throw new NotFoundException('O adapter passado não foi encontrado')

        return {
            message: 'Adapter atualizado com sucesso',
            statusCode: 200,
            adapter: updatedAdapter
        }
    }

    @Delete('/:id')
    @Roles(['admin'])
    async remove(@Param('id', ParseIntPipe) id: number) {
        const adapter = await this.adapterService.get(id)
        if (!adapter) throw new NotFoundException('O adapter especificado não foi encontrado')
        await this.adapterService.pop(adapter.id)
        
        return {
            message: 'Adapter deletado com sucesso',
            statusCode: 200,
            adapter: adapter
        }
    }
}
