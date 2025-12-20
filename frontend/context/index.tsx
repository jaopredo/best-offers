/* TIPOS */
import type { ReactNode } from "react"

/* PROVIDERS */
import { APIProvider } from "./api"

export default function ContextsProvider({ children }: { children: ReactNode }) {
    /**
     * Componente responsável por unir todos os provedores do meu site
     */
    return (
        <APIProvider>
            {children}
        </APIProvider>
    )
}