'use client'
import { useState, useEffect } from "react"

/* TIPOS */
import { PaginationMeta, Pagination } from "@/types/api"
import { Item } from "@/types/api/services/item.service"
import { ItemPagination } from "@/types/api/services/item.service"

/* CONTEXTOS */
import { useAPIContext } from "@/context/api"
import { useThemeContext } from "@/context/theme"

/* COMPONENTES */
import ItemCard from "@/components/item"
import { AiOutlineLoading } from "react-icons/ai"
import NotFound from '@/components/not-found'
import PaginationSection from '@/components/pagination'
import Filter from '@/components/filter'
import { IoFilter } from "react-icons/io5"

/* UTILS */
import { themeSetup } from "@/utils/theme"


export default function Home() {
    /* Lista de itens e informações para a paginação */
    const [ items, setItems ] = useState<Item[]>([])
    const [ pagination, setPagination ] = useState<ItemPagination>({
        limit: 10,
        page: 1
    })
    const [ paginationMeta, setPaginationMeta ] = useState<PaginationMeta>()

    /* State para mostrar o filtro */
    const [ seeFilter, setSeeFilter ] = useState<boolean>(false)

    /* State que diz que eu estou carregando as informações */
    const [ loading, setIsLoading ] = useState<boolean>(true)

    /* Contextos */
    const { itemService } = useAPIContext()
    const { theme } = useThemeContext()

    useEffect(() => {
        setIsLoading(true)
        console.log(pagination)
        itemService.getAll(pagination).then(resp => {
            setIsLoading(false)
            setItems(resp.data.data)
            setPaginationMeta(resp.data.meta)
        }).catch(() => setIsLoading(false))
    }, [pagination])

    const inputStyles = {
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

    return <main className={`relative flex gap-5 flex-col items-stretch justify-center flex-1 p-5 flex-col ${themeSetup('bg-neutral-200', 'bg-[#10161F]', theme)}`}>
            <div className={`
                flex items-center justify-end
            `}>
                <button className={`
                    flex items-center justify-center gap-2 p-2 rounded-sm bg-white ring-1 ring-offset-1 hover:bg-gray-100
                    font-bold self-end
                `} onClick={() => setSeeFilter(!seeFilter)}>
                    <IoFilter/>

                    Filtro
                </button>    
            </div>
            { loading && <div className='flex flex-col items-center justify-center w-full flex-1 gap-2'>
                <AiOutlineLoading className={`animate-spin ${themeSetup('text-[#004E81]', 'text-white', theme)}`} size={30}/>
                <p className={`${themeSetup('text-[#004E81]', 'text-white', theme)}`}>Carregando...</p>
            </div> }

            { (!loading && items.length == 0) && <NotFound/> }

            { (!loading && items.length != 0) && <ul className='flex items-stretch justify-center flex-col md:flex-wrap md:flex-row w-[95%] md:w-full gap-5 flex-1'>
                {items.map((item, idx) => <ItemCard key={idx} {...item}/>)}
            </ul> }

            {(paginationMeta && paginationMeta.totalPages > 0) && <PaginationSection<ItemPagination>
                pagination={pagination}
                setPagination={setPagination}
                meta={paginationMeta}
            />}

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
                        ...inputStyles
                    },
                    {
                        formtool: 'number',
                        label: 'Preço',
                        name: 'price',
                        ...inputStyles
                    },
                    {
                        formtool: 'text',
                        label: 'Vendedor',
                        name: 'seller',
                        ...inputStyles
                    },
                    {
                        formtool: 'text',
                        label: 'URL',
                        name: 'url',
                        ...inputStyles
                    }
                ]}
            />
        </main>
}
