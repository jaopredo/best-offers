import { BadRequestException, Body, Controller, NotImplementedException, Post, UseGuards } from "@nestjs/common"

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
import { Job } from "database/models/job"


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('/scrapping')
export class ScrapperController {
    constructor(
        private adapterService: AdapterService,
        private fontService: FontService,
        private scrapperService: ScrapperService
    ){}

    @Roles(['admin'])
    @Post()
    async create(@Body() body: ScrapperPostDto) {
        let createdJobs: Job[]

        if (body.font && body.adapter) {
            // Inserindo o adaptador passado
            const adapter = await this.adapterService.create(body.adapter)
            const font = await this.fontService.create({
                ...body.font,
                adapterId: adapter.id
            })

            if (!font || !adapter) throw new BadRequestException('Não foi possível criar e fazer scrapping da fonte passada')
            
            createdJobs = await this.scrapperService.scrap(font)
        } else if (body.fontId) {
            const font = await this.fontService.get(body.fontId)

            if (!font) throw new BadRequestException('Não foi possível criar e fazer scrapping da fonte passada')

            createdJobs = await this.scrapperService.scrap(font)
        } else {
            throw new BadRequestException('Você não passou os parâmetros necessários para a requisição')
        }

        return {
            message: 'O trabalho de scrapping foi iniciado',
            statusCode: 201,
            jobs: createdJobs
        }
    }
}
