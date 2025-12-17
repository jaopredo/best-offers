import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

/* DTO */
import { ItemPostDto, ItemUpdateDto } from "types/item/item.dto"

/* REPOSITÓRIOS */
import { Item } from "database/models/item"
import { Font } from "database/models/font"
import { Category } from "database/models/category"


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
    }

    async getAll(limit: number, page: number, item?: Partial<Item>) {
    }

    async update(id: number, item: Partial<ItemPostDto>) {
    }

    async pop(id: number) {
    }
}
