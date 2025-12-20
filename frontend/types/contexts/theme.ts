import type { Dispatch, SetStateAction } from 'react'

/**
 * Interface que descreve o objeto retornado pelo Provider do TEMA da aplicação
 */
export interface ThemeProviderInterface {
    theme: 'light'|'dark',
    setTheme: Dispatch<SetStateAction<'light'|'dark'>>
}
