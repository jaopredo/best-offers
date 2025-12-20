import { AxiosRequestConfig } from "axios"

/**
 * Função responsável por buscar o token armazenado localmente e retornar um objeto
 * de configuração do Axios contendo o token no cabeçalho de autorização
 * @param {AxiosRequestConfig} config A configuração padrão que já existe (Opcional)
 * @returns {AxiosRequestConfig} Retorna o objeto de configuração do axios com o
 * token no cabeçaho de autorização
 */
export function updateRequestHeaders(config: AxiosRequestConfig|undefined): AxiosRequestConfig {
    const token = (typeof window !== 'undefined' ? localStorage.getItem('token') : '') as string
    return {
        ...config,
        headers: {
            ...config?config.headers:{},
            Authorization: `Bearer ${token}`
        }
    }
}