import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

/* REPOSITÓRIOS */
import { Font } from "database/models/font"
import { Adapter } from "database/models/adapter"

/* DTO */
import { FontPostDto } from "types/font/font.dto"


@Injectable()
export class FontService {
    constructor(
        @InjectRepository(Font) private fontRepository: Repository<Font>,
        @InjectRepository(Adapter) private adapterRepository: Repository<Adapter>
    ) {}

    async create(font: FontPostDto) {
        const adapter = await this.adapterRepository.findOneBy({
            id: font.adapterId
        })

        if (!adapter) return undefined

        return await this.fontRepository.save({
            ...font,
            adapterId: undefined,
            adapter
        })
    }

    async get(id: number) {
    }

    async getAll(limit: number, page: number, font?: Partial<Font>) {
    }

    async update(id: number, font: Partial<FontPostDto>) {
    }

    async pop(id: number) {
    }
}
