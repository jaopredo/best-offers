import { AdapterServiceInterface } from "../api/services/adapter.service"
import { AuthServiceInterface } from "../api/services/auth.service"
import { CategoryServiceInterface } from "../api/services/category.service"
import { FontServiceInterface } from "../api/services/font.service"
import { ItemServiceInterface } from "../api/services/item.service"
import { JobServiceInterface } from "../api/services/job.service"
import { ScrappingServiceInterface } from "../api/services/scrapping.service"

/**
 * Interface que descreve toda a estrutura do objeto fornecido pelo
 * Provider da API (Pasta Contexts)
 */
export interface APIProviderInterface {
    authService: AuthServiceInterface
    adapterService: AdapterServiceInterface
    categoryService: CategoryServiceInterface
    itemService: ItemServiceInterface
    fontService: FontServiceInterface
    jobService: JobServiceInterface
    scrappingService: ScrappingServiceInterface
}
