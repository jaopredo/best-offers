import { AxiosResponse } from "axios"
import { ApiDefaultResponse, ApiPaginationResponse, Pagination } from ".."
import { APISourceInterface } from "../source"

import { Adapter } from "./adapter.service"


/* INTERFACE DO REGISTRO DE UMA FONT */
export interface FontRegisterInterface {
    url: string
    name: string
    adapterId: number
}

/* INTERFACE DA ATUALIZAÇÃO DE UMA FONT */
export interface FontUpdateInterface extends Partial<FontRegisterInterface> {}

/* TIPO DA FONT */
export type Font = Omit<FontRegisterInterface, 'adapterId'> & {
    id: number,
    adapter: Adapter
}

/* RESPOSTA PADRÃO DAS ROTAS DA FONT */
export type FontApiResponse = ApiDefaultResponse<{ font: Font }>

/* TIPAGEM DA PAGINAÇÃO DAS FONTS */
export type FontPagination = Pagination & Partial<Omit<FontRegisterInterface, 'adapterId'>>


/* INTERFACE DO SERVIÇO DAS FONTS */
export interface FontServiceInterface {
    source: APISourceInterface

    /* MÉTODOS BÁSICOS */
    /**
     * Método para realizar o registro de uma font no sistema
     * @param {FontRegisterInterface} data - As informações da nova font
     * @returns {Promise<FontApiResponse>} - Promise com a resposta da requisição
     */
    create (data: FontRegisterInterface): Promise<FontApiResponse>

    /**
     * Função para recuperar uma lista com todas as fonts no sistema
     * @param {Pagination} pagination - Objeto com as informações de paginação
     * @returns {Promise<ApiPaginationResponse<Font>>} - A paginação das fonts presentes no banco
     */
    getAll(pagination?: Pagination): Promise<ApiPaginationResponse<Font>>

    /**
     * Função para recuperar uma font em específico
     * @param {number} id - ID de uma font específica
     * @returns {Promise<AxiosResponse<Font>>} - A font especificada
     */
    get(id: number): Promise<AxiosResponse<Font>>

    /**
     * Atualiza as informações de uma font especificada
     * @param {number} id - ID da font que será atualizada
     * @param {FontUpdateInterface} data - Novas informações da font
     * @returns {Promise<FontApiResponse>} - Promise com a resposta da requisição
     */
    update(id: number, data: FontUpdateInterface): Promise<FontApiResponse>

    /**
     * Deleta uma font baseada no ID passado
     * @param {number} id - ID da font que será deletada
     * @returns {Promise<FontApiResponse>} - Promise com a resposta da requisição
     */
    delete: (id: number) => Promise<FontApiResponse>
}
