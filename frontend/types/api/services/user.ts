import { AxiosResponse } from "axios"
import { APISourceInterface } from "../source"

export type UserAccess = "usuario"|"administrador"|"moderador"

/* INTERFACES DA CRIAÇÃO DO USUÁRIO */
export interface UserCreationInterface {
    email: string
    password: string
    confirm_password: string
    user: string
    cargo: UserAccess
}

/* INTERFACES DA EDIÇÃO DO USUÁRIO */
export interface UserUpdateInterface {
    user: string
    cargo: UserAccess
}

/* INTERFACES DO LOGIN */
/**
 * Interface do corpo da requisição de LOGIN de um USUÁRIO
 */
export interface UserLoginInterface {
    email: string,
    password: string
}
export interface UserLoginInterfaceResponse {
    token: string
}

/**
 * Interface do corpo da requisição de REGISTRO de um USUÁRIO
 */
export interface UserRegisterInterface {
    user: string,
    email: string,
    password: string,
    cargo: UserAccess
}

/**
 * Interface de um usuário padrão
 */
export type User = Omit<UserRegisterInterface, 'password'> & {
    id: string
}


/* INTERFACE DO SERVIÇO DO USUÁRIO */
export interface UserServiceInterface {
    source: APISourceInterface

    /* MÉTODOS BÁSICOS */
    /**
     * Método para realizar o registro de um usuário no sistema
     * @param {UserRegisterInterface} data - As informações do novo usuário
     * @returns {Promise<AxiosResponse|undefined>} - Promesa com a resposta da requisição
     */
    register: (data: UserRegisterInterface) => Promise<AxiosResponse|undefined>

    /**
     * Função para recuperar ou uma lista com todos os usuários no sistema, ou com um usuário em específico
     * @param {number} [id] - ID de um usuário específico ou nulo, se for nulo, o retorno será uma lista de usuários
     * @returns {Promise<AxiosResponse<User|User[]>|undefined>} - Um usuário em específico ou uma lista de usuários
     */
    get: (id?: number) => Promise<AxiosResponse<User|User[]>|undefined>

    /**
     * Atualiza as informações de um usuário em específico
     * @param {string} id - ID do usuário que será atualizado
     * @param {UserUpdateInterface} data - Novas informações do usuário
     * @returns {Promise<AxiosResponse|undefined>} - Promise com a resposta da requisição
     */
    update: (id: string, data: UserUpdateInterface) => Promise<AxiosResponse|undefined>

    /**
     * Deleta um usuário baseado no ID passado
     * @param {string} id - ID do usuário que será deletado
     * @returns {Promise<AxiosResponse|undefined>} - Promise com a resposta da requisição
     */
    delete: (id: string) => Promise<AxiosResponse|undefined>


    /* MÉTODOS ESPECIAIS */
    /**
     * Método para realizar o login do usuário e obter o token
     * JWT de autenticação
     * @param {UserLoginInterface} data - As informações de login
     * @returns {Promise<AxiosResponse<UserLoginInterfaceResponse>>} - Promessa com a resposta da requisição com o token JWT
     */
    login: (data: UserLoginInterface) => Promise<AxiosResponse<UserLoginInterfaceResponse>|undefined>

    /**
     * Método que retorna as informações do próprio usuário
     * @returns {Promise<AxiosResponse<User>|undefined>} - Promessa com a resposta da requisição
     */
    me: () => Promise<AxiosResponse<User>|undefined>
}
