import APISource from '../source'

/* TIPOS */
import {
    ScrappingApiResponse,
    ScrappingRegisterInterface,
    ScrappingServiceInterface
} from "@/types/api/services/scrapping.service"


export default class ScrappingService implements ScrappingServiceInterface {
    source = new APISource('scrapping')

    async create (data: ScrappingRegisterInterface) {
        try {
            return await this.source.post<ScrappingRegisterInterface, ScrappingApiResponse>(data)
        } catch (e: unknown) {
            throw new Error('Não Implementado')
        }
    }
}
