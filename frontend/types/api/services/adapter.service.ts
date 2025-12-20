import { AxiosResponse } from "axios"
import { ApiDefaultResponse, ApiPaginationResponse, Pagination } from ".."
import { APISourceInterface } from "../source"


/* INTERFACE DO REGISTRO DE UM ADAPTER */
export interface AdapterRegisterInterface {
    searchURL: string
    searchParameter?: string
    sep: string

    itemURLClassName: string
    itemContainerClassName: string
    itemNameClassName: string
    itemPriceClassName: string
    itemSellerClassName: string
}

/* INTERFACE DA ATUALIZAÇÃO DE UM ADAPTER */
export interface AdapterUpdateInterface extends Partial<AdapterRegisterInterface> {}

/* TIPO DO ADAPTER */
export type Adapter = AdapterRegisterInterface & {
    id: number
}

/* RESPOSTA PADRÃO DAS ROTAS DO ADAPTER */
export type AdapterApiResponse = ApiDefaultResponse<{ adapter: Adapter }>

/* TIPAGEM DA PAGINAÇÃO DOS ADAPTERS */
export type AdapterPagination = Pagination & Partial<AdapterRegisterInterface>


/* INTERFACE DO SERVIÇO DOS ADAPTERS */
export interface AdapterServiceInterface {
    source: APISourceInterface

    /* MÉTODOS BÁSICOS */
    /**
     * Método para realizar o registro de um adapter no sistema
     * @param {AdapterRegisterInterface} data - As informações do novo adapter
     * @returns {Promise<AdapterApiResponse>} - Promise com a resposta da requisição
     */
    create (data: AdapterRegisterInterface): Promise<AdapterApiResponse>

    /**
     * Função para recuperar uma lista com todos os adapters no sistema
     * @param {Pagination} pagination - Objeto com as informações de paginação
     * @returns {Promise<ApiPaginationResponse<Adapter>>} - A paginação dos adapters presentes no banco
     */
    getAll(pagination?: Pagination): Promise<ApiPaginationResponse<Adapter>>

    /**
     * Função para recuperar um adapter em específico
     * @param {number} id - ID de um adapter específico
     * @returns {Promise<AxiosResponse<Adapter>>} - O adapter especificado
     */
    get(id: number): Promise<AxiosResponse<Adapter>>

    /**
     * Atualiza as informações de um adapter especificado
     * @param {number} id - ID do adapter que será atualizado
     * @param {AdapterUpdateInterface} data - Novas informações do adapter
     * @returns {Promise<AdapterApiResponse>} - Promise com a resposta da requisição
     */
    update(id: number, data: AdapterUpdateInterface): Promise<AdapterApiResponse>

    /**
     * Deleta um adapter baseado no ID passado
     * @param {number} id - ID do adapter que será deletado
     * @returns {Promise<AdapterApiResponse>} - Promise com a resposta da requisição
     */
    delete: (id: number) => Promise<AdapterApiResponse>
}
