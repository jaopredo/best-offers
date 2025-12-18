import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { InjectQueue } from "@nestjs/bullmq"
import { Repository } from "typeorm"
import { Queue } from "bullmq"
import * as cheerio from 'cheerio'
import axios from 'axios'

/* REPOSITÓRIOS */
import { Font } from "database/models/font"
import { Adapter } from "database/models/adapter"
import { Category } from "database/models/category"


@Injectable()
export class ScrapperService {
    constructor(
        @InjectRepository(Category) private categoryRepository: Repository<Category>,
        @InjectQueue('scrapping') private scrappingQueue: Queue
    ){}

    async scrap(font: Font, adapter: Adapter) {
    }
}
