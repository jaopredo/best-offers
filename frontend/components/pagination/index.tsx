import { Dispatch, SetStateAction, useMemo } from 'react'

/* COMPONENTES */
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"

/* TIPOS */
import { PaginationMeta, Pagination } from "@/types/api"

/* CONTEXTOS */
import { useThemeContext } from "@/context/theme"

/* UTILS */
import { themeSetup } from "@/utils/theme"


export type PaginationProps = PaginationMeta & {
	setPagination: Dispatch<SetStateAction<Pagination>>
	pagination: Pagination,
	meta: PaginationMeta
}


export default function PaginationSection({
	setPagination,
	pagination,
	meta
}: PaginationProps) {
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
		if (pagination.page == pagination.totalPages) return
		setPagination({
			...pagination,
			page: pagination.page+1
		})
	}

	function goPrevious() {
		if (pagination.page == 0) return
		setPagination({
			...pagination,
			page: pagination.page-1
		})
	}


	return <div className={`
		border-t w-full flex items-center justify-between
		${themeSetup('border-t-gray-700', 'border-t-gray-500', theme)}
	`}>
		<button onClick={goPrevious} className={``}>
			<FaArrowLeft/>
			Anterior
		</button>


		<menu className={`
			flex items-center justify-center gap-2
		`}>
			{pages.map((page, idx) => <li
				onClick={() => page != '...' && setPagination({...pagination, page })}

				className={`p-2 ${page == meta.page ? themeSetup(
					'',
					'text-sky-600 border-t-sky-600 border-t-2 font-bold',
					theme
				) : themeSetup(
					'',
					`text-white ${page != '...' && 'hover:border-t-2 hover:font-bold hover:cursor-pointer'}`,
					theme
				)}`} key={idx}
			>
				{page}
			</li>)}
		</menu>


		<button onClick={goNext}>
			<FaArrowRight/>
			Próximo
		</button>
	</div>
}
