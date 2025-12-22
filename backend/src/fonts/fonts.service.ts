import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

/* REPOSITÓRIOS */
import { Font } from 'database/models/font.entity';
import { Adapter } from 'database/models/adapter.entity';

/* DTO */
import { FontPostDto } from 'types/font/font.dto';

/* UTILS */
import { removeUndefined } from 'utils/removeUndefined';
import { whereFormater } from 'utils/whereFormater';

@Injectable()
export class FontService {
    constructor(
        @InjectRepository(Font) private fontRepository: Repository<Font>,
        @InjectRepository(Adapter)
        private adapterRepository: Repository<Adapter>,
    ) {}

    async create(font: FontPostDto) {
        const adapter = await this.adapterRepository.findOneBy({
            id: font.adapterId,
        });

        if (!adapter) return undefined;

        return await this.fontRepository.save({
            ...font,
            adapterId: undefined,
            adapter,
        });
    }

    async get(id: number) {
        return await this.fontRepository.findOne({
            where: { id: id },
            relations: ['adapter'],
        });
    }

    async getAll(limit: number, page: number, font?: Partial<Font>) {
        let payload: FindOptionsWhere<Font> = {};
        if (font) payload = whereFormater<Font>(font);

        const [fonts, count] = await this.fontRepository.findAndCount({
            take: limit,
            skip: (page - 1) * limit,
            where: payload,
            relations: ['adapter'],
        });

        return {
            fonts,
            count,
        };
    }

    async update(id: number, font: Partial<FontPostDto>) {
        // Eu procuro a fonte informada
        const foundFont = await this.fontRepository.findOne({
            where: { id: id },
            relations: ['adapter'],
        });

        if (!foundFont) return undefined;

        if (font.adapterId) {
            const adapter = await this.adapterRepository.findOneBy({
                id: font.adapterId,
            });

            if (!adapter) return undefined;

            foundFont.adapter = adapter;
        }

        const { adapterId: _adapterId, ...safeFont } = font;
        const definitiveSafeFont = {
            ...foundFont,
            ...removeUndefined(safeFont),
        };

        return await this.fontRepository.save(definitiveSafeFont);
    }

    async pop(id: number) {
        await this.fontRepository.delete({ id });
    }
}
