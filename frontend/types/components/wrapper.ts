import type { HTMLProps, ReactNode, ReactElement } from 'react'
import type { RegisterOptions, FieldValues } from 'react-hook-form'

/**
 * Propriedades padrão de todo componente de formulário
 */
export interface DefaultProps {
	name: string,
	label: string,
	help?: string,
	beforeicon?: ReactElement,
	aftericon?: ReactElement,
	validation?: RegisterOptions<FieldValues, string>,

    // Propriedades de className
    containerClassName?: string
    labelClassName?: string
    insiderClassName?: string
    afterIconClassName?: string
    beforeIconClassName?: string
    helpClassName?: string
    errorClassName?: string
}

/**
 * Propriedades do componente `Wrapper`
 */
export interface WrapperProps extends DefaultProps {
	children: ReactNode,
}

/* Tipo que omite as propriedades passadas em `T` dentro do tipo `HTMLProps` */
export type OmitedProps<T> = Omit<HTMLProps<T>, keyof DefaultProps>