import { Dispatch, SetStateAction } from 'react'
import { FormProvider, useForm, SubmitHandler } from 'react-hook-form'
import { motion } from 'motion/react'

/* COMPONENTES */
import Schema from '@/components/form/schema'
import { IoMdClose } from "react-icons/io"

/* TIPOS */
import { SchemaProps } from '@/types/components/schema'
import { Pagination } from "@/types/api"

/* CONTEXTOS */
import { useThemeContext } from "@/context/theme"

/* UTILS */
import { themeSetup } from "@/utils/theme"


export type FilterProps<T extends Pagination> = SchemaProps & {
	show: boolean,
	setShow: Dispatch<SetStateAction<boolean>>
	setPagination: Dispatch<SetStateAction<T>>
	pagination: T
}


export default function Filter<T extends Pagination>({
	schema,
	show,
	setShow,
	pagination,
	setPagination
}: FilterProps<T>) {
	const methods = useForm()

	const { theme } = useThemeContext()

	const onSubmit: SubmitHandler<T> = (data) => {
		setShow(false)

		const filteredData = Object.fromEntries(
			Object.entries(data).map(
				([key, value]) => value === '' ? [key, undefined] : [key, value]
			)
		)

		setPagination({
			...pagination,
			...filteredData
		})
	}

	return <>
		<div
			className={`
				fixed left-0 top-0 block w-[100vw] h-[100vh] bg-black/50 md:hidden
				${show ? 'visible' : 'hidden'}
			`}
		/>
		<div className={`
			transition-all w-[90%] p-5

			fixed top-1/2 left-1/2 -translate-1/2 rounded-md

			md:absolute md:w-fit md:top-0 md:bottom-auto md:left-auto md:h-full md:right-0
			md:-translate-y-0 md:block md:rounded-none

			${show ? 'block md:translate-x-0' : 'hidden md:translate-x-[100%]'}
			${themeSetup('bg-gray-100', 'bg-[#1b212b]', theme)}
		`}>
			<button onClick={() => setShow(false)}>
				<IoMdClose className={`
					mr-0 ml-auto hover:cursor-pointer
					${themeSetup('text-[#004E81]', 'text-white', theme)}
				`} size={20}/>
			</button>
			<FormProvider {...methods}>
				<form onSubmit={methods.handleSubmit(onSubmit)} className='flex flex-col items-stretch justify-center gap-4'>
					<Schema schema={schema}/>

					<motion.button
	                    type="submit"
	                    className={`
	                        transition-colors
	                        text-white
	                        p-2
	                        rounded-md
	                        hover:cursor-pointer
	                        flex
	                        gap-2
	                        items-center
	                        justify-center
	                        disabled:hover:cursor-auto
	                        ${themeSetup(
	                            'bg-[#004E81] hover:bg-[#005E9B] active:bg-[#003558] disabled:bg-blue-400',
	                            'bg-sky-400 hover:bg-sky-500 active:bg-sky-600 disabled:bg-sky-200',
	                            theme
	                        )}
	                    `}
	                    whileHover={{ scale: 1.05 }} whileTap={{ scale: .95 }}
	                >
	                    APLICAR
	                </motion.button>

	                <motion.button
	                    type="button"
	                    onClick={() => {
	                    	methods.reset()
	                    	setPagination({
	                    		page: pagination.page,
	                    		limit: pagination.limit
	                    	})
	                    }}
	                    className={`
	                        transition-colors
	                        p-2
	                        rounded-md
	                        hover:cursor-pointer
	                        flex
	                        gap-2
	                        w-full
	                        items-center
	                        justify-center
	                        disabled:hover:cursor-auto
	                        flex items-center justify-center gap-2 p-2 rounded-sm bg-white ring-1 ring-offset-1 hover:bg-gray-100
	                        font-bold self-end
	                    `}
	                    whileHover={{ scale: 1.05 }} whileTap={{ scale: .95 }}
	                >
	                    LIMPAR
	                </motion.button>
				</form>
			</FormProvider>
		</div>
	</>
}
