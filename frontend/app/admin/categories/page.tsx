'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

/* COMPONENTES */
import PaginationSection from '@/components/pagination'
import NotFound from '@/components/not-found'
import Filter from '@/components/filter'

/* CONTEXTOS */
import { useAPIContext } from '@/context/api'
import { useThemeContext } from "@/context/theme"

/* TIPOS */
import { Category, CategoryPagination } from '@/types/api/services/category.service'
import { PaginationMeta, Pagination } from "@/types/api"

/* UTILS */
import { themeSetup } from "@/utils/theme"

export default function CategoriesPage() {
	/* Informações para mostrar e paginação */
	const [ categories, setCategories ] = useState<Category[]>([])
	const [ pagination, setPagination ] = useState<CategoryPagination>({
        limit: 10,
        page: 1
    })
    const [ paginationMeta, setPaginationMeta ] = useState<PaginationMeta>()

    /* State para mostrar o filtro */
    const [ seeFilter, setSeeFilter ] = useState<boolean>(false)

    /* Serviço associado */
	const { categoryService } = useAPIContext()

	/* Tema */
	const { theme } = useThemeContext()

	/* State que diz que eu estou carregando as informações */
    const [ loading, setIsLoading ] = useState<boolean>(true)

	useEffect(() => {
        setIsLoading(true)
        categoryService.getAll(pagination).then(resp => {
            setIsLoading(false)
            setCategories(resp.data.data)
            setPaginationMeta(resp.data.meta)
        }).catch(() => setIsLoading(false))
    }, [pagination])


	function removeCategory(id: number) {
		categoryService.delete(id).then(resp => {
			if (resp) {
				setCategories(categories.filter(category => category.id != resp.data.category.id))
			}
		})
	}


	return <div className={`
		p-5 rounded-md h-fit flex flex-col items-center justify-center
		${themeSetup('bg-slate-100', 'bg-[#141d2d]', theme)}
	`}>
		{ categories.length > 0 && <>
			<div className='flex flex-wrap items-center justify-between w-full'>
				<div>
					<h1 className={`
						text-2xl font-bold self-start
						${themeSetup(
				            'text-[#004E81]',
				            'text-stone-200',
				            theme
				        )}
					`}>Categorias</h1>
					<p className={`
						text-lg font-bold self-start
						${themeSetup(
				            'text-[#004E81]',
				            'text-stone-300',
				            theme
				        )}
					`}>Lista de categorias por nome</p>
				</div>
	
				<div className='flex items-center justify-center gap-2'>
					<Link href={'/admin/categories/add'} className={`
						bg-sky-600 text-white rounded-md p-2 hover:bg-sky-700 transition-all active:scale-95
					`}>
						Adicionar
					</Link>
	
					<button className={`
						rounded-md p-2 transition-all active:scale-95
	                    p-2 bg-white ring-1 ring-offset-1 hover:bg-gray-100
	                    font-bold hover:cursor-pointer
	                `} onClick={() => setSeeFilter(!seeFilter)}>
	                    Filtro
	                </button>
				</div>
			</div>

			<table className='w-full table-fixed'>
				<thead>
					<tr>
						<th className={`
							p-2 text-left
							${themeSetup('', 'text-white', theme)}
						`}>Nome</th>
						<th className={`
							p-2 text-left
							${themeSetup('', 'text-white', theme)}
						`}>Ações</th>
					</tr>
				</thead>
				<tbody>
					{categories.map((category, idx) => <tr key={idx}>
						<td className={`
							p-2 text-left
							${themeSetup('', 'text-white', theme)}
						`}>{category.name}</td>

						<td>
							<button type="button" className="outline-none p-1 pl-3 pr-3 text-extrabold text-sm rounded-lg text-red-600 bg-red-500/20 ring-1 ring-red-700 hover:bg-red-500/30 hover:cursor-pointer" onClick={() => {
                                removeCategory(category.id)
                            }}>
                                Deletar
                            </button>

                            <Link href={'/admin/categories/edit'} type="button" className="ml-2 outline-none p-1 pl-3 pr-3 text-extrabold text-sm rounded-lg text-indigo-600 bg-indigo-500/20 ring-1 ring-indigo-700 hover:bg-indigo-500/30 hover:cursor-pointer">
                                Editar
                            </Link>
						</td>
					</tr>)}
				</tbody>
			</table>
	
			{(paginationMeta && paginationMeta.totalPages > 0) && <PaginationSection<CategoryPagination>
	            pagination={pagination}
	            setPagination={setPagination}
	            meta={paginationMeta}
	        />}
		</> }
		{ categories.length == 0 && <>
			<NotFound>
				<p className={`
					text-center font-bold
					${themeSetup('text-[#004E81]', 'text-white', theme)}
				`}>Adicione novas categorias</p>

				<div className='flex items-center justify-center gap-2'>
					<Link href={'/admin/categories/add'} className={`
						bg-sky-600 text-white rounded-md p-2 hover:bg-sky-700 transition-all active:scale-95
					`}>
						Adicionar
					</Link>
					<button className={`
						rounded-md p-2 transition-all active:scale-95
	                    p-2 bg-white ring-1 ring-offset-1 hover:bg-gray-100
	                    font-bold hover:cursor-pointer
	                `} onClick={() => setSeeFilter(!seeFilter)}>
	                    Filtro
	                </button>
	           	</div>
			</NotFound>
		</> }

		<Filter<ItemPagination>
            show={seeFilter}
            setShow={setSeeFilter}
            pagination={pagination}
            setPagination={setPagination}
            schema={[
                {
                    formtool: 'text',
                    label: 'Nome',
                    name: 'name',

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
	</div>
}
