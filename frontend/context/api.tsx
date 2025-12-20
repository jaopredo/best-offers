'use client'
import { createContext, useContext } from "react"

/* SERVIÇOS DA API */

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
