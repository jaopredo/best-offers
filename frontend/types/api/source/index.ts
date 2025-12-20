import { AxiosRequestConfig, AxiosResponse } from "axios"
import { ApiDefaultResponse } from ".."


/**
 * Interface relacionada ao Source da API para instanciamento pelos
 * serviços da aplicação
 */
export interface APISourceInterface {
    /** Propriedade responsável por indicar o agrupamento de rotas prévio */
    route: string

    /**
     * Requisição HTTP GET para o Axios
     * @param {String} path - Caminho da requisição a partir do `this.route`
     * @param {AxiosRequestConfig} config - Objeto de configurações da requisição
     * @returns {Promise<AxiosREsponse>} Promise contendo a resposta do axios para a requisição
     * 
     * @example
     * // Suponha que você quer pegar todas as vendas em uma rota /sells
     * const api = new APISource('/sells')
     * api.get().then(resp => console.log(resp.data))
     */
    get<R extends ApiDefaultResponse>(path: string, config?: AxiosRequestConfig): Promise<AxiosResponse<R>>

    /**
     * Requisição HTTP POST para o Axios
     * @template T - Tipo da data que será enviada para a requisição
     * @template R - Tipo do corpo que será retornado na requisição
     * @param {T} data - Corpo da requisição
     * @param {string} path - Caminho da requisição a partir do `this.route`
     * @param {AxiosRequestConfig} [config] - Configurações opcionais da requisição
     * @returns {Promise<AxiosResponse<R>>} - Promise com a resposta da requisição
     * 
     * @example
     * // Suponha que você tem uma rota usuários e quer fazer login
     * 
     * interface User {
     *  email: string,
     *  password: string
     * }
     * 
     * const user: User = {
     *  email: 'jhondoe@gmail.com',
     *  password: '12345'
     * }
     * 
     * const api = new APISource('/user')
     * api.post<User>('login', user).then(resp=>console.log(resp))
     */
    post<T, R extends ApiDefaultResponse = ApiDefaultResponse>(data: T, path: string, config?: AxiosRequestConfig): Promise<AxiosResponse<R>>

    /**
     * Requisição HTTP PATCH para o Axios
     * @template T - Tipo da data que será enviada para a requisição
     * @template R - Tipo do corpo que será retornado na requisição
     * @param {T} data - Corpo da requisição
     * @param {string} path - Caminho da requisição a partir do `this.route`
     * @param {AxiosRequestConfig} [config] - Configuração da requisição
     * @returns {Promise<AxiosResponse<R>>} - Promise com a resposta da requisição
     * 
     * @example
     * // Suponha que queiramos atualizar o email de um usuário, poderíamos fazer algo como:
     * interface UserPatchInterface {
     *  email?: string
     *  password?: string
     *  name?: string
     * }
     * 
     * const api = new APISource('/users')
     * api.patch<UserPatchInterface>({
     *  email: 'jhondoe'
     * }).then(resp => console.log(resp))
     */
    patch<T, R extends ApiDefaultResponse = ApiDefaultResponse>(data: T, path: string, config?: AxiosRequestConfig): Promise<AxiosResponse<R>>

    /**
     * Requisição HTTP PUT para o Axios
     * @template T - Tipo da data que será enviada para a requisição
     * @template R - Tipo do corpo que será retornado na requisição
     * @param {T} data - O corpo da requisição
     * @param {string} path - Caminho da requisição a partir do `this.route`
     * @param {AxiosRequestConfig} [config] - Configuração da requisição
     * @returns {Promise<AxiosResponse>} - Promise com a resposta da requisição
     * 
     * @example
     * // Suponha que precisamos fazer um put em um item específico, vamos
     * // adicionar uma propriedade 'data-compra', então acessamos a rota put
     * // /items/{id}
     * const api = new APISource('/items')
     * cont itemID = 15
     * api.put<{ 'data-compra': string }>({
     *  'data-compra': new Date().toISOString().split('T')[0]
     * }, `{itemID}`)
     */
    put<T, R extends ApiDefaultResponse = ApiDefaultResponse>(data: T, path: string, config?: AxiosRequestConfig): Promise<AxiosResponse<R>>

    /**
     * Requisição HTTP DELETE para o Axios
     * @template R - Tipo do corpo que será retornado na requisição
     * @param {string} path - Camiho da requisição a partir do `this.route`
     * @param {AxiosRequest} [config] - Configuração da requisição
     * @returns {Promise<AxiosResponse>} - Promise com a resposta da requisição
     * 
     * @example
     * // Suponha que queiramos deletar um item específico na rota delete /item/{id}
     * const api = new APISource('/item')
     * const itemID = 10
     * api.delete(`{itemID}`).then(resp=>console.log(resp))
     */
    delete<R extends ApiDefaultResponse = ApiDefaultResponse>(path: string, config?: AxiosRequestConfig): Promise<AxiosResponse<R>>
}