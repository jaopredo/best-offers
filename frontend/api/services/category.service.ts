import APISource from '../source'

/* TIPOS */
import {
    Category,
    CategoryApiResponse,
    CategoryPagination,
    CategoryRegisterInterface,
    CategoryServiceInterface,
    CategoryUpdateInterface
} from "@/types/api/services/category.service"
import { ApiPaginationResponse } from '@/types/api'


export default class CategoryService implements CategoryServiceInterface {
    source = new APISource('category')

    async get (id: number) {
        try {
            return await this.source.get<CategoryApiResponse>(`${id}`)
        } catch (e: unknown) {
            throw new Error('Não Implementado')
        }
    }

    async getAll (pagination?: CategoryPagination) {
        try {
            return await this.source.get<ApiPaginationResponse<Category>>('', {
                params: pagination
            })
        } catch (e: unknown) {
            throw new Error('Não Implementado')
        }
    }

    async create (data: CategoryRegisterInterface) {
        try {
            return await this.source.post<CategoryRegisterInterface, CategoryApiResponse>(data)
        } catch (e: unknown) {
            throw new Error('Não Implementado')
        }
    }

    async update (id: number, data: CategoryUpdateInterface) {
        try {
            return await this.source.patch<CategoryUpdateInterface, CategoryApiResponse>(data, `${id}`)
        } catch (e: unknown) {
            throw new Error('Não Implementado')
        }
    }

    async delete (id: number) {
        try {
            return await this.source.delete<CategoryApiResponse>(`${id}`)
        } catch (e: unknown) {
            throw new Error('Não Implementado')
        }
    }
}