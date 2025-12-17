import { PaginationQueryParams } from "types/pagination/pagination.dto";

/**
 * Pega as informações de paginação e remove o limite e a página para que possa pegar as outras
 * informações para a busca
 * @param pagination Objeto de paginação
 * @returns Objeto que pode ser utilizado como where pelo typeorm
 */
export function cleanPagination<T extends PaginationQueryParams>(pagination: T) {
    const where: Partial<T> = {
        ...pagination,
        limit: undefined,
        page: undefined
    }
    delete where.limit
    delete where.page

    return where
}
