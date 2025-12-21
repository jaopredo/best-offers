'use client'
import { use, useEffect, useState } from 'react'
import Link from "next/link"

/* COMPONENTES */
import { CiShoppingBasket } from "react-icons/ci"

/* CONTEXTOS */
import { useThemeContext } from "@/context/theme"
import { useAPIContext } from "@/context/api"

/* TIPOS */
import { Item } from "@/types/api/services/item.service"

/* UTILS */
import { themeSetup } from "@/utils/theme"

export default function Item({ params }: { params: Promise<{id: number}> }) {
	const { id } = use(params)

	/* State do item */
	const [ item, setItem ] = useState<Item>()

	/* Contextos */
    const { theme } = useThemeContext()
    const { itemService } = useAPIContext()

    /* Pegando o item */
    useEffect(() => {
    	itemService.get(id).then(resp=>{
    		if (resp) {
    			setItem(resp.data.item)
    		}
    	})
    }, [])

	return <main className={`relative flex gap-5 flex-col md:flex-row items-stretch justify-center flex-1 p-5 flex-col ${themeSetup('bg-neutral-200', 'bg-[#10161F]', theme)}`}>
		<div className={`
			flex grow-1 md:grow-0 items-center w-full justify-center rounded-lg group md:pl-10 md:pr-10
			${themeSetup('bg-neutral-300', 'bg-[#0b101f]', theme)}
		`}>
			<CiShoppingBasket size={100}  className={`
				group-hover:scale-105 transition-all
				${themeSetup('text-neutral-500', 'text-white', theme)}
			`}/>
		</div>
		<div className={`
			flex flex-col md:min-w-[40%]
		`}>
			<h2 className={`font-bold text-2xl md:text-3xl ${themeSetup('text-[#004E81]', 'text-sky-600', theme)}`}>{item?.name}</h2>
			<h3 className={`font-bold text-xl ${themeSetup('text-gray-800', 'text-white', theme)}`}>R${item?.price}</h3>
			{item?.seller && <p className={`font-bold text-sm ${themeSetup('text-gray-600', 'text-sky-800', theme)}`}>{item.seller}</p>}
			{item?.url && <Link
				href={item?.url}
				target="_blank"
				rel="noopener noreferrer"
				className={`font-bold hover:underline ${themeSetup('text-[#004E81]', 'text-sky-600', theme)}`}
			>Visitar</Link>}

			<div className={`flex items-center justify-between font-bold ${themeSetup('text-gray-700', 'text-white', theme)}`}>
				<p>Categoria</p>

				<p>{item?.category.name}</p>
			</div>
			{item?.font && <div className={`flex items-center justify-between ${themeSetup('text-gray-700', 'text-white', theme)} font-bold`}>
				<p>Fonte</p>

				<p><Link
					href={item.font.url}
					target="_blank"
					rel="noopener noreferrer"
					className={`font-bold hover:underline ${themeSetup('text-[#004E81]', 'text-sky-600', theme)}`}
				>{item.font.name}</Link></p>
			</div>}
		</div>
	</main>
}
