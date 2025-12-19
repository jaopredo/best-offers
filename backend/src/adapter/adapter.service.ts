import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { FindOptionsWhere, Repository } from "typeorm"

/* REPOSITÓRIOS */
import { Adapter } from "database/models/adapter.entity"

/* DTO */
import { AdapterPostDto } from "types/adapter/adapter.dto"

/* UTILS */
import { whereFormater } from "utils/whereFormater"


@Injectable()
export class AdapterService {
    constructor(
        @InjectRepository(Adapter) private adapterRepository: Repository<Adapter>
    ) {}

    async create(adapter: AdapterPostDto) {
        return await this.adapterRepository.save(adapter)
    }

    async get(id: number): Promise<Adapter|null> {
        return await this.adapterRepository.findOneBy({
            id: id
        })
    }

    async getAll(limit: number, page: number, adapter: Partial<Adapter>) {
        let payload: FindOptionsWhere<Adapter> = {}
        if (adapter) payload = whereFormater<Adapter>(adapter)

        const [ adapters, count ] = await this.adapterRepository.findAndCount({
            take: limit,
            skip: (page-1)*limit,
            where: payload
        })

        return {
            adapters,
            count
        }
    }

    async update(id: number, adapter: Partial<AdapterPostDto>) {
        const updatedAdapter = await this.adapterRepository.preload({
            id: id,
            ...adapter
        })

        if (!updatedAdapter) return undefined

        await this.adapterRepository.save(updatedAdapter)
        
        return updatedAdapter
    }

    async pop(id: number) {
        await this.adapterRepository.delete({ id: id })
    }
}
