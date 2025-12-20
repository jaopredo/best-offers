import APISource from '../source'

/* TIPOS */
import {
    Font,
    FontApiResponse,
    FontPagination,
    FontRegisterInterface,
    FontServiceInterface,
    FontUpdateInterface
} from "@/types/api/services/font.service"
import { ApiPaginationResponse } from '@/types/api'


export default class FontService implements FontServiceInterface {
    source = new APISource('font')

    async get (id: number) {
        try {
            return await this.source.get<FontApiResponse>(`${id}`)
        } catch (e: unknown) {
            throw new Error('Não Implementado')
        }
    }

    async getAll (pagination?: FontPagination) {
        try {
            return await this.source.get<ApiPaginationResponse<Font>>('', {
                params: pagination
            })
        } catch (e: unknown) {
            throw new Error('Não Implementado')
        }
    }

    async create (data: FontRegisterInterface) {
        try {
            return await this.source.post<FontRegisterInterface, FontApiResponse>(data)
        } catch (e: unknown) {
            throw new Error('Não Implementado')
        }
    }

    async update (id: number, data: FontUpdateInterface) {
        try {
            return await this.source.patch<FontUpdateInterface, FontApiResponse>(data, `${id}`)
        } catch (e: unknown) {
            throw new Error('Não Implementado')
        }
    }

    async delete (id: number) {
        try {
            return await this.source.delete<FontApiResponse>(`${id}`)
        } catch (e: unknown) {
            throw new Error('Não Implementado')
        }
    }
}
