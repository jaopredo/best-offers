import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

/* REPOSITÓRIOS */
import { Adapter } from "database/models/adapter"

/* DTO */
import { AdapterDto } from "types/adapter/adapter.dto"


@Injectable()
export class AdapterService {
    constructor(
        @InjectRepository(Adapter) private adapterRepository: Repository<Adapter>
    ) {}

    async create(adapter: AdapterDto) {
        return await this.adapterRepository.save(adapter)
    }

    async get(id: number) {
    }

    async getAll(limit: number, page: number, adapter: Partial<Adapter>) {
    }

    async update(id: number, adapter: Partial<AdapterDto>) {
    }

    async pop(id: number) {
    }
}
