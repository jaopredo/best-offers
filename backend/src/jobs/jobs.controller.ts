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
import { JobPaginationQueryDto } from "types/job/job.dto"

/* SERVIÇOS */
import { JobService } from "./jobs.service"


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('/category')
export class JobController {
    constructor(
        private jobService: JobService
    ) {}

    @Get('/:id')
    async get(@Param('id', ParseIntPipe) id: number) {
        const foundJob = await this.jobService.get(id)

        if (!foundJob) throw new NotFoundException('Categoria solicitada não encontrada')

        return foundJob
    }

    @Get()
    async getAll(@Query() query: JobPaginationQueryDto) {
        throw new NotImplementedException()
    }

    @Delete('/:id')
    @Roles(['admin'])
    async remove(@Param('id', ParseIntPipe) id: number) {
        throw new NotImplementedException()
    }
}
