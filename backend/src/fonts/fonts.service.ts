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

    async create(fontData: FontPostDto) {
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
