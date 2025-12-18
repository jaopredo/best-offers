import { Injectable, Logger } from "@nestjs/common"
import { Repository } from "typeorm"
import axios from "axios"
import * as cheerio from 'cheerio'
import { ScrapperProcessorData } from "types/scrapper/scrapper.dto"


/* REPOSITÓRIOS */
import { Item } from "database/models/item"
import { InjectRepository } from "@nestjs/typeorm"


@Injectable()
export class ScrapperLogic {
    logger = new Logger(ScrapperLogic.name)

    constructor(
        @InjectRepository(Item) private itemRepository: Repository<Item>,
    ) {}

    async scrap(data: ScrapperProcessorData) {
    }
}