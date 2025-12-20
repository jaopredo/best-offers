import { AxiosResponse } from "axios"
import { APISourceInterface } from "../source"
import { ApiDefaultResponse } from ".."

export enum UserRolesEnum {
    ADMIN = 'admin',
    USER = 'user'
}

/* RESPOSTA PADRÃO DA API TANTO PARA O LOGIN QUANTO PARA O REGISTRO DE UM USUÁRIO */
export type UserApiResponse = ApiDefaultResponse<{ token: string }>


/* INTERFACES DO LOGIN */
/**
 * Interface do corpo da requisição de LOGIN de um USUÁRIO
 */
export interface UserLoginInterface {
    email: string,
    password: string
}

/* INTERFACES DO REGISTRO */
/**
 * Interface do corpo da requisição de REGISTRO de um USUÁRIO
 */
export interface UserRegisterInterface {
    name: string,
    email: string,
    password: string
}

export interface UserRegisterFormInterface extends UserRegisterInterface {
    confirmPassword: string
}

/* INTERFACE DO USUÁRIO */
export type User = Omit<UserRegisterInterface, 'password'> & {
    role: UserRolesEnum
}


/* INTERFACE DO SERVIÇO DE AUTENTIFICAÇÃO */
export interface AuthServiceInterface {
    source: APISourceInterface

    /* MÉTODOS BÁSICOS */
    /**
     * Método para realizar o registro de um usuário no sistema
     * @param {UserRegisterInterface} data - As informações do novo usuário
     * @returns {Promise<AxiosResponse<UserApiResponse>>} - Promise com a resposta da requisição
     */
    register: (data: UserRegisterInterface) => Promise<AxiosResponse<UserApiResponse>|undefined>


    /**
     * Método para registrar um administrador no sistema (Temporário, será removido posteriormente)
     * @param data Informações do admin
     * @returns {Promise<AxiosResponse<UserApiResponse>>}
     */
    registerAdmin(data: UserRegisterInterface): Promise<AxiosResponse<UserApiResponse>>


    /* MÉTODOS ESPECIAIS */
    /**
     * Método para realizar o login do usuário e obter o token
     * JWT de autenticação
     * @param {UserLoginInterface} data - As informações de login
     * @returns {Promise<AxiosResponse<UserApiResponse>>} - Promessa com a resposta da requisição com o token JWT
     */
    login(data: UserLoginInterface): Promise<AxiosResponse<UserApiResponse>>

    /**
     * Método que retorna as informações do próprio usuário
     * @returns {Promise<AxiosResponse<User>>} - Promessa com a resposta da requisição
     */
    me: () => Promise<AxiosResponse<ApiDefaultResponse<{ user: User }>>>
}
