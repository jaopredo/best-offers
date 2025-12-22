import React, { useState } from 'react'
import { PasswordProps } from '@/types/components/password'
import Wrapper from '../wrapper'
import { useFormContext } from 'react-hook-form'
import { IoMdEye, IoMdEyeOff } from "react-icons/io"

import { getWrapperProperties, removeWrapperProperties } from '@/utils/component'

export default function Password(props: PasswordProps) {
	const [ show, setShow ] = useState<boolean>(false)
	const { register } = useFormContext()
	function onPasswordIconClick() {
		setShow(!show)
	}

	return <Wrapper {...getWrapperProperties(props)}
		aftericon={
			show?(
				props.stateshowicon?
					props.stateshowicon({ onClick: onPasswordIconClick }):
					<IoMdEye onClick={onPasswordIconClick} className={props.showIconClassName}/>
				):(
				props.statehideicon?
					props.statehideicon({ onClick: onPasswordIconClick }):
					<IoMdEyeOff onClick={onPasswordIconClick} className={props.hideIconClassName}/>
			)
		}
	>
		<input
            {...removeWrapperProperties(props)}
            {...register(props.name, props.validation)}
            type={show?'text':'password'}
            className={props.className||''}
            name={props.name}
        />
	</Wrapper>
}