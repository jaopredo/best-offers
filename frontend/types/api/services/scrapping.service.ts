import { ApiDefaultResponse } from ".."
import { APISourceInterface } from "../source"
import { AxiosResponse } from "axios"

import { FontRegisterInterface } from "./font.service"
import { AdapterRegisterInterface } from "./adapter.service"
import { Job } from "./job.service"


/* INTERFACE DO REGISTRO DE UM SCRAPPING */
export type ScrappingRegisterInterface = ({
    font: Omit<FontRegisterInterface, 'adapterId'>,
    adapter: AdapterRegisterInterface
})|({
    fontId: number
})

/* RESPOSTA PADRÃO DAS ROTAS DO SCRAPPING */
export type ScrappingApiResponse = ApiDefaultResponse<{ jobs: Job[] }>

/* INTERFACE DO SERVIÇO DOS SCRAPPINGS */
export interface ScrappingServiceInterface {
    source: APISourceInterface

    /* MÉTODOS BÁSICOS */
    /**
     * Método para realizar o registro de um scrapping no sistema (Cria vários jobs para realizar o scrapping de acordo
     * com as informações passadas no corpo da requisição)
     * @param {ScrappingRegisterInterface} data - As informações do novo scrapping
     * @returns {Promise<AxiosResponse<ScrappingApiResponse>>} - Promise com a resposta da requisição
     */
    create (data: ScrappingRegisterInterface): Promise<AxiosResponse<ScrappingApiResponse>>
}
