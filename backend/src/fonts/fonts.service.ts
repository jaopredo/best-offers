import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { FindOptionsWhere, Repository } from "typeorm"

/* REPOSITÓRIOS */
import { Font } from "database/models/font"
import { Adapter } from "database/models/adapter"

/* DTO */
import { FontPostDto } from "types/font/font.dto"
import { whereFormater } from "utils/whereFormater"


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
        return await this.fontRepository.findOne({
            where: { id: id },
            relations: [ 'adapter' ]
        })
    }

    async getAll(limit: number, page: number, font?: Partial<Font>) {
        let payload: FindOptionsWhere<Font> = {}
        if (font) payload = whereFormater<Font>(font)

        const [ fonts, count ] = await this.fontRepository.findAndCount({
            take: limit,
            skip: (page-1)*limit,
            where: payload,
            relations: ['adapter']
        })

        return {
            fonts,
            count
        }
    }

    async update(id: number, font: Partial<FontPostDto>) {
    }

    async pop(id: number) {
    }
}
