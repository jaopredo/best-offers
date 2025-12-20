import React, { useState, useEffect} from 'react'
import Wrapper from '../wrapper'
import { useFormContext } from 'react-hook-form'
import { IoIosArrowDown } from "react-icons/io"

import { getWrapperProperties } from '@/utils/component'

/* TIPOS */
import { SelectProps, OptionType } from '@/types/components/select'


export function Select (props: SelectProps) {
	const { register, setValue } = useFormContext()
	const [ showDropdown, setShowDropdown ] = useState<boolean>(false)
	const [ inputLabel, setInputLabel ] = useState<string>('')

	const [ options, setOptions ] = useState<OptionType[]|undefined>(props.type == 'options' ? props.options : [])

	const handleClickSelect = () => setShowDropdown(!showDropdown)
	const handleClickOption = (label: string, value: string) => {
		setInputLabel(label)
		setShowDropdown(false)
		setValue(props.name, value)
	}

	useEffect(() => {
        if (props.defaultSelectValue) {
            handleClickOption(props.defaultSelectValue.label, props.defaultSelectValue.value)
        }
	}, [])

	return <Wrapper {...getWrapperProperties(props)}
	aftericon={<IoIosArrowDown onClick={handleClickSelect}/>}>
		<input className={`input ${props.className||''}`} placeholder={props.placeholder} value={inputLabel} readOnly {...register(props.name, props.validation)} onClick={handleClickSelect}/>
		{showDropdown && <ul className={`select-options ${props.selectOptionsClassName||''}`}>
			{
				options && options.map((opt, idx) =>
					<li
						key={idx}
						className={`select-option ${props.selectOptionClassName||''}`}
						onClick={() => handleClickOption(opt.label, opt.value)}
					>{opt.label}</li>
				)
			}
			{!options && <p className={`select-load ${props.selectLoadClassName||''}`}>Carregando...</p>}
			{props.children}
		</ul>}
	</Wrapper>
}
