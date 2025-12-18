import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, FindOptionsWhere } from "typeorm"

/* REPOSITÓRIOS */
import { Job } from "database/models/job"

/* TIPOS */
import { Pagination } from "types/pagination/pagination.dto"
import { whereFormater } from "utils/whereFormater"


@Injectable()
export class JobService {
    constructor(
        @InjectRepository(Job) private jobRepository: Repository<Job>
    ) {}

    // Fazendo overloads para a tipagem
    async get(id: number) {
        return await this.jobRepository.findOne({
            where: { id: id },
            relations: ['font', 'font.adapter', 'category']
        })
    }

    async getAll(limit: number, page: number, category?: Partial<Job>) {
    }

    async pop(id: number) {
    }
}
