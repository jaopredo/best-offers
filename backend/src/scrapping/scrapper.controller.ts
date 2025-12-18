import { BadRequestException, Body, Controller, Post, UseGuards } from "@nestjs/common"
import { InjectQueue } from "@nestjs/bullmq"
import { Queue } from "bullmq"

/* SERVIÇOS */
import { ScrapperService } from "./scrapper.service"
import { AdapterService } from "src/adapter/adapter.service"
import { FontService } from "src/fonts/fonts.service"

/* GUARDAS */
import { JwtAuthGuard, RolesGuard } from "src/auth/auth.guard"

/* DECORADORES */
import { Roles } from "src/decorators/roles.decorator"

/* TIPOS */
import type { ScrapperPostDto } from "types/scrapper/scrapper.dto"


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('/scrapper')
export class ScrapperController {
    constructor(
        private adapterService: AdapterService,
        private fontService: FontService,
        private scrapperService: ScrapperService
    ){}

    @Roles(['admin'])
    @Post()
    async create(@Body() body: ScrapperPostDto) {
    }
}
