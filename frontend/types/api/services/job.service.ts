import { AxiosResponse } from "axios"
import { ApiDefaultResponse, ApiPaginationResponse, Pagination } from ".."
import { APISourceInterface } from "../source"

import { Font } from "./font.service"
import { Category } from "./category.service"

/* ENUM DOS STATUS DO JOB */
export enum JobStatusEnum {
    RUNNING = 'running',
    FAILED = 'failed',
    SUCCESS = 'success'
}

/* TIPO DO JOB */
export type Job = {
    id: number
    status: JobStatusEnum
    font: Font
    category: Category
}

/* RESPOSTA PADRÃO DAS ROTAS DO JOB */
export type JobApiResponse = ApiDefaultResponse<{ job: Job }>

/* TIPAGEM DA PAGINAÇÃO DOS JOBS */
export type JobPagination = Pagination & Partial<{ status: JobStatusEnum }>


/* INTERFACE DO SERVIÇO DOS JOBS */
export interface JobServiceInterface {
    source: APISourceInterface

    /**
     * Função para recuperar uma lista com todos os jobs no sistema
     * @param {JobPagination} pagination - Objeto com as informações de paginação
     * @returns {Promise<AxiosResponse<ApiPaginationResponse<Job>>>} - A paginação dos jobs presentes no banco
     */
    getAll(pagination?: JobPagination): Promise<AxiosResponse<ApiPaginationResponse<Job>>>

    /**
     * Função para recuperar um job em específico
     * @param {number} id - ID de um job específico
     * @returns {Promise<AxiosResponse<JobApiResponse>>} - O job especificado
     */
    get(id: number): Promise<AxiosResponse<JobApiResponse>>

    /**
     * Deleta um job baseado no ID passado
     * @param {number} id - ID do job que será deletado
     * @returns {Promise<AxiosResponse<JobApiResponse>>} - Promise com a resposta da requisição
     */
    delete: (id: number) => Promise<AxiosResponse<JobApiResponse>>
}
