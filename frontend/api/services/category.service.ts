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

/* ALERT MANAGERS */
import ErrorStoreManager from "@/alerts/errors"
import SuccessStoreManager from "@/alerts/successes"

/* UTILS */
import { alertSetup } from "@/utils/alerts"


export default class CategoryService implements CategoryServiceInterface {
    source = new APISource('category')

    async get (id: number) {
        try {
            const response = await this.source.get<CategoryApiResponse>(`${id}`)
            alertSetup(response.data.message || 'Operação concluída com sucesso', SuccessStoreManager)
            return response
        } catch (e: unknown) {
            const err = e as ApiError
            alertSetup(err.response?.data.message || 'Erro Desconhecido', ErrorStoreManager)
        }
    }

    async getAll (pagination?: CategoryPagination) {
        try {
            const response = await this.source.get<ApiPaginationResponse<Category>>('', {
                params: pagination
            })
            alertSetup(response.data.message || 'Operação concluída com sucesso', SuccessStoreManager)
            return response
        } catch (e: unknown) {
            const err = e as ApiError
            alertSetup(err.response?.data.message || 'Erro Desconhecido', ErrorStoreManager)
        }
    }

    async create (data: CategoryRegisterInterface) {
        try {
            const response = await this.source.post<CategoryRegisterInterface, CategoryApiResponse>(data)
            alertSetup(response.data.message || 'Operação concluída com sucesso', SuccessStoreManager)
            return response
        } catch (e: unknown) {
            const err = e as ApiError
            alertSetup(err.response?.data.message || 'Erro Desconhecido', ErrorStoreManager)
        }
    }

    async update (id: number, data: CategoryUpdateInterface) {
        try {
            const response = await this.source.patch<CategoryUpdateInterface, CategoryApiResponse>(data, `${id}`)
            alertSetup(response.data.message || 'Operação concluída com sucesso', SuccessStoreManager)
            return response
        } catch (e: unknown) {
            const err = e as ApiError
            alertSetup(err.response?.data.message || 'Erro Desconhecido', ErrorStoreManager)
        }
    }

    async delete (id: number) {
        try {
            const response = await this.source.delete<CategoryApiResponse>(`${id}`)
            alertSetup(response.data.message || 'Operação concluída com sucesso', SuccessStoreManager)
            return response
        } catch (e: unknown) {
            const err = e as ApiError
            alertSetup(err.response?.data.message || 'Erro Desconhecido', ErrorStoreManager)
        }
    }
}