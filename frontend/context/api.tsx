'use client'
import { createContext, useContext } from "react"

/* SERVIÇOS DA API */
import AdapterService from "@/api/services/adapter.service"
import AuthService from "@/api/services/auth.service"
import CategoryService from "@/api/services/category.service"
import FontService from "@/api/services/font.service"
import ItemService from "@/api/services/item.service"
import JobService from "@/api/services/job.service"
import ScrappingService from "@/api/services/scrapping.service"

/* TIPOS */
import type { ReactNode } from 'react'
import type { APIProviderInterface } from "@/types/contexts/api"


const APIContext = createContext<APIProviderInterface|null>(null)

/**
 * Componente responsável por providenciar um contexto contendo todos os serviços
 * da API
 */
export function APIProvider({ children }: { children: ReactNode }) {
    return <APIContext.Provider value={{
        adapterService: new AdapterService(),
        authService: new AuthService(),
        categoryService: new CategoryService(),
        fontService: new FontService(),
        itemService: new ItemService(),
        jobService: new JobService(),
        scrappingService: new ScrappingService(),
    }}>
        {children}
    </APIContext.Provider>
}

/**
 * Função que pode ser chamada em qualquer lugar da aplicação para utilização do
 * contexto fornecido pela API
 */
export function useAPIContext(): APIProviderInterface {
    return useContext(APIContext) as APIProviderInterface
}
