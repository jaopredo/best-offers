import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { FindOptionsWhere, Repository } from "typeorm"

/* DTO */
import { ItemPostDto, ItemUpdateDto } from "types/item/item.dto"

/* REPOSITÓRIOS */
import { Item } from "database/models/item.entity"
import { Font } from "database/models/font.entity"
import { Category } from "database/models/category.entity"
import { whereFormater } from "utils/whereFormater"


@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(Item) private itemRepository: Repository<Item>,
        @InjectRepository(Font) private fontRepository: Repository<Font>,
        @InjectRepository(Category) private categoryRepository: Repository<Category>
    ) {}

    async create(item: ItemPostDto) {
        const font = await this.fontRepository.findOne({
            where: { id: item.fontId },
            relations: ['adapter']
        })
        const category = await this.categoryRepository.findOneBy({ id: item.categoryId })

        if (!font || !category) return undefined

        return await this.itemRepository.save({
            ...item,
            fontId: undefined,
            categoryId: undefined,

            font,
            category
        })
    }

    async get(id: number) {
        return await this.itemRepository.findOne({
            where: { id: id },
            relations: [ 'font', 'category', 'font.adapter' ]
        })
    }

    async getAll(limit: number, page: number, item?: Partial<Item>) {
        let payload: FindOptionsWhere<Item> = {}
        if (item) payload = whereFormater<Item>(item)

        const [ items, count ] = await this.itemRepository.findAndCount({
            take: limit,
            skip: (page-1)*limit,
            where: payload,
            relations: ['category', 'font', 'font.adapter']
        })

        return {
            items,
            count
        }
    }

    async update(id: number, item: Partial<ItemPostDto>) {
        // Eu procuro a fonte informada
        const foundItem = await this.itemRepository.findOne({
            where: { id: id },
            relations: ['category', 'font', 'font.adapter']
        })

        if (!foundItem) return undefined

        if (item.fontId) {
            const font = await this.fontRepository.findOne({
                where: { id: item.fontId },
                relations: ['adapter']
            })

            if (!font) return undefined

            foundItem.font = font
        }

        if (item.categoryId) {
            const category = await this.categoryRepository.findOneBy({
                id: item.categoryId
            })

            if (!category) return undefined

            foundItem.category = category
        }

        for (let [key, value] of Object.entries(item)) {
            if (value != undefined && key != 'fontId' && key != 'categoryId') foundItem[key] = item[key]
        }

        return await this.itemRepository.save(foundItem)
    }

    async pop(id: number) {
        await this.itemRepository.delete({ id })
    }
}
