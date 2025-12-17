import { BadRequestException, Injectable, NotImplementedException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

/* DTO */
import { ItemPostDto, ItemDto } from "types/item/item.dto"

/* REPOSITÓRIOS */
import { Item } from "database/models/item"


@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(Item) private itemRepository: Repository<Item>
    ) {}

    async create(item: ItemDto) {
    }

    async get(id: number) {
    }

    async update(id: number, item: Partial<ItemPostDto>) {
    }

    async pop(id: number) {
    }
}
