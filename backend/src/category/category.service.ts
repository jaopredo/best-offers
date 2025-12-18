import { BadRequestException, Injectable, NotImplementedException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, ILike, FindOptionsWhere } from "typeorm"

/* DTO */
import { CategoryPostDto } from "types/category/category.dto"

/* REPOSITÓRIOS */
import { Category } from "database/models/category"

/* TIPOS */
import { whereFormater } from "utils/whereFormater"


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
    async get(id: number): Promise<Category | null> {
        return await this.categoryRepository.findOneBy({
            id: id
        })
    }

    async getAll(limit: number, page: number, category?: Partial<Category>) {
        let payload: FindOptionsWhere<Category> = {}
        if (category) payload = whereFormater<Category>(category)

        const [ categories, count ] = await this.categoryRepository.findAndCount({
            take: limit,
            skip: (page-1)*limit,
            where: payload
        })

        return {
            categories,
            count
        }
    }

    async update(id: number, category: Partial<CategoryPostDto>) {
        const updatedCategory = await this.categoryRepository.preload({
            id: id,
            ...category
        })

        if (!updatedCategory) return undefined

        await this.categoryRepository.save(updatedCategory)
        
        return updatedCategory
    }

    async pop(id: number) {
        await this.categoryRepository.delete({ id: id })
    }
}
