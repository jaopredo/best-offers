import { Processor, WorkerHost } from "@nestjs/bullmq"
import { Job } from "bullmq"
import { ScrapperProcessorData } from "types/scrapper/scrapper.dto"
import { ScrapperLogic } from "./scrapper.logic"


@Processor('scrapping')
export class ScrapperProcessor extends WorkerHost {
    constructor(
        private readonly scrapperLogic: ScrapperLogic
    ){
        super()
    }

    async process(job: Job<ScrapperProcessorData, any, string>): Promise<any> {
    }
}
