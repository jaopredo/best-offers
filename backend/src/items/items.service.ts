import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { FindOptionsWhere, Repository } from "typeorm"

/* DTO */
import { ItemPostDto, ItemUpdateDto } from "types/item/item.dto"

/* REPOSITÓRIOS */
import { Item } from "database/models/item"
import { Font } from "database/models/font"
import { Category } from "database/models/category"
import { whereFormater } from "utils/whereFormater"


@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(Item) private itemRepository: Repository<Item>,
        @InjectRepository(Font) private fontRepository: Repository<Font>,
        @InjectRepository(Category) private categoryRepository: Repository<Category>
    ) {}

    async create(item: ItemPostDto) {
        const font = await this.fontRepository.findOneBy({ id: item.fontId })
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
            relations: [ 'font', 'category' ]
        })
    }

    async getAll(limit: number, page: number, item?: Partial<Item>) {
        let payload: FindOptionsWhere<Item> = {}
        if (item) payload = whereFormater<Item>(item)

        const [ items, count ] = await this.itemRepository.findAndCount({
            take: limit,
            skip: (page-1)*limit,
            where: payload,
            relations: ['category', 'font']
        })

        return {
            items,
            count
        }
    }

    async update(id: number, item: Partial<ItemPostDto>) {
    }

    async pop(id: number) {
    }
}
