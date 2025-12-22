// import ErrorStoreManager from "@/errors"
import { ApiDefaultResponse, ApiError } from "@/types/api"
import APISource from "../source"

/* ALERT MANAGERS */
import ErrorStoreManager from "@/alerts/errors"
import SuccessStoreManager from "@/alerts/successes"

/* UTILS */
import { alertSetup } from "@/utils/alerts"

/* TIPOS */
import { UserLoginInterface, UserRegisterInterface, AuthServiceInterface, UserApiResponse, User } from "@/types/api/services/auth.service"


export default class AuthService implements AuthServiceInterface {
    source = new APISource('auth')

    async register (data: UserRegisterInterface) {
        try {
            const response = await this.source.post<UserRegisterInterface, UserApiResponse>(data, 'register')
            alertSetup(response.data.message, SuccessStoreManager)
            return response
        } catch (e: unknown) {
            const err = e as ApiError
            alertSetup(err.response?.data.message || 'Erro Desconhecido', ErrorStoreManager)
        }
    }

    async registerAdmin (data: UserRegisterInterface) {
        try {
            return await this.source.post<UserRegisterInterface, UserApiResponse>(data, 'registerAdmin')
        } catch (e: unknown) {
            throw new Error('Não implementado')
        }
    }

    async me () {
        try {
            return await this.source.get<ApiDefaultResponse<{ user: User }>>('me')
        } catch (e: unknown) {
            throw new Error('Não implementado')
        }
    }

    async login (data: UserLoginInterface) {
        try {
            // Tento fazer a chamada para a API de login
            const response = await this.source.post<UserLoginInterface, UserApiResponse>(data, `login`)
            alertSetup(response.data.message, SuccessStoreManager)
            return response
        } catch (e: unknown) {
            const err = e as ApiError
            alertSetup(err.response?.data.message || 'Erro Desconhecido', ErrorStoreManager)
        }
    }
}
