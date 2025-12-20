import { AxiosResponse } from "axios"
import { ApiDefaultResponse, ApiPaginationResponse, Pagination } from ".."
import { APISourceInterface } from "../source"

import { Font } from "./font.service"
import { Category } from "./category.service"


/* INTERFACE DO REGISTRO DE UM ITEM */
export interface ItemRegisterInterface {
    name: string
    price: number
    seller?: string
    url: string
    fontId: number
    categoryId: number
}

/* INTERFACE DA ATUALIZAÇÃO DE UM ITEM */
export interface ItemUpdateInterface extends Partial<ItemRegisterInterface> {}

/* TIPO DO ITEM */
export type Item = Omit<ItemRegisterInterface, 'fontId'> & {
    id: number
    font: Font
    category: Category
}

/* RESPOSTA PADRÃO DAS ROTAS DO ITEM */
export type ItemApiResponse = ApiDefaultResponse<{ item: Item }>

/* TIPAGEM DA PAGINAÇÃO DOS ITENS */
export type ItemPagination = Pagination & Partial<Omit<ItemRegisterInterface, 'fontId'|'categoryId'>>


/* INTERFACE DO SERVIÇO DOS ITENS */
export interface ItemServiceInterface {
    source: APISourceInterface

    /* MÉTODOS BÁSICOS */
    /**
     * Método para realizar o registro de um item no sistema
     * @param {ItemRegisterInterface} data - As informações do novo item
     * @returns {Promise<AxiosResponse<ItemApiResponse>>} - Promise com a resposta da requisição
     */
    create (data: ItemRegisterInterface): Promise<AxiosResponse<ItemApiResponse>>

    /**
     * Função para recuperar uma lista com todos os itens no sistema
     * @param {ItemPagination} pagination - Objeto com as informações de paginação
     * @returns {Promise<AxiosResponse<ApiPaginationResponse<Item>>>} - A paginação dos itens presentes no banco
     */
    getAll(pagination?: ItemPagination): Promise<AxiosResponse<ApiPaginationResponse<Item>>>

    /**
     * Função para recuperar um item em específico
     * @param {number} id - ID de um item específico
     * @returns {Promise<AxiosResponse<ItemApiResponse>>} - O item especificado
     */
    get(id: number): Promise<AxiosResponse<ItemApiResponse>>

    /**
     * Atualiza as informações de um item especificado
     * @param {number} id - ID do item que será atualizado
     * @param {ItemUpdateInterface} data - Novas informações do item
     * @returns {Promise<AxiosResponse<ItemApiResponse>>} - Promise com a resposta da requisição
     */
    update(id: number, data: ItemUpdateInterface): Promise<AxiosResponse<ItemApiResponse>>

    /**
     * Deleta um item baseado no ID passado
     * @param {number} id - ID do item que será deletado
     * @returns {Promise<AxiosResponse<ItemApiResponse>>} - Promise com a resposta da requisição
     */
    delete: (id: number) => Promise<AxiosResponse<ItemApiResponse>>
}
