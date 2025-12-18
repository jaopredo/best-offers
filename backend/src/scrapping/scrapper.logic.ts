import { Injectable, Logger } from "@nestjs/common"
import { Repository } from "typeorm"
import axios from "axios"
import * as cheerio from 'cheerio'
import { ScrapperProcessorData } from "types/scrapper/scrapper.dto"


/* REPOSITÓRIOS */
import { Item } from "database/models/item"
import { InjectRepository } from "@nestjs/typeorm"
import { Job } from "database/models/job"


@Injectable()
export class ScrapperLogic {
    constructor(
        @InjectRepository(Item) private itemRepository: Repository<Item>,
        @InjectRepository(Job) private jobRepository: Repository<Job>,
    ) {}

    async scrap(data: ScrapperProcessorData) {
        // Scrap logic
    }
}