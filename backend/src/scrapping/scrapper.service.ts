import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Repository } from 'typeorm';
import { Queue } from 'bullmq';

/* REPOSITÓRIOS */
import { Font } from 'database/models/font.entity';
import { Category } from 'database/models/category.entity';
import { Job as JobModel } from 'database/models/job.entity';

/* ENUMS */
import { JobStatusEnum } from 'types/job/job.dto';

@Injectable()
export class ScrapperService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
        @InjectRepository(JobModel) private jobRepository: Repository<JobModel>,
        @InjectQueue('scrapping') private scrappingQueue: Queue,
    ) {}

    async scrap(font: Font) {
        // Pegando a lista de categorias
        const categories = await this.categoryRepository.find();

        // Em cada categoria, vou criar um job dedicado a realizar
        // o scrapping para aquela categoria específica
        const jobs: JobModel[] = [];
        for (const category of categories) {
            const job = new JobModel();
            job.category = category;
            job.font = font;
            job.status = JobStatusEnum.RUNNING;
            const savedJob = await this.jobRepository.save(job);
            jobs.push(savedJob);
            await this.scrappingQueue.add('scrapping', {
                id: savedJob.id,
                font,
                category,
            });
        }

        return jobs;
    }
}
