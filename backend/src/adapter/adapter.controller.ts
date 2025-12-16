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
import { AdapterDto } from "types/adapter/adapter.dto"

/* SERVIÇOS */
import { AdapterService } from "./adapter.service"


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('/adapter')
export class AdapterController {
    constructor(
        private adapterService: AdapterService
    ) {}

    @Post()
    @Roles(['admin'])
    async create(@Body() adapter: AdapterDto) {
        throw new NotImplementedException()
    }

    @Get('/:id')
    async get(@Param('id') id: string) {
        throw new NotImplementedException()
    }

    @Get()
    async getAll() {
        throw new NotImplementedException()
    }

    @Patch('/:id')
    @Roles(['admin'])
    async patch(@Param('id') id: string, @Body() adapter: Partial<AdapterDto>) {
        throw new NotImplementedException()
    }

    @Delete('/:id')
    @Roles(['admin'])
    async remove(@Param('id') id: string) {
        throw new NotImplementedException()
    }
}
