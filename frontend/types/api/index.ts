import { AxiosError, AxiosResponse } from "axios"

/**
 * Interface padrão das respostas da API
 */
export type ApiDefaultResponse<T = unknown> = AxiosResponse<({
    message: string|string[],
    statusCode: number
}) & T>

export type ApiError = AxiosError<{
    message:string|string[],
    statusCode: number,
    error: string
}>

/**
 * Aqui, eu tenho a estrutura padrão de toda requisição que é uma mensagem, um código de status, e dependendo
 * se deu erro ou não, eu vou retornar uma propriedade de erro ou algo que eu passar. Por exemplo, ao criar um
 * usuário, eu retorno um token, então eu poderia fazer algo tipo:
 * type ApiRegisterUserResponse = ApiDefautResponse<{ token: string }>
 */

/**
 * Tipo padrão das paginações (Propriedades padrão)
 */
export type Pagination = {
    page?: number,
    limit?: number
}

/**
 * Tipo padrão das respostas de paginação
 */
export type ApiPaginationResponse<T=unknown> = AxiosResponse<{
    data: T[],
    meta: {
        page: number,
        limit: number,
        total: number,
        totalPages: number
    }
}>
