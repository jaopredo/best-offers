import APISource from '../source'

/* TIPOS */
import {
    Adapter,
    AdapterApiResponse,
    AdapterPagination,
    AdapterRegisterInterface,
    AdapterServiceInterface,
    AdapterUpdateInterface
} from "@/types/api/services/adapter.service"
import { ApiPaginationResponse } from '@/types/api'


export default class AdapterService implements AdapterServiceInterface {
    source = new APISource('adapter')

    async get (id: number) {
        try {
            return await this.source.get<AdapterApiResponse>(`${id}`)
        } catch (e: unknown) {
            throw new Error('Não Implementado')
        }
    }

    async getAll (pagination?: AdapterPagination) {
        try {
            return await this.source.get<ApiPaginationResponse<Adapter>>('', {
                params: pagination
            })
        } catch (e: unknown) {
            throw new Error('Não Implementado')
        }
    }

    async create (data: AdapterRegisterInterface) {
        try {
            return await this.source.post<AdapterRegisterInterface, AdapterApiResponse>(data)
        } catch (e: unknown) {
            throw new Error('Não Implementado')
        }
    }

    async update (id: number, data: AdapterUpdateInterface) {
        try {
            return await this.source.patch<AdapterUpdateInterface, AdapterApiResponse>(data, `${id}`)
        } catch (e: unknown) {
            throw new Error('Não Implementado')
        }
    }

    async delete (id: number) {
        try {
            return await this.source.delete<AdapterApiResponse>(`${id}`)
        } catch (e: unknown) {
            throw new Error('Não Implementado')
        }
    }
}
