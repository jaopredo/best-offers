import { BadRequestException, Injectable, NotImplementedException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

/* DTO */
import { CategoryPostDto } from "types/category/category.dto"

/* REPOSITÓRIOS */
import { Category } from "database/models/category"


@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category) private categoryRepository: Repository<Category>
    ) {}

    async create(category: CategoryPostDto) {
        await this.categoryRepository.save(category)
        return category
    }

    // Fazendo overloads para a tipagem
    // async get(category: { id: number }): Promise<Category | null>
    // async get(category: Partial<Omit<Category, "id">>): Promise<Category[]>
    // async get(category: Partial<Category>) {
    // }

    async update(id: number, category: CategoryPostDto) {
    }

    async pop(id: number) {
    }
}
