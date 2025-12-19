import { Injectable, Logger } from "@nestjs/common"
import { Repository } from "typeorm"
import axios from "axios"
import * as cheerio from 'cheerio'
import { ScrapperProcessorData } from "types/scrapper/scrapper.dto"


/* REPOSITÓRIOS */
import { Item } from "database/models/item.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { Job } from "database/models/job.entity"

/* UTILS */
import { searchBuilder } from "utils/searchBuilder"

/* ENUM */
import { JobStatusEnum } from "types/job/job.dto"


@Injectable()
export class ScrapperLogic {
    logger = new Logger(ScrapperLogic.name)

    constructor(
        @InjectRepository(Item) private itemRepository: Repository<Item>,
        @InjectRepository(Job) private jobRepository: Repository<Job>,
    ) {}

    async scrap(data: ScrapperProcessorData) {
        const { category, font, id } = data

        const url = searchBuilder(font.adapter, category)

        if (!url) {
            await this.jobRepository.update({ id }, { status: JobStatusEnum.FAILED })
            this.logger.error(`JOB ${id}.${font.id}.${category.id}: Erro na construção da URL`)
            return
        }

        const { data: body } = await axios.get(url)

        // Carregando o conteúdo da pesquisa
        const $ = cheerio.load(body, null, false)

        // Promessas dos itens
        const promises: Promise<Item>[] = []

        $(`.${font.adapter.itemContainerClassName}`).each((idx, element) => {
            const moneyRegex = /R\$\s*(\d{1,3}(\.\d{3})*|\d+),\d{2}/

            // Pegando as informações de cada item
            const $element = $(element)
            const itemName = $element.find(`.${font.adapter.itemNameClassName}`).text().trim()
            let price = $element.find(`.${font.adapter.itemPriceClassName}`).text().trim().match(moneyRegex)
            const itemPrice = price ? Number(price[0].replace(/R\$\s*/, '').replace(/\./g, '').replace(',', '.')) : NaN
            let itemSeller: string|null = null
            if (font.adapter.itemSellerClassName) {
                itemSeller = $element.find(`.${font.adapter.itemSellerClassName}`).text().trim() ?? null
            }
            const itemURL = $element.find(`.${font.adapter.itemURLClassName}`).attr('href')

            // Campos obrigatórios de ter
            if (Number.isNaN(itemPrice) || !itemURL || !itemName) {
                this.logger.error(`JOB ${id}.${font.id}.${category.id}: Item rejeitado por não ter preço, url ou nome`)
                return
            }

            const item = new Item()
            item.name = itemName
            item.price = itemPrice
            item.seller = itemSeller
            item.url = itemURL
            item.category = category
            item.font = font

            // Salvando as promises para resolvê-las antes de acabar a requisição
            promises.push(this.itemRepository.save(item))
            this.logger.log(`Job ${id}.${font.id}.${category.id}: Item adicionado`)
        })
        await Promise.all(promises)
    }
}