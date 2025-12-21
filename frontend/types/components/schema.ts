import { InputProps } from './input'
import { PasswordProps } from './password'
import { SelectProps } from './select'

/* TIPOS DO INPUT */
export type InputTypes = 'email'|
"text"|
"number"|
"range"|
"date"|
"time"|
"color"|
"submit"|
"reset"|
"button"|
"email"|
"tel"|
'password' 

export interface InputSchemaProps extends InputProps {
    formtool: InputTypes
}

/* TIPOS DOS OUTROS ELEMENTOS */
export type ElementsTypes = "checkbox" |
'select' |
'search' |
'file' |
'mask' |
'radio' |
'toggle' |
'taglist' |
'group'

// Select
export type SelectSchemaProps = SelectProps & {
    formtool: 'select'
}

/* TIPOS DO SCHEMA */
export type SchemaType<CustomComponentsProps extends DefaultProps = DefaultProps>  = InputSchemaProps |
    SelectSchemaProps

export interface SchemaProps<D = DefaultProps> {
	schema: SchemaType<D>[]
}
