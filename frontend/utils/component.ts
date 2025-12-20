import { HTMLProps } from "react"
import { DefaultProps } from "@/types/components/wrapper"

/**
 * Função que pega todas as propriedades que são iguais às que meu componente `Wrapper`
 * utiliza para seu funcionamenteo
 * 
 * @template T - Tipo do componente que extende `DefaultProps`
 * @param {T} props - As propriedades completas do componente
 * @returns {DefaultProps} As propriedades específicas do meu componente `Wrapper`
 * 
 * @example
 * ```ts
 * const props = {
 *   name: 'campo',
 *   label: 'Nome',
 *   help: 'Informe seu nome completo',
 *   className: 'input-primary'
 * }
 *
 * const wrapperProps = getWrapperProperties(props)
 * // wrapperProps = { name, label, help }
 */
export function getWrapperProperties<T extends DefaultProps>(props: T): DefaultProps {
    const {
        name,
        label,
        aftericon,
        beforeicon,
        validation,
        help,

        containerClassName,
        labelClassName,
        insiderClassName,
        beforeIconClassName,
        afterIconClassName,
        helpClassName,
        errorClassName: errorsClassName
    } = props

    return ({
        name,
        label,
        aftericon,
        beforeicon,
        validation,
        help,

        containerClassName: containerClassName,
        labelClassName: labelClassName,
        insiderClassName: insiderClassName,
        beforeIconClassName: beforeIconClassName,
        afterIconClassName: afterIconClassName,
        helpClassName: helpClassName,
        errorClassName: errorsClassName
    })
}

/**
 * Remove do objeto de propriedades (`props`) todos os campos pertencentes ao wrapper
 * (como `label`, `help`, `containerClassName`, etc.) e retorna apenas as
 * propriedades nativas do elemento HTML correspondente.
 *
 * Útil para repassar as props originais a um componente HTML sem interferir
 * com as propriedades específicas do sistema de wrappers.
 *
 * @template T - Tipo das propriedades do componente que estendem `DefaultProps`.
 * @template E - Tipo do elemento HTML de destino (por exemplo, `HTMLInputElement`).
 *
 * @param {T} props - As propriedades originais do componente.
 * @param {string[]} [extras=[]] - Lista opcional de nomes de propriedades adicionais que também devem ser removidas.
 *
 * @returns {HTMLProps<E>} Um novo objeto contendo apenas as propriedades válidas para o elemento HTML.
 *
 * @example
 * ```ts
 * const props = {
 *   name: 'campo',
 *   label: 'Nome completo',
 *   type: 'text',
 *   placeholder: 'Digite aqui'
 * }
 *
 * const cleanProps = removeWrapperProperties<HTMLInputElement>(props)
 * // Resultado: { type: 'text', placeholder: 'Digite aqui' }
 * ```
 */
export function removeWrapperProperties<T extends DefaultProps, E extends HTMLElement>(props: T, extras: string[] = []): HTMLProps<E> {
    const keysList = [
        'name',
        'label',
        'aftericon',
        'beforeicon',
        'validation',
        'help',

        'containerClassName',
        'labelClassName',
        'insiderClassName',
        'beforeIconClassName',
        'afterIconClassName',
        'helpClassName',
        'errorClassName',

        'showIconClassName',
        'hideIconClassName',

        'statehideicon',
        'stateshowicon',

        ...extras
    ]
    const newObject: Record<string, unknown> = {}

    const filtered = Object.keys(props).filter(k => !keysList.includes(k))

    filtered.forEach(key => {
        newObject[key] = props[key as keyof DefaultProps]
    })

    return newObject as HTMLProps<E>
}