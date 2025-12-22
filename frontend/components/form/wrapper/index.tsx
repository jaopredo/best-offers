import { useFormContext } from 'react-hook-form'
import { WrapperProps } from '@/types/components/wrapper'

/**
 * O meu componente Wrapper usado para manter uma estrutura 
 */
export default function Wrapper({
    children,
    label,
    name,
    help,
    beforeicon,
    aftericon,

    containerClassName: containerclassname,
    labelClassName: labelclassname,
    insiderClassName: insiderclassname,
    beforeIconClassName: beforeIconclassname,
    afterIconClassName: afterIconclassname,
    helpClassName: helpclassname,
    errorClassName: errorclassname
}: WrapperProps) {
    // Pegando os erros do formulário
	const { formState: { errors } } = useFormContext()

    // Aqui eu retorno uma estrutura de input específica
    //
    //  container
    //  ├── label
    //  ├── insider
    //  │   ├── before-icon
    //  │   ├── {content}
    //  │   └── after-icon
    //  ├── help
    //  └── errors
    //
    
	return <div className={`container ${containerclassname||''}`}>
		<label className={`label ${labelclassname||''}`} htmlFor={name}>{ label }</label>
		<div className={`insider ${insiderclassname||''}`}>
			{beforeicon && <div className={`before-icon ${beforeIconclassname||''}`}>
				{beforeicon}
			</div>}
			{children}
			{aftericon && <div className={`after-icon ${afterIconclassname||''}`}>
				{aftericon}
			</div>}
		</div>
		{help && <p className={`help ${helpclassname||''}`}>{ help }</p>}
		{errors[name] && <p className={`errors ${errorclassname||''}`}>{errors[name]?.message as string}</p>}
	</div>
}
