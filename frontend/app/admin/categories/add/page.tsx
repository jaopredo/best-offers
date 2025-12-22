'use client'
import { useState } from 'react'
import { FormProvider, useForm, SubmitHandler } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'

/* COMPONENTES */
import Schema from '@/components/form/schema'
import { AiOutlineLoading } from "react-icons/ai"

/* CONTEXTOS */
import { useAPIContext } from '@/context/api'
import { useThemeContext } from "@/context/theme"

/* TIPOS */
import { Category, CategoryRegisterInterface } from '@/types/api/services/category.service'

/* UTILS */
import { themeSetup } from "@/utils/theme"


export default function CategoriesPage() {
	const router = useRouter()

	/* State pra indicar que ta carregando a resposta */
	const [ loading, setLoading ] = useState<boolean>(false)

    /* Serviço associado */
	const { categoryService } = useAPIContext()

	/* Tema */
	const { theme } = useThemeContext()

	/* Formulário */
	const methods = useForm()

	const onSubmit: SubmitHandler<CategoryRegisterInterface> = (data) => {
		setLoading(true)
		categoryService.create(data).then(resp => {
			setLoading(false)
			router.back()
		}).catch(err => setLoading(false))
	}

	return <div className={`
		p-5 rounded-md h-full flex flex-col items-stretch
		${themeSetup('bg-slate-100', 'bg-[#141d2d]', theme)}
	`}>
		<h1 className={`
			text-3xl font-bold self-start
			${themeSetup(
	            'text-[#004E81]',
	            'text-stone-200',
	            theme
	        )}
		`}>Criar Categoria</h1>
		<FormProvider {...methods}>
			<form className='flex flex-col gap-2' onSubmit={methods.handleSubmit(onSubmit)}>
				<Schema
					schema={[
						{
							formtool: 'text',
							name: 'name',
							label: 'Nome',
							labelClassName: `transition-colors ${themeSetup(
					            'text-[#004E81]',
					            'text-stone-200',
					            theme
					        )}`,

					        insiderClassName: `transition-colors shadow-md/20 rounded-sm flex items-center p-2 gap-2 ${themeSetup(
					            'bg-[#F0F0F0]',
					            'bg-[#112838]',
					            theme
					        )}`,

					        className: `transition-colors outline-none w-full text-md ${themeSetup(
					            'text-black',
					            'text-white',
					            theme
					        )}`,

					        errorClassName: `transition-colors font-bold text-xs mt-2 ${themeSetup(
					            'text-rose-500',
					            'text-red-300',
					            theme
					        )}`,

					        helpClassName: `transition-colors font-semibold text-xs mt-1 ${themeSetup(
					            'text-gray-600',
					            'text-gray-300',
					            theme
					        )}`
						}
					]}
				/>

				<motion.button
                    type="submit"
                    disabled={loading}
                    className={`
                        transition-colors
                        text-white
                        p-2
                        rounded-md
                        mr-auto
                        ml-auto
                        w-[60%]
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
                    whileHover={{ scale: loading ? 1 : 1.05 }} whileTap={{ scale: .95 }}
                >
                    {loading && <AiOutlineLoading className='animate-spin' />}
                    Criar
                </motion.button>
			</form>
		</FormProvider>
	</div>
}
