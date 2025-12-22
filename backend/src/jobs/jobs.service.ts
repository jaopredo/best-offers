import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* REPOSITÓRIOS */
import { Job } from 'database/models/job.entity';

@Injectable()
export class JobService {
    constructor(
        @InjectRepository(Job) private jobRepository: Repository<Job>,
    ) {}

    // Fazendo overloads para a tipagem
    async get(id: number) {
        return await this.jobRepository.findOne({
            where: { id: id },
            relations: ['font', 'font.adapter', 'category'],
        });
    }

    async getAll(limit: number, page: number, job?: Partial<Job>) {
        const [jobs, count] = await this.jobRepository.findAndCount({
            take: limit,
            skip: (page - 1) * limit,
            where: {
                status: job?.status,
            },
        });

        return {
            jobs,
            count,
        };
    }

    async pop(id: number) {
        await this.jobRepository.delete({ id: id });
    }
}
