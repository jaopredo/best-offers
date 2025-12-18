import { Adapter } from "database/models/adapter"
import { Category } from "database/models/category"

/**
 * Função que recebe um adaptador e uma categoria e, com base nessas informações passadas, monta
 * a URL de pesquisa que será utilizada para pegar os dados
 * @param {Adapter} adapter Adaptador
 * @param {Category} category Categoria
 * @returns URL formatada para ser utilizada pelo axios para o scrapping
 */
export function searchBuilder(adapter: Adapter, category: Category) {
    if (adapter.searchURL.includes('{}')) {
        const categoryNameArray = category.name.split(' ').join(adapter.sep)
        const url = adapter.searchURL.replace('{}', categoryNameArray)
        return url
    } else if (adapter.searchParameter) {
        const url =
            adapter.searchURL + (adapter.searchURL.endsWith('/') ? '' : '/') +
            `?${adapter.searchParameter}=${encodeURIComponent(category.name.split(' ').join(adapter.sep))}`
        return url
    }
}
