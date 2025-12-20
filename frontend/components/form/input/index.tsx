import Wrapper from '../wrapper'
import { useFormContext } from 'react-hook-form'

/* FUNÇÕES DE UTILIDADE */
import { getWrapperProperties, removeWrapperProperties } from '@/utils/component'

/* TIPOS */
import type { InputProps } from '@/types/components/input'

/**
 * Componente de Input separado para melhor padronização dos formulários
 * (Por conta do componente Wrapper que envolve o input em si)
 */
export default function Input(props: InputProps) {
	const form = useFormContext()  // Pego o contexto do formulário

	return <Wrapper {...getWrapperProperties<InputProps>(props)}>
		<input
            {...removeWrapperProperties(props)}
            {...form.register(props.name, props.validation)}
            className={props.className||''}
            name={props.name}
        />
	</Wrapper>
}
