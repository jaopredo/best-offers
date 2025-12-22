import { Dispatch, SetStateAction, useMemo } from 'react'

/* COMPONENTES */
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"

/* TIPOS */
import { PaginationMeta, Pagination } from "@/types/api"

/* CONTEXTOS */
import { useThemeContext } from "@/context/theme"

/* UTILS */
import { themeSetup } from "@/utils/theme"


export type PaginationProps<T extends Pagination> = PaginationMeta & {
	setPagination: Dispatch<SetStateAction<T>>
	pagination: T,
	meta: PaginationMeta
}


export default function PaginationSection<T extends Pagination>({
	setPagination,
	pagination,
	meta
}: PaginationProps<T>) {
	const { theme } = useThemeContext()

	const pages = useMemo(() => {
		const total = meta.totalPages
		const current = meta.page
		const result: (number | string)[] = []

		if (total <= 5) {
			for (let i = 1; i <= total; i++) {
				result.push(i)
			}
			return result
		}

		result.push(1)

		if (current > 3) {
			result.push('...')
		}

		for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
			result.push(i)
		}

		if (current < total - 2) {
			result.push('...')
		}

		result.push(total)

		return result
	}, [meta.page, meta.totalPages])


	function goNext() {
		if (pagination.page == meta.totalPages) return
		setPagination({
			...pagination,
			page: pagination.page+1
		})
	}

	function goPrevious() {
		if (pagination.page == 1) return
		setPagination({
			...pagination,
			page: pagination.page-1
		})
	}


	return <div className={`
		border-t w-full flex items-center justify-between
		${themeSetup('border-t-gray-700', 'border-t-gray-500', theme)}
	`}>
		<button className={`
			flex items-center justify-center gap-2 p-2 hover:cursor-pointer hover:border-t-2
			${themeSetup('text-gray-700 hover:text-black hover:border-t-gray-700 hover:border-t-2', 'text-gray-400 hover:text-white hover:border-t-white', theme)}
		`} onClick={goPrevious}>
			<FaArrowLeft/>
			<p className='hidden md:block'>Anterior</p>
		</button>


		<menu className={`
			flex items-center justify-center gap-2
		`}>
			{pages.map((page, idx) => <li
				onClick={() => page != '...' && setPagination({...pagination, page })}

				className={`p-2 ${page == meta.page ? themeSetup(
					'text-indigo-600 border-t-indigo-600 border-t-2 font-bold',
					'text-sky-600 border-t-sky-600 border-t-2 font-bold',
					theme
				) : themeSetup(
					`text-gray-600 ${page != '...' && 'hover:border-t-2 hover:border-t-gray-600 hover:font-bold hover:cursor-pointer'}`,
					`text-white ${page != '...' && 'hover:border-t-2 hover:font-bold hover:cursor-pointer'}`,
					theme
				)}`} key={idx}
			>
				{page}
			</li>)}
		</menu>


		<button className={`
			flex items-center justify-center flex-row-reverse gap-2 p-2 hover:cursor-pointer hover:border-t-2
			${themeSetup('text-gray-700 hover:text-black hover:border-t-gray-700 hover:border-t-2', 'text-gray-400 hover:text-white hover:border-t-white', theme)}
		`} onClick={goNext}>
			<FaArrowRight/>
			<p className='hidden md:block'>Próximo</p>
		</button>
	</div>
}
