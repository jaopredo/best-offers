import APISource from '../source'

/* TIPOS */
import {
    Item,
    ItemApiResponse,
    ItemPagination,
    ItemRegisterInterface,
    ItemServiceInterface,
    ItemUpdateInterface
} from "@/types/api/services/item.service"
import { ApiPaginationResponse } from '@/types/api'


export default class ItemService implements ItemServiceInterface {
    source = new APISource('item')

    async get (id: number) {
        try {
            return await this.source.get<ItemApiResponse>(`${id}`)
        } catch (e: unknown) {
            throw new Error('Não Implementado')
        }
    }

    async getAll (pagination?: ItemPagination) {
        try {
            return await this.source.get<ApiPaginationResponse<Item>>('', {
                params: pagination
            })
        } catch (e: unknown) {
            throw new Error('Não Implementado')
        }
    }

    async create (data: ItemRegisterInterface) {
        try {
            return await this.source.post<ItemRegisterInterface, ItemApiResponse>(data)
        } catch (e: unknown) {
            throw new Error('Não Implementado')
        }
    }

    async update (id: number, data: ItemUpdateInterface) {
        try {
            return await this.source.patch<ItemUpdateInterface, ItemApiResponse>(data, `${id}`)
        } catch (e: unknown) {
            throw new Error('Não Implementado')
        }
    }

    async delete (id: number) {
        try {
            return await this.source.delete<ItemApiResponse>(`${id}`)
        } catch (e: unknown) {
            throw new Error('Não Implementado')
        }
    }
}
