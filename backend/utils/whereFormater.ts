import { FindOptionsWhere, ILike } from "typeorm"

/**
 * Essa função recebe um payload e adapta seus parâmetros para serem passados como
 * um ILike na cláusula where de uma requisição do TypeORM
 * @param payload O payload que será adaptado
 */
export function whereFormater<T>(payload: Partial<T>) {
    const where: FindOptionsWhere<T> = {}

    for (const [key, value] of Object.entries(payload)) {
        if (typeof value === 'string') {
            where[key] = ILike(`%${value}%`)
        } else {
            where[key] = value
        }
    }

    return where
}
