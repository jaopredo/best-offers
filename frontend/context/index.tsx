/* TIPOS */
import type { ReactNode } from "react"

/* PROVIDERS */
import { APIProvider } from "./api"
import { ThemeProvider } from "./theme"

export default function ContextsProvider({ children }: { children: ReactNode }) {
    /**
     * Componente responsável por unir todos os provedores do meu site
     */
    return (
        <APIProvider>
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </APIProvider>
    )
}