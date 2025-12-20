import { AxiosRequestConfig, AxiosResponse } from "axios"
import AxiosInstance from ".."
import { updateRequestHeaders } from "@/functions"

/* TIPOS */
import type { APISourceInterface } from '@/types/api/source'
import { ApiDefaultResponse } from "@/types/api"


export default class APISource implements APISourceInterface {
    route = ''

    /**
     * Construtor da classe. Recebe um parâmetro de rota para padronizar um grupo de rotas
     * @constructor
     * @param {string} route Nome do caminho que agrupa as rotas
     */
    constructor(route: string = '') {
        this.route = route
    }

    public get<R = ApiDefaultResponse>(path: string = '', config?: AxiosRequestConfig): Promise<AxiosResponse<R>> {
        config = updateRequestHeaders(config)
        return AxiosInstance.get<R>(`${this.route}${path && '/'+path}`, config)
    }

    public post<T, R = ApiDefaultResponse>(data: T, path: string='', config?: AxiosRequestConfig): Promise<AxiosResponse<R>> {
        config = updateRequestHeaders(config)
        return AxiosInstance.post<R>(`${this.route}/${path}`, data, config)
    }

    public patch<T, R = ApiDefaultResponse>(data: T, path: string = '', config?: AxiosRequestConfig): Promise<AxiosResponse<R>> {
        config = updateRequestHeaders(config)
        return AxiosInstance.patch<R>(`${this.route}/${path}`, data, config)
    }

    public put<T, R = ApiDefaultResponse>(data: T, path: string = '', config?: AxiosRequestConfig): Promise<AxiosResponse<R>> {
        config = updateRequestHeaders(config)
        return AxiosInstance.put<R>(`${this.route}/${path}`, data, config)
    }

    public delete<R = ApiDefaultResponse>(path: string, config?: AxiosRequestConfig): Promise<AxiosResponse<R>> {
        config = updateRequestHeaders(config)
        return AxiosInstance.delete<R>(`${this.route}/${path}`, config)
    }
}
