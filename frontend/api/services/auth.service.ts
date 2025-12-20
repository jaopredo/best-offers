// import ErrorStoreManager from "@/errors"
import { ApiDefaultResponse, ApiError } from "@/types/api"
import APISource from "../source"
import ErrorStoreManager from "@/alerts/errors"
import SuccessStoreManager from "@/alerts/successes"

/* TIPOS */
import { UserLoginInterface, UserRegisterInterface, AuthServiceInterface, UserApiResponse, User } from "@/types/api/services/auth.service"


export default class AuthService implements AuthServiceInterface {
    source = new APISource('auth')

    async register (data: UserRegisterInterface) {
        try {
            const response = await this.source.post<UserRegisterInterface, UserApiResponse>(data, 'register')
            return response
        } catch (e: unknown) {
            throw new Error('Não Implementado')
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
            return await this.source.post<UserLoginInterface, UserApiResponse>(data, `login`)
        } catch (e: unknown) {
            throw new Error('Não implementado')
        }
    }
}
