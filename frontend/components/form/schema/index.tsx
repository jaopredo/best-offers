import React, { Children, useEffect } from 'react'
import Input from '../input'
import Password from '../password'
import Select from '../select'

import { SchemaType, SchemaProps } from "@/types/components/schema"

import type { InputProps } from '@/types/components/input'
import type { PasswordProps } from '@/types/components/password'
import type { SelectProps } from '@/types/components/select'

const components = {
    password: (schema: InputProps) => <Password {...schema as any}/>,
    select: (schema: SelectProps) => <Select {...schema}/>
}

export default function Schema(props: SchemaProps) {
	const inputTypes = [
        'email',
        "text",
        "number",
        "range",
        "date",
        "time",
        "color",
        "submit",
        "reset",
        "button",
        "tel",
    ]


	return <>
		{props.schema.map((schema, idx) => {
            if (!schema) return

			if (inputTypes?.indexOf(schema.formtool)!==-1) {
				return <Input
                    key={idx}
                    type={schema.formtool}
                    {...schema as InputProps}
                />
			} else if (Object.keys(components).indexOf(schema.formtool)!==-1) {
				return components[schema.formtool]
			}
		})}
	</>
}
