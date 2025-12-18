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

/* UTILS */
import { cleanPagination } from "utils/paginationCleaner"


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('/job')
export class JobController {
    constructor(
        private jobService: JobService
    ) {}

    @Get('/:id')
    async get(@Param('id', ParseIntPipe) id: number) {
        const foundJob = await this.jobService.get(id)

        if (!foundJob) throw new NotFoundException('Job solicitado não encontrado')

        return foundJob
    }

    @Get()
    async getAll(@Query() query: JobPaginationQueryDto) {
        const {
            jobs,
            count
        } = await this.jobService.getAll(query.limit, query.page, {
            status: query.status
        })

        return {
            data: jobs,
            meta: {
                page: query.page,
                limit: query.limit,
                total: count,
                totalPages: Math.ceil(count / query.limit)
            }
        }
    }

    @Delete('/:id')
    @Roles(['admin'])
    async remove(@Param('id', ParseIntPipe) id: number) {
        const job = await this.jobService.get(id)
        if (!job) throw new NotFoundException('O job especificado não foi encontrado')
        await this.jobService.pop(job.id)
        
        return {
            message: 'Job deletado com sucesso',
            statusCode: 200,
            job
        }
    }
}
