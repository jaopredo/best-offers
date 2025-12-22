'use client'
import { useContext, createContext, useState } from "react"

/* TIPOS */
import type { ReactNode } from 'react'
import type { ThemeProviderInterface } from "@/types/contexts/theme"

// Contexto to TEMA
const ThemeContext = createContext<ThemeProviderInterface|null>(null)

/**
 * O PROVIDER que vai fornecer para a aplicação o tema da aplicação e o método
 * para alterar o tema
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
    const [ theme, setTheme ] = useState<'light'|'dark'>('dark')

    return <ThemeContext.Provider value={{
        theme,
        setTheme
    }}>
        {children}
    </ThemeContext.Provider>
}

/**
 * Função que usa o contexto do tema (Retorna CLARO ou ESCURO)
 */
export function useThemeContext(): ThemeProviderInterface {
    return useContext(ThemeContext) as ThemeProviderInterface
}
