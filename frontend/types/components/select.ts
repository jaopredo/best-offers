import { DefaultProps, OmitedProps } from "./wrapper"

export type OptionType = {
	label: string,
	value: string
}

export type SelectBaseProps = Omit<DefaultProps, 'aftericon'> & OmitedProps<HTMLSelectElement> & {
    defaultSelectValue?: OptionType
    
    selectOptionsClassName?: string
    selectOptionClassName?: string
    selectLoadClassName?: string
}
export type SelectProps = |(SelectBaseProps & {
    type: 'options'
	options: OptionType[]
}) | (SelectBaseProps & {
    type: 'async'
	asyncLoad: () => Promise<string>
})