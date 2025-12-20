import { AxiosResponse } from "axios"
import { ApiDefaultResponse, ApiPaginationResponse, Pagination } from ".."
import { APISourceInterface } from "../source"


/* INTERFACE DO REGISTRO DE UMA CATEGORIA */
export interface CategoryRegisterInterface {
    name: string
}

/* INTERFACE DA ATUALIZAÇÃO DE UMA CATEGORIA */
export interface CategoryUpdateInterface extends CategoryRegisterInterface {}

/* TIPO DA CATEGORIA */
export type Category = CategoryRegisterInterface & {
    id: number
}

/* RESPOSTA PADRÃO DAS ROTAS DE CATEGORIA */
export type CategoryApiResponse = ApiDefaultResponse<{ category: Category }>

/* TIPAGEM DA PAGINAÇÃO DAS CATEGORIAS */
export type CategoryPagination = Pagination & {
    name?: string
}


/* INTERFACE DO SERVIÇO DAS DEMOLIÇÕES */
export interface DemolitionServiceInterface {
    source: APISourceInterface

    /* MÉTODOS BÁSICOS */
    /**
     * Método para realizar o registro de uma categoria no sistema
     * @param {CategoryRegisterInterface} data - As informações da nova categoria
     * @returns {Promise<CategoryApiResponse>} - Promesa com a resposta da requisição
     */
    create (data: CategoryRegisterInterface): Promise<CategoryApiResponse>

    /**
     * Função para recuperar uma lista com todas as categorias no sistema
     * @param {Pagination} pagination - Objeto com as informações de paginação
     * @returns {Promise<ApiPaginationResponse<Category>>} - A paginação das categorias presentes no banco
     */
    getAll(pagination?: Pagination): Promise<ApiPaginationResponse<Category>>

    /**
     * Função para recuperar uma categoria em específico
     * @param {number} id - ID de uma categoria específica
     * @returns {Promise<AxiosResponse<Category>>} - A categoria especificada
     */
    get(id: number): Promise<AxiosResponse<Category>>

    /**
     * Atualiza as informações de uma categoria especificada
     * @param {number} id - ID da demolição que será atualizado
     * @param {DemolitionUpdateInterface} data - Novas informações da categoria
     * @returns {Promise<CategoryApiResponse>} - Promise com a resposta da requisição
     */
    update(id: number, data: CategoryUpdateInterface): Promise<CategoryApiResponse>

    /**
     * Deleta uma categoria baseado no ID passado
     * @param {number} id - ID da categoria que será deletada
     * @returns {Promise<CategoryApiResponse>} - Promise com a resposta da requisição
     */
    delete: (id: number) => Promise<CategoryApiResponse>
}