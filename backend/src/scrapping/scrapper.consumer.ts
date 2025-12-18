import { Processor, WorkerHost } from "@nestjs/bullmq"
import { Job } from "bullmq"
import { ScrapperProcessorData } from "types/scrapper/scrapper.dto"
import { ScrapperLogic } from "./scrapper.logic"
import { Logger } from "@nestjs/common"
import { Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { Job as JobModel } from "database/models/job"
import { JobStatusEnum } from "types/job/job.dto"


@Processor('scrapping')
export class ScrapperProcessor extends WorkerHost {
    logger = new Logger(ScrapperProcessor.name)
    
    constructor(
        @InjectRepository(JobModel) private jobRepository: Repository<JobModel>,
        private readonly scrapperLogic: ScrapperLogic,
    ){
    
        super()
    }

    async process(job: Job<ScrapperProcessorData, any, string>): Promise<any> {
        const { data } = job
        this.logger.log(`JOB ${data.id} associado à fonte ${data.font.name} e categoria ${data.category.name} INICIADO`)
        
        await this.scrapperLogic.scrap(data)

        await this.jobRepository.update({ id: data.id }, { status: JobStatusEnum.SUCCESS })
        this.logger.log(`JOB ${data.id} associado à fonte ${data.font.name} e categoria ${data.category.name} FINALIZADO`)
    }
}
