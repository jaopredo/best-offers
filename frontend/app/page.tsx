'use client'
import { useState, useEffect } from "react"

/* TIPOS */
import { PaginationMeta, Pagination } from "@/types/api"
import { Item } from "@/types/api/services/item.service"

/* CONTEXTOS */
import { useAPIContext } from "@/context/api"
import { useThemeContext } from "@/context/theme"

/* COMPONENTES */
import ToggleTheme from "@/components/theme/toggle"
import ItemCard from "@/components/item"
import { AiOutlineLoading } from "react-icons/ai"
import NotFound from '@/components/not-found'
import PaginationSection from '@/components/pagination'

/* UTILS */
import { themeSetup } from "@/utils/theme"


export default function Home() {
    /* Lista de itens e informações para a paginação */
    const [ items, setItems ] = useState<Item[]>([])
    const [ pagination, setPagination ] = useState<Pagination>({
        limit: 10,
        page: 1
    })
    const [ paginationMeta, setPaginationMeta ] = useState<PaginationMeta>()

    /* State que diz que eu estou carregando as informações */
    const [ loading, setIsLoading ] = useState<boolean>(true)

    /* Contextos */
    const { itemService } = useAPIContext()
    const { theme } = useThemeContext()

    useEffect(() => {
        setIsLoading(true)
        itemService.getAll(pagination).then(resp => {
            setIsLoading(false)
            setItems(resp.data.data)
            setPaginationMeta(resp.data.meta)
        }).catch(() => setIsLoading(false))
    }, [pagination])

    return <>
            <header className={`p-5 ${themeSetup('bg-neutral-100', 'bg-[#152338]', theme)}`}>
                <h1 className={`text-2xl font-bold
                    ${themeSetup('text-[#004E81]', 'text-white', theme)}
                `}>SCRAPPER</h1>
                <ToggleTheme/>
            </header>
            <main className={`flex gap-5 flex-col items-stretch justify-center flex-1 p-5 flex-col ${themeSetup('bg-neutral-200', 'bg-[#10161F]', theme)}`}>
                { loading && <div className='flex flex-col items-center justify-center w-full flex-1 gap-2'>
                    <AiOutlineLoading className={`animate-spin ${themeSetup('text-[#004E81]', 'text-white', theme)}`} size={30}/>
                    <p className={`${themeSetup('text-[#004E81]', 'text-white', theme)}`}>Carregando...</p>
                </div> }

                { (!loading && items.length == 0) && <NotFound/> }

                { (!loading && items.length != 0) && <ul className='flex items-stretch justify-center flex-col md:flex-wrap md:flex-row w-[95%] md:w-full gap-5 flex-1'>
                    {items.map((item, idx) => <ItemCard key={idx} {...item}/>)}
                </ul> }

                {paginationMeta && <PaginationSection
                    pagination={pagination}
                    setPagination={setPagination}
                    meta={paginationMeta}
                />}
            </main>
    </>
}
