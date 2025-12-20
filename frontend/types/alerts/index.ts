
export type Listener = () => void

/**
 * Interface da estrutura responsável pelo gerenciamento dos erros da aplicação
 */
export default interface AlertStoreInterface {
    /* Propriedade contendo os erros armazenados */
    data: Map<number, string>
    /* Propriedade contendo os listeners que vão ser utilizados */
    listeners: Set<Listener>

    /**
     * Função que armazena um erro dentro da estrutura interna
     * @param {string} message Mensagem de erro que será armazenada
     */
    set: (message: string) => void

    /**
     * Deleta uma mensagem que foi armazenada
     * @param {number} id ID da mensagem que vai ser deletada
     */
    delete: (id: number) => void

    /**
     * Pega uma mensagem de erro específica
     * @param {number} id ID da mensagem que será mostrada
     * @returns {string|undefined} A mensagem de erro associada ao ID passado (Ou nada se não for encontrada)
     */
    get: (id: number) => string | undefined

    /**
     * Função que recebe um listener e executa ele sempre que há alteração na estrutura de erros
     * @param {Listener} listener Função que vai ser executada para detecção da alteração
     */
    onChange: (listener: Listener) => () => boolean
}
